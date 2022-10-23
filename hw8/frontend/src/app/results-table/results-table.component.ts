import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css'],
})
export class ResultsTableComponent implements OnInit {
  @Input() results_table_data: any;
  yelp_data_exists: boolean = true;

  // Business details tab card data
  name: string = 'Cafe Dulce';

  constructor() {}

  ngOnInit(): void {}
}
