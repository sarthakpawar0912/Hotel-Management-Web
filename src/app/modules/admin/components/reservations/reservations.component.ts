import { Component } from '@angular/core';
import { AdminService } from '../../admin-services/admin.service';
import { NzMessageService } from 'ng-zorro-antd/message';


@Component({
  selector: 'app-reservations',
  standalone:false,
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})

export class ReservationsComponent {
  currentPage: number = 1;  // ✅ Renamed from `currentpage`
  total: number = 0;
  reservations: any[] = [];  // ✅ Renamed from `reservation` (should be an array)

  constructor(private adminService: AdminService, private message: NzMessageService) {
    this.getReservations();
  }


  getReservations() {
    this.adminService.getReservations(this.currentPage - 1).subscribe(res => {
      console.log(res);
      this.reservations = res.reservationDtoList;  // ✅ Ensure this matches your API response
      this.total = res.totalpages * 5;
    });
  }


  pageIndexChange(value: number) {  // ✅ Fixed method name (was peakIndexChange)
    this.currentPage = value;
    this.getReservations();
  }


  viewDetails(id: number) {
    this.message.info(`Viewing reservation ID: ${id}`);
  }


  changeReservationStatus(bookingId:number,status:string){
    this.adminService.changeReservationStatus(bookingId,status).subscribe(res=>{
      this.message.success(`Reservation status updated successfully`,
        {nzDuration:5000}
      );
    },error=>{
      this.message.error(`${error.error}`,{nzDuration:5000});
    })
  }

}
