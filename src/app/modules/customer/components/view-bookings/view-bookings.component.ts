import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-view-bookings',
  standalone: false,
  templateUrl: './view-bookings.component.html',
  styleUrl: './view-bookings.component.scss'
})
export class ViewBookingsComponent {
  
  currentPage:any=1;
  total:any;
  bookings:any;

  constructor(private customerService:CustomerService,
    private message:NzMessageService
  ){
    this.getBookings();
  }

  getBookings(){
    this.customerService.getMyBookings(this.currentPage-1).subscribe(res=>{
      console.log(res);
      this.bookings=res.reservationDtoList;
      this.total=res.totalPages*5;
    },error=>{
      this.message.error(`${error.error}`,{nzDuration:5000});
    })
  }

  pageIndexChange(value:any){
    this.currentPage=value;
    this.getBookings();
  }

}
