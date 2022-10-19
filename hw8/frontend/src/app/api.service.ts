import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  search(
    form_keyword: string,
    form_distance: string,
    form_category: string,
    form_location: string
  ) {
    let url =
      'http://127.0.0.1:3000/search?form_keyword=' +
      form_keyword +
      '&form_distance=' +
      form_distance +
      '&form_category=' +
      form_category +
      '&form_location=' +
      form_location;
    return this.http.get(url);
  }
}
