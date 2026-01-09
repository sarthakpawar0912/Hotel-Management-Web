import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostRoomComponent } from './components/post-room/post-room.component';
import { UpdateRoomComponent } from './components/update-room/update-room.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { GuestsComponent } from './components/guests/guests.component';
import { CheckInOutComponent } from './components/check-in-out/check-in-out.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { PaymentsComponent } from './components/payments/payments.component';

const routes: Routes = [
  { path: '', component: AdminComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'room', component: PostRoomComponent },
  { path: 'room/:id/edit', component: UpdateRoomComponent },
  { path: 'reservations', component: ReservationsComponent },
  { path: 'guests', component: GuestsComponent },
  { path: 'check-in-out', component: CheckInOutComponent },
  { path: 'reports', component: ReportsComponent },
  { path: 'reviews', component: ReviewsComponent },
  { path: 'promotions', component: PromotionsComponent },
  { path: 'invoices', component: InvoicesComponent },
  { path: 'payments', component: PaymentsComponent }
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
