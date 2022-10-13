import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// add routes
import { SearchRouteComponent } from './search-route/search-route.component';
import { BookingsRouteComponent } from './bookings-route/bookings-route.component';

// define the route paths. Set the default path to search
const routes: Routes = [
  { path: '', redirectTo: 'search', pathMatch: 'full' },
  { path: 'search', component: SearchRouteComponent },
  { path: 'bookings', component: BookingsRouteComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
