import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';

// for modal
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css'],
})
export class ResultsTableComponent implements OnInit {
  @Input() results_table_data: any;
  @Input() load_completed_table: any;
  load_completed_card: boolean = false; // to display the card all at once

  // Business details tab card data
  business_clicked: boolean = false; // business hasnt been clicked when the table appears
  name: any = null;
  address: any = null;
  categories: any = null;
  phone: any = null;
  price: any = null;
  status: any = null;
  url: any = null;
  photo1: any = null;
  photo2: any = null;
  photo3: any = null;

  // Reserve Modal
  close_result = '';

  // reviews
  review_list: any;

  // Maps
  // Set to random lat lng, will change in the api call
  mapOptions: google.maps.MapOptions = {
    center: { lat: 40.70274718768062, lng: -73.99343490196397 },
    zoom: 14,
  };
  marker = {
    position: { lat: 40.70274718768062, lng: -73.99343490196397 },
  };

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
    //config.maxDate = { year: 2099, month: 12, day: 31 };
    config.outsideDays = 'hidden';
  }

  // This is to avoid being stuck on the business tab card screen when on it and submitting a new query. This will set business_clicked to false whenever the parent component sends it new data.
  ngOnChanges() {
    this.business_clicked = false;
    this.load_completed_card = false;
  }

  ngOnInit(): void {}

  get_business_details(id: any) {
    this.business_clicked = true; // business was clicked from the table.
    console.log(id);

    this.api.get_business_details(id).subscribe((data) => {
      console.log(Object.values(data));
      this.name = Object.values(data)[6];
      this.address = Object.values(data)[5];
      this.categories = Object.values(data)[0];
      this.phone = Object.values(data)[3];
      this.price = Object.values(data)[10];
      this.status = Object.values(data)[4];
      this.url = Object.values(data)[11];
      this.photo1 = Object.values(data)[7];
      this.photo2 = Object.values(data)[8];
      this.photo3 = Object.values(data)[9];

      this.review_list = Object.values(data)[12];

      var lat = Object.values(data)[1];
      var lng = Object.values(data)[2];
      this.mapOptions = {
        center: { lat: lat, lng: lng },
        zoom: 14,
      };
      this.marker = { position: { lat: lat, lng: lng } };

      this.load_completed_card = true; // at the very bottom
    });
  }

  go_back_to_table() {
    this.business_clicked = false; // go back and render the table
    this.load_completed_card = false;
    this.name = null;
    this.address = null;
    this.categories = null;
    this.phone = null;
    this.price = null;
    this.status = null;
    this.url = null;
    this.photo1 = null;
    this.photo2 = null;
    this.photo3 = null;
  }

  open_modal(content: any) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then(
        (result) => {
          this.close_result = `Closed with ${result}`;
        },
        (reason) => {
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
}
