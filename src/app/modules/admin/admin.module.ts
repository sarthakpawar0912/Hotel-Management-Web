import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminComponent } from './admin.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { PostRoomComponent } from './components/post-room/post-room.component';
import { DemoNgZorroAntdModule } from '../../DemoNgZorroAntdModule';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSkeletonModule } from 'ng-zorro-antd/skeleton';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzPaginationModule } from 'ng-zorro-antd/pagination';
import { UpdateRoomComponent } from './components/update-room/update-room.component';
import { NzSpinModule } from 'ng-zorro-antd/spin';
import { ReservationsComponent } from './components/reservations/reservations.component';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzMessageModule } from 'ng-zorro-antd/message';


@NgModule({
  declarations: [
    AdminComponent,
    PostRoomComponent,
    UpdateRoomComponent,
    DashboardComponent,
    ReservationsComponent
  ],

  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
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
    NzPaginationModule,
    NzSpinModule
  ]
})

export class AdminModule { }
