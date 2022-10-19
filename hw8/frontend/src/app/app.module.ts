import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchRouteComponent } from './search-route/search-route.component';
import { BookingsRouteComponent } from './bookings-route/bookings-route.component';
import { ResultsTableComponent } from './results-table/results-table.component';

@NgModule({
  declarations: [AppComponent, SearchRouteComponent, BookingsRouteComponent, ResultsTableComponent],
  imports: [BrowserModule, HttpClientModule, AppRoutingModule, FormsModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
