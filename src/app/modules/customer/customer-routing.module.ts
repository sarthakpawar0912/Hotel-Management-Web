import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CustomerLayoutComponent } from './components/layout/customer-layout.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { ViewBookingsComponent } from './components/view-bookings/view-bookings.component';
import { CustomerReviewsComponent } from './components/reviews/customer-reviews.component';
import { CustomerNotificationsComponent } from './components/notifications/customer-notifications.component';
import { CustomerPromotionsComponent } from './components/promotions/customer-promotions.component';

const routes: Routes = [
  {
    path: '',
    component: CustomerLayoutComponent,
    children: [
      { path: '', redirectTo: 'rooms', pathMatch: 'full' },
      { path: 'rooms', component: RoomsComponent },
      { path: 'bookings', component: ViewBookingsComponent },
      { path: 'reviews', component: CustomerReviewsComponent },
      { path: 'notifications', component: CustomerNotificationsComponent },
      { path: 'promotions', component: CustomerPromotionsComponent }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CustomerRoutingModule { }
