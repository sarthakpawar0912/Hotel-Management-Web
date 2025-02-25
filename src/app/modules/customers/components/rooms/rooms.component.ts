import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminService } from '../../../admin/admin-services/admin.service';
import { CustomerService } from '../../services/customer.service';
import { UserStorageService } from '../../../../auth/services/storage/user-storage.service';

@Component({
  selector: 'app-rooms',
  standalone:false,
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})

export class RoomsComponent {
  currentpage = 1;
  rooms: any[] = [];
  total = 0;
  loading = false;
  isVisibleMiddle: boolean = false;
  date: Date[] = [];
  checkInDate!: Date;
  checkOutDate!: Date;
  id!: number;


  constructor(
    private customerService: CustomerService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private userStorageService: UserStorageService // ✅ Inject the service here
  ) {
    this.getRooms();
  }


  getRooms() {
    this.customerService.getRooms(this.currentpage - 1).subscribe(res => {
      console.log('Rooms API Response:', res);
      if (res && res.roomDtoList) {
        this.rooms = res.roomDtoList;
        this.total = res.totalPages * 10;
      } else {
        this.rooms = [];
        this.total = 0;
      }
      this.loading = false;
    }, error => {
      this.message.error(`Failed to load rooms: ${error.error}`);
      this.loading = false;
    });
  }


  pageIndexChange(value: any) {
    this.currentpage = value;
    this.getRooms();
  }


  onChange(result: Date[]): void {
    if (result.length === 2) {
      this.checkInDate = result[0];
      this.checkOutDate = result[1];
    }
  }


  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }


  handleOkMiddle(): void {
    const obj = {
      userId: this.userStorageService.getUserId(), // ✅ Call getUserId() from instance
      roomId: this.id,
      checkInDate: this.checkInDate,
      checkOutDate: this.checkOutDate
    };


    this.customerService.bookRoom(obj).subscribe(res => {
      this.message.success(`Request submitted for approval..!`, { nzDuration: 5000 });
      this.isVisibleMiddle = false;
    }, error => {
      this.message.error(`${error.error}`, { nzDuration: 5000 });
    });
  }


  showModalMiddle(id: number) {
    this.id = id;
    this.isVisibleMiddle = true;
  }
  
}
