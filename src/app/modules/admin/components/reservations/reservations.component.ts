import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-reservations',
  standalone: false,
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent {
 
  currentPage: number = 1;
  total: number = 0;
  reservations: any[] = [];

  constructor(private adminService: AdminService,
     private message: NzMessageService) {}

  ngOnInit() {
    this.getReservations();
  }

  // ✅ Fetch reservations from API
  getReservations() {
    this.adminService.getReservations(this.currentPage - 1).subscribe(
      res => {
        console.log("✅ Reservations API Response: ", res);
        this.reservations = res.reservationDtoList;
        this.total = res.totalPages * 4;  // ✅ Matches backend's `SEARCH_RESULT_PER_PAGE = 4`
        
        // 🔹 Ensure page is within valid range
        if (this.reservations.length === 0 && this.currentPage > 1) {
          this.currentPage = 1; // Reset to first page if no data
        }
      },
      error => {
        console.error("❌ Error fetching reservations:", error);
        // 🔹 Only show error if it's not "no data"
        if (error.status !== 404) {
          this.message.error(`Failed to load reservations: ${error.error?.message || "Unknown error"}`);
        }
      }
    );
  }
  
// ✅ Change reservation status
  changeReservationStatus(reservationId: number, status: string) {
    this.adminService.changeReservationStatus(reservationId, status).subscribe(
      () => {
        this.message.success(`Reservation status updated to ${status}`);
        this.getReservations();  // Refresh the list after update
      },
      error => {
        this.message.error(`Failed to update reservation: ${error.error?.message || "Unknown error"}`);
      }
    );
  }

  // ✅ Handle page changes
  pageIndexChange(value: number) {
    if (value > Math.ceil(this.total / 4)) return;  // 🔹 Prevent API call for out-of-range pages
    this.currentPage = value;
    this.getReservations();
  }
  
}
