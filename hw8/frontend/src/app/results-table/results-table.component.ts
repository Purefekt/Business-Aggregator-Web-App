import { Component, OnInit, Input } from '@angular/core';
import { ApiService } from '../api.service';

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

  review_list: any;

  constructor(private api: ApiService) {}

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
      this.review_list = Object.values(data)[12];
      this.load_completed_card = true; // at the very bottom
    });
  }

  go_back_to_table() {
    this.business_clicked = false; // go back and render the table
    this.load_completed_card = false;
    this.name = null;
  }
}
