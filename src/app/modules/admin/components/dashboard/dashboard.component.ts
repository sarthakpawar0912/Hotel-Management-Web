import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent {
  
  currentpage = 1;
  rooms: any[] = [];
  total = 0;
  loading = false;

  
  constructor(
    private adminService: AdminService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) {
    this.getRooms();
  }


  getRooms() {
    this.adminService.getRooms(this.currentpage - 1).subscribe(res => {
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


  deleteRoom(roomId: number) {
    this.adminService.deleteRoom(roomId).subscribe(res => {
      this.message.success(`Room Deleted Successfully`, { nzDuration: 5000 });
      this.getRooms(); // ✅ Refresh list after deletion
    }, error => {
      this.message.error(`${error.error}`, { nzDuration: 5000 });
    });
  }


  showConfirm(roomId: number) {
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Do you want to delete this room?',
      nzOkText: 'Delete',
      nzCancelText: 'Cancel',
      nzOnOk: () => this.deleteRoom(roomId)
    });
  }

 
}
