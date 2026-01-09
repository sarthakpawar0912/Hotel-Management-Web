import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-reservations',
  standalone: false,
  templateUrl: './reservations.component.html',
  styleUrl: './reservations.component.scss'
})
export class ReservationsComponent implements OnInit {

  currentPage = 1;
  total = 0;
  reservations: any[] = [];
  allReservations: any[] = [];
  loading = false;

  // Filters
  filterStatus: string | null = null;
  dateRange: Date[] | null = null;

  constructor(
    private adminService: AdminService,
    private message: NzMessageService
  ) {}

  ngOnInit() {
    this.getReservations();
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'orange',
      'APPROVED': 'green',
      'REJECTED': 'red',
      'CHECKED_IN': 'blue',
      'CHECKED_OUT': 'purple',
      'CANCELLED': 'default',
      'NO_SHOW': 'volcano'
    };
    return colors[status] || 'default';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'PENDING': 'clock-circle',
      'APPROVED': 'check-circle',
      'REJECTED': 'close-circle',
      'CHECKED_IN': 'login',
      'CHECKED_OUT': 'logout',
      'CANCELLED': 'stop',
      'NO_SHOW': 'user-delete'
    };
    return icons[status] || 'question-circle';
  }

  getPendingCount(): number {
    return this.allReservations.filter(r => r.reservationStatus === 'PENDING').length;
  }

  onFilterChange() {
    this.currentPage = 1;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.allReservations];

    if (this.filterStatus && this.filterStatus !== 'ALL') {
      filtered = filtered.filter(r => r.reservationStatus === this.filterStatus);
    }

    if (this.dateRange && this.dateRange.length === 2) {
      const startDate = this.dateRange[0];
      const endDate = this.dateRange[1];
      filtered = filtered.filter(r => {
        const checkIn = new Date(r.checkInDate);
        return checkIn >= startDate && checkIn <= endDate;
      });
    }

    this.reservations = filtered;
    this.total = filtered.length;
  }

  clearFilters() {
    this.filterStatus = null;
    this.dateRange = null;
    this.reservations = [...this.allReservations];
    this.total = this.allReservations.length;
    this.currentPage = 1;
  }

  getReservations() {
    this.loading = true;
    this.adminService.getReservations(this.currentPage - 1).subscribe({
      next: (res) => {
        this.allReservations = res.reservationDtoList || [];
        this.reservations = [...this.allReservations];
        this.total = res.totalElements || this.allReservations.length;

        if (this.filterStatus || this.dateRange) {
          this.applyFilters();
        }

        this.loading = false;
      },
      error: (error) => {
        this.loading = false;
        if (error.status !== 404) {
          this.message.error(`Failed to load reservations`);
        }
      }
    });
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
