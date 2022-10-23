import { Component, OnInit, Input, OnChanges } from '@angular/core';

@Component({
  selector: 'app-results-table',
  templateUrl: './results-table.component.html',
  styleUrls: ['./results-table.component.css'],
})
export class ResultsTableComponent implements OnInit {
  @Input() results_table_data: any;

  // Business details tab card data
  business_clicked: boolean = false; // business hasnt been clicked when the table appears
  name: string = '';

  constructor() {}

  // This is to avoid being stuck on the business tab card screen when on it and submitting a new query. This will set business_clicked to false whenever the parent component sends it new data.
  ngOnChanges() {
    this.business_clicked = false;
  }

  ngOnInit(): void {}

  get_business_details(id: any) {
    this.business_clicked = true; // business was clicked from the table.
    this.name = id;
    console.log(id);
  }

  go_back_to_table() {
    this.business_clicked = false; // go back and render the table
  }
}
