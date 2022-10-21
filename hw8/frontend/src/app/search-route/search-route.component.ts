import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/api.service';

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

  constructor(private api: ApiService) {}

  ngOnInit(): void {}

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
        // add the data to this.data to pass to the results-table component
        for (var i = 0; i < Object.keys(data).length; i++) {
          this.data.push(Object.values(data)[i]);
        }

        // change the no_yelp_data flag based on if data came or not
        if (Object.keys(this.data).length === 0) {
          console.log('no data found');
          this.no_yelp_data = true;
        } else {
          this.no_yelp_data = false;
          console.log('data found');
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
