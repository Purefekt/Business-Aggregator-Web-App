import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchRouteComponent } from './search-route/search-route.component';
import { BookingsRouteComponent } from './bookings-route/bookings-route.component';

@NgModule({
  declarations: [AppComponent, SearchRouteComponent, BookingsRouteComponent],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
