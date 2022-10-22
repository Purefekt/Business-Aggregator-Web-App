import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';

// For auto complete
import { FormControl } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {
  debounceTime,
  tap,
  switchMap,
  finalize,
  distinctUntilChanged,
  filter,
} from 'rxjs/operators';
const YELP_API_KEY =
  'H2ckcPhI3zXZ6rasK0NGHswOf9JCf6YDne7GetsqnPBVnri3uM2-ZsehURtPhvjbfT62o3wqQKlcJ2fsd1bm3pvpkfwkeGiDV34Db6kiV8UQRNSbdjVhF0DVxcgqY3Yx';
const headers = new HttpHeaders()
  .set('Authorization', `Bearer ${YELP_API_KEY}`)
  .set('Access-Control-Allow-Origin', '*');
// // // // // // // // //

@Component({
  selector: 'app-search-route',
  templateUrl: './search-route.component.html',
  styleUrls: ['./search-route.component.css'],
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

  no_yelp_data: boolean = true;

  // for auto complete
  input_keyword_search_control = new FormControl();
  autocompleted_keywords: any;
  isLoading = false;
  minLengthTerm = 3;

  onSelected() {
    console.log(this.input_keyword);
    this.input_keyword = this.input_keyword;
  }

  displayWith(value: any) {
    return value?.text;
  }

  constructor(private api: ApiService, private http: HttpClient) {}
  // without auto complete -> constructor(private api: ApiService) {}

  ngOnInit(): void {
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
          this.http
            .get(
              'https://corsanywhere.herokuapp.com/https://api.yelp.com/v3/autocomplete?text=' +
                value,
              {
                headers,
              }
            )
            .pipe(
              finalize(() => {
                this.isLoading = false;
              })
            )
        )
      )
      .subscribe((data: any) => {
        if (data['terms'].length == 0 && data['categories'].length == 0) {
          this.autocompleted_keywords = [];
        } else {
          if (data['terms'].length > 0) {
            for (let i = 0; i < data['terms'].length; i++) {
              this.autocompleted_keywords.push(data['terms'][i]);
            }
          }
          if (data['categories'].length > 0) {
            for (let i = 0; i < data['categories'].length; i++) {
              this.autocompleted_keywords.push({
                text: data['categories'][i]['title'],
              });
            }
          }
        }
        console.log(this.autocompleted_keywords);
      });
  }

  async search(
    form_keyword: string,
    form_distance: string,
    form_category: string,
    form_location: string
  ) {
    // reset data on every call of search
    this.data = [];

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
        this.no_yelp_data = true;
        if (Object.keys(data).length == 0) {
          this.no_yelp_data = true;
        } else {
          this.no_yelp_data = false;
          // add the data to this.data to pass to the results-table component
          for (var i = 0; i < Object.keys(data).length; i++) {
            this.data.push(Object.values(data)[i]);
          }
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
}
