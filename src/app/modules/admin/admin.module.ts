import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostRoomComponent } from './components/post-room/post-room.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { DemoNgZorroAntdModule } from '../../DemoNgZorroAntdModule';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { UpdateRoomComponent } from './components/update-room/update-room.component';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { GuestsComponent } from './components/guests/guests.component';
import { CheckInOutComponent } from './components/check-in-out/check-in-out.component';
import { ReportsComponent } from './components/reports/reports.component';
import { ReviewsComponent } from './components/reviews/reviews.component';
import { PromotionsComponent } from './components/promotions/promotions.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { PaymentsComponent } from './components/payments/payments.component';


@NgModule({
  declarations: [
    AdminComponent,
    DashboardComponent,
    PostRoomComponent,
    UpdateRoomComponent,
    ReservationsComponent,
    GuestsComponent,
    CheckInOutComponent,
    ReportsComponent,
    ReviewsComponent,
    PromotionsComponent,
    InvoicesComponent,
    PaymentsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    NzModalModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzMessageModule,
    NzTableModule,
    NzTagModule,
    NzPaginationModule,
    AdminRoutingModule,
    DemoNgZorroAntdModule,
    NzCardModule,
    NzSkeletonModule,
    NzAvatarModule,
    NzIconModule,
    NzSpinModule,
    NzSelectModule,
    NzDatePickerModule,
    NzInputNumberModule,
    NzDividerModule,
    NzStatisticModule,
    NzTabsModule,
    NzEmptyModule,
    NzRateModule,
    NzToolTipModule
  ],
  providers: [
    NzModalService
  ]
})
export class AdminModule { }
