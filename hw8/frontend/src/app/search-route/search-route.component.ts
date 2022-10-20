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
  input_category = '';
  input_location = '';
  data: Array<any> = [];

  constructor(private api: ApiService) {}

  ngOnInit(): void {}

  async search() {
    // if auto detect loc checkbox is checked, get the ip address of the client
    var check_auto_detect = document.getElementById(
      'check_auto_detect'
    ) as HTMLInputElement;
    if (check_auto_detect.checked) {
      const t = fetch('https://api.ipify.org/').then((r) => r.text());
      const ip_add = await t;

      this.input_location = '1' + ip_add;
    } else {
      this.input_location = '0' + this.input_location;
    }
    // save input_location in a new var since keeping the value will display it in the location text box
    var form_location = this.input_location;
    this.input_location = '';

    this.api
      .search(
        this.input_keyword,
        this.input_distance,
        this.input_category,
        form_location
      )
      .subscribe((data) => {
        // add the data to this.data to pass to the results-table component
        for (var i = 0; i < Object.keys(data).length; i++) {
          this.data.push(Object.values(data)[i]);
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
