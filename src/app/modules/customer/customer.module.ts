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
import { AdminRoutingModule } from '../admin/admin-routing.module';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { ViewBookingsComponent } from './components/view-bookings/view-bookings.component';


@NgModule({
  declarations: [
    CustomerComponent,
    RoomsComponent,
    ViewBookingsComponent
  ],
  imports: [
    CommonModule,
    CustomerRoutingModule,
    DemoNgZorroAntdModule,
     FormsModule,
     NzTagModule  ,
     NzTableModule ,
     NzDatePickerModule,
        NzFormModule,       // ✅ Required for nz-form and nz-form-item
        NzInputModule,      // ✅ Required for nz-input
        NzButtonModule,     // ✅ Required for nz-button
        NzMessageModule,
        AdminRoutingModule,
        DemoNgZorroAntdModule,
        NzCardModule,
        NzSkeletonModule,
        NzAvatarModule,
        NzIconModule,
        NzPaginationModule,
        NzSpinModule,
         CommonModule,
            ReactiveFormsModule,
            NzModalModule
  ]
})
export class CustomerModule { }
