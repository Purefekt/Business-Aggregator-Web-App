import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-bookings-route',
  templateUrl: './bookings-route.component.html',
  styleUrls: ['./bookings-route.component.css'],
})
export class BookingsRouteComponent implements OnInit {
  reservations_exist: any;
  reservations: any = [];

  constructor() {}

  ngOnInit(): void {
    if (localStorage.length > 0) {
      this.reservations_exist = true;

      // add localstorage data to reservations
      var keys = Object.keys(localStorage);
      for (let i = 0; i < localStorage.length; i++) {
        var data_string = localStorage.getItem(keys[i]);
        // add index
        data_string += `,"index":"${i + 1}"}`;
        console.log(data_string);
        this.reservations.push(JSON.parse(data_string!));
      }
      console.log(this.reservations);
    } else {
      this.reservations_exist = false;
    }
  }

  delete_reservation() {}
}
