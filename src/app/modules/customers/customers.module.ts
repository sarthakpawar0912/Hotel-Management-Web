import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CustomersRoutingModule } from './customers-routing.module';
import { CustomersComponent } from './customers.component';
import { DemoNgZorroAntdModule } from '../../DemoNgZorroAntdModule';
import { RoomsComponent } from './components/rooms/rooms.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { AdminRoutingModule } from '../admin/admin-routing.module';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { UserStorageService } from '../../auth/services/storage/user-storage.service';
import { ViewBookingsComponent } from './components/view-bookings/view-bookings.component';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';

@NgModule({
  declarations: [
    CustomersComponent,
    RoomsComponent,
    ViewBookingsComponent
   ],
  imports: [
    CommonModule,
    CustomersRoutingModule,
    DemoNgZorroAntdModule,
     FormsModule,
     NzTagModule  ,
     NzTableModule ,
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
export class CustomersModule { }
