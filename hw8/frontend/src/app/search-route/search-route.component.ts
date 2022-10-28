import { Component, OnInit, Injectable } from '@angular/core';
import { ApiService } from 'src/app/api.service';

// For auto complete
import { FormControl } from '@angular/forms';
import {
  debounceTime,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
// // // // // // // // // For auto complete

////////////////////////////////////////////////////////////////////////////////////////////
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import {
  NgbDatepickerConfig,
  NgbDateAdapter,
  NgbDateStruct,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
@Injectable()
export class CustomDateAdapter {
  fromModel(value: string): NgbDateStruct {
    if (!value) return null!;
    let parts = value.split('/');
    return {
      year: +parts[0],
      month: +parts[1],
      day: +parts[2],
    } as NgbDateStruct;
  }

  toModel(date: NgbDateStruct): string {
    // from internal model -> your mode
    return date
      ? date.year +
          '/' +
          ('0' + date.month).slice(-2) +
          '/' +
          ('0' + date.day).slice(-2)
      : null!;
  }
}
@Injectable()
export class CustomDateParserFormatter {
  parse(value: string): NgbDateStruct {
    if (!value) return null!;
    let parts = value.split('/');
    return {
      year: +parts[0],
      month: +parts[1],
      day: +parts[2],
    } as NgbDateStruct;
  }
  format(date: NgbDateStruct): string {
    return date
      ? ('0' + date.month).slice(-2) +
          '/' +
          ('0' + date.day).slice(-2) +
          '/' +
          date.year
      : null!;
  }
}

////////////////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'app-search-route',
  templateUrl: './search-route.component.html',
  styleUrls: ['./search-route.component.css'],
  providers: [
    { provide: NgbDateAdapter, useClass: CustomDateAdapter },
    { provide: NgbDateParserFormatter, useClass: CustomDateParserFormatter },
  ],
})
export class SearchRouteComponent implements OnInit {
  input_keyword = '';
  input_distance = '';
  input_category = [
    { name: 'Default', value: 'all' },
    { name: 'Arts & Entertainment', value: 'arts' },
    { name: 'Health & Medical', value: 'health' },
    { name: 'Hotels & Travel', value: 'hotelstravel' },
    { name: 'Food', value: 'food' },
    { name: 'Professional Services', value: 'professional' },
  ];
  input_category_selected_val: string = 'all';
  input_location = '';
  data: Array<any> = [];

  no_yelp_data: any;
  first_search_performed: boolean = false;

  // For auto complete
  input_keyword_search_control = new FormControl();
  autocompleted_keywords: any;
  isLoading = false;
  minLengthTerm = 1;
  onSelected() {
    this.input_keyword = this.input_keyword;
  }
  displayWith(value: any) {
    return value?.text;
  }
  // // // // // // // // // For auto complete

  load_completed: boolean = false; //to display table when all data has arrived

  ////////////////////////////////////////////////////////////////////////////////////////////
  constructor(
    private api: ApiService,
    private modalService: NgbModal,
    private config: NgbDatepickerConfig
  ) {
    const current = new Date();
    config.minDate = {
      year: current.getFullYear(),
      month: current.getMonth() + 1,
      day: current.getDate(),
    };
    config.outsideDays = 'hidden';
  }

  calendar_date_input: any;
  print_calendar_date_input() {
    console.log(this.calendar_date_input);
  }

  close_result = '';
  open_modal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.calendar_date_input = null;
          this.close_result = `Closed with ${result}`;
        },
        (reason) => {
          this.calendar_date_input = null;
          this.close_result = `Dismissed ${this.get_dismissed_reason(reason)}`;
        }
      );
  }
  private get_dismissed_reason(reason: any) {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  ////////////////////////////////////////////////////////////////////////////////////////////

  ngOnInit(): void {
    // Everything inside is for autocomplete
    this.input_keyword_search_control.valueChanges
      .pipe(
        filter((res) => {
          return res !== null && res.length >= this.minLengthTerm;
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.autocompleted_keywords = [];
          this.isLoading = true;
        }),
        switchMap((value) =>
          this.api.autocomplete(value).pipe(
            finalize(() => {
              this.isLoading = false;
            })
          )
        )
      )
      .subscribe((data: any) => {
        this.autocompleted_keywords = data;
      });
  }

  async search(
    form_keyword: string,
    form_distance: string,
    form_category: string,
    form_location: string
  ) {
    this.data = []; // reset data on every call of search
    this.first_search_performed = true; // set to true on the very FIRST search
    this.load_completed = false;

    // if auto detect loc checkbox is checked, get the ip address of the client
    var check_auto_detect = document.getElementById(
      'check_auto_detect'
    ) as HTMLInputElement;
    if (check_auto_detect.checked) {
      const t = fetch('https://api.ipify.org/').then((r) => r.text());
      const ip_add = await t;

      form_location = '1' + ip_add;
    } else {
      form_location = '0' + form_location;
    }

    this.api
      .search(form_keyword, form_distance, form_category, form_location)
      .subscribe((data) => {
        // reset this for every next submit
        if (Object.keys(data).length == 0) {
          this.no_yelp_data = true;
        } else {
          this.no_yelp_data = false;
          // add the data to this.data to pass to the results-table component
          this.data = []; // reset data to avoid errors on pressing submit twice too quickly
          for (var i = 0; i < Object.keys(data).length; i++) {
            this.data.push(Object.values(data)[i]);
          }
          this.load_completed = true;
        }
      });
  }

  // disable the location input box if auto detect checkbox is on
  disable_location_input() {
    var check_auto_detect = document.getElementById(
      'check_auto_detect'
    ) as HTMLInputElement;
    var input_location = document.getElementById(
      'input_location'
    ) as HTMLInputElement;

    if (check_auto_detect?.checked) {
      input_location.value = '';
      input_location.disabled = true;
    } else {
      input_location.disabled = false;
    }
  }

  // clear button
  clear_button_func() {
    this.input_keyword = '';
    this.input_distance = '';
    this.input_category = [
      { name: 'Default', value: 'all' },
      { name: 'Arts & Entertainment', value: 'arts' },
      { name: 'Health & Medical', value: 'health' },
      { name: 'Hotels & Travel', value: 'hotelstravel' },
      { name: 'Food', value: 'food' },
      { name: 'Professional Services', value: 'professional' },
    ];
    this.input_location = '';
    var auto_detect_check = document.getElementById(
      'check_auto_detect'
    ) as HTMLInputElement;
    auto_detect_check.checked = false;
    var input_location = document.getElementById(
      'input_location'
    ) as HTMLInputElement;
    input_location.disabled = false;
    this.first_search_performed = false;
    this.no_yelp_data = null;
    this.load_completed = false;
  }
}
