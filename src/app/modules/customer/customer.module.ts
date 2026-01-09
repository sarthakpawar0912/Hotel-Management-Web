import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomerRoutingModule } from './customer-routing.module';
import { CustomerComponent } from './customer.component';
import { RoomsComponent } from './components/rooms/rooms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzMessageModule } from 'ng-zorro-antd/message';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { DemoNgZorroAntdModule } from '../../DemoNgZorroAntdModule';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzListModule } from 'ng-zorro-antd/list';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzRibbonModule } from 'ng-zorro-antd/ribbon';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzToolTipModule } from 'ng-zorro-antd/tooltip';
import { NzPopconfirmModule } from 'ng-zorro-antd/popconfirm';
import { NzProgressModule } from 'ng-zorro-antd/progress';
import { NzCollapseModule } from 'ng-zorro-antd/collapse';
import { ViewBookingsComponent } from './components/view-bookings/view-bookings.component';
import { CustomerReviewsComponent } from './components/reviews/customer-reviews.component';
import { CustomerNotificationsComponent } from './components/notifications/customer-notifications.component';
import { CustomerPromotionsComponent } from './components/promotions/customer-promotions.component';
import { CustomerLayoutComponent } from './components/layout/customer-layout.component';


@NgModule({
  declarations: [
    CustomerComponent,
    CustomerLayoutComponent,
    RoomsComponent,
    ViewBookingsComponent,
    CustomerReviewsComponent,
    CustomerNotificationsComponent,
    CustomerPromotionsComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    DemoNgZorroAntdModule,
    FormsModule,
    ReactiveFormsModule,
    NzTagModule,
    NzTableModule,
    NzDatePickerModule,
    NzFormModule,
    NzInputModule,
    NzButtonModule,
    NzMessageModule,
    NzCardModule,
    NzSkeletonModule,
    NzAvatarModule,
    NzIconModule,
    NzPaginationModule,
    NzSpinModule,
    NzModalModule,
    NzListModule,
    NzEmptyModule,
    NzRateModule,
    NzCheckboxModule,
    NzSelectModule,
    NzInputNumberModule,
    NzDividerModule,
    NzRibbonModule,
    NzAlertModule,
    NzBadgeModule,
    NzToolTipModule,
    NzPopconfirmModule,
    NzProgressModule,
    NzCollapseModule
  ]
})
export class CustomerModule { }
