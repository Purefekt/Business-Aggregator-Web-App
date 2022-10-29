import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private http: HttpClient) {}

  API_url = 'https://web-tech-assignment-8-backend.wl.r.appspot.com';

  search(
    form_keyword: string,
    form_distance: string,
    form_category: string,
    form_location: string
  ) {
    let url =
      `${this.API_url}/search?form_keyword=` +
      form_keyword +
      '&form_distance=' +
      form_distance +
      '&form_category=' +
      form_category +
      '&form_location=' +
      form_location;
    return this.http.get(url);
  }

  autocomplete(initial_text: string) {
    let url = `${this.API_url}/autocomplete?initial_text=` + initial_text;
    return this.http.get(url);
  }

  get_business_details(id: string) {
    let url = `${this.API_url}/get_business_details?id=` + id;
    return this.http.get(url);
  }
}
