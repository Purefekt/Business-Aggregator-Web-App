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
        // remove last } and add the index
        var data_string = localStorage.getItem(keys[i])!;
        data_string = data_string.substring(0, data_string.length - 1);
        data_string += `,"index":"${i + 1}"}`;
        this.reservations.push(JSON.parse(data_string));
      }
    } else {
      this.reservations_exist = false;
    }
  }

  delete_reservation(key: any) {
    localStorage.removeItem(key);
    alert('Reservation cancelled!');

    // reset reservations
    if (localStorage.length > 0) {
      this.reservations_exist = true;

      // add localstorage data to reservations
      var keys = Object.keys(localStorage);
      this.reservations = [];
      for (let i = 0; i < localStorage.length; i++) {
        // remove last } and add the index
        var data_string = localStorage.getItem(keys[i])!;
        data_string = data_string.substring(0, data_string.length - 1);
        data_string += `,"index":"${i + 1}"}`;
        this.reservations.push(JSON.parse(data_string));
      }
    } else {
      this.reservations_exist = false;
    }
  }
}
