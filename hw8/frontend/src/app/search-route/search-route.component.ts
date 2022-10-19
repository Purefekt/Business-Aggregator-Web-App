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

  search(
    form_keyword: string,
    form_distance: string,
    form_category: string,
    form_location: string
  ) {
    this.api
      .search(form_keyword, form_distance, form_category, form_location)
      .subscribe((data) => {
        console.log(data);
      });
  }
}
