import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-check-in-out',
  standalone: false,
  templateUrl: './check-in-out.component.html',
  styleUrls: ['./check-in-out.component.scss']
})
export class CheckInOutComponent implements OnInit {
  todayCheckIns: any[] = [];
  todayCheckOuts: any[] = [];
  currentlyCheckedIn: any[] = [];
  occupancyStatus: any = {};
  dailySummary: any = {};

  loading = false;
  activeTab = 0;

  constructor(
    private adminService: AdminService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadAllData();
  }

  loadAllData(): void {
    this.loading = true;
    this.loadTodayCheckIns();
    this.loadTodayCheckOuts();
    this.loadCurrentlyCheckedIn();
    this.loadOccupancyStatus();
    this.loadDailySummary();
  }

  loadTodayCheckIns(): void {
    this.adminService.getTodayCheckIns().subscribe({
      next: (res) => this.todayCheckIns = res,
      error: () => this.message.error('Failed to load check-ins')
    });
  }

  loadTodayCheckOuts(): void {
    this.adminService.getTodayCheckOuts().subscribe({
      next: (res) => this.todayCheckOuts = res,
      error: () => this.message.error('Failed to load check-outs')
    });
  }

  loadCurrentlyCheckedIn(): void {
    this.adminService.getCurrentlyCheckedInGuests().subscribe({
      next: (res) => {
        this.currentlyCheckedIn = res;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load checked-in guests');
        this.loading = false;
      }
    });
  }

  loadOccupancyStatus(): void {
    this.adminService.getOccupancyStatus().subscribe({
      next: (res) => this.occupancyStatus = res,
      error: () => {}
    });
  }

  loadDailySummary(): void {
    const today = new Date().toISOString().split('T')[0];
    this.adminService.getDailySummary(today).subscribe({
      next: (res) => this.dailySummary = res,
      error: () => {}
    });
  }

  checkIn(reservationId: number): void {
    this.modal.confirm({
      nzTitle: 'Confirm Check-In',
      nzContent: 'Are you sure you want to check in this guest?',
      nzOnOk: () => {
        this.adminService.checkIn(reservationId).subscribe({
          next: () => {
            this.message.success('Guest checked in successfully');
            this.loadAllData();
          },
          error: () => this.message.error('Failed to check in guest')
        });
      }
    });
  }

  checkOut(reservationId: number): void {
    this.modal.confirm({
      nzTitle: 'Confirm Check-Out',
      nzContent: 'Are you sure you want to check out this guest? An invoice will be generated.',
      nzOnOk: () => {
        this.adminService.checkOut(reservationId).subscribe({
          next: () => {
            this.message.success('Guest checked out successfully');
            this.loadAllData();
          },
          error: () => this.message.error('Failed to check out guest')
        });
      }
    });
  }

  markNoShow(reservationId: number): void {
    this.modal.confirm({
      nzTitle: 'Mark as No-Show',
      nzContent: 'Are you sure you want to mark this reservation as no-show?',
      nzOkDanger: true,
      nzOnOk: () => {
        this.adminService.markAsNoShow(reservationId).subscribe({
          next: () => {
            this.message.success('Reservation marked as no-show');
            this.loadAllData();
          },
          error: () => this.message.error('Failed to mark as no-show')
        });
      }
    });
  }

  cancelReservation(reservationId: number): void {
    this.modal.confirm({
      nzTitle: 'Cancel Reservation',
      nzContent: 'Are you sure you want to cancel this reservation?',
      nzOkDanger: true,
      nzOnOk: () => {
        this.adminService.cancelReservation(reservationId, 'Cancelled by admin').subscribe({
          next: () => {
            this.message.success('Reservation cancelled');
            this.loadAllData();
          },
          error: () => this.message.error('Failed to cancel reservation')
        });
      }
    });
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'orange',
      'APPROVED': 'blue',
      'CHECKED_IN': 'green',
      'CHECKED_OUT': 'default',
      'CANCELLED': 'red',
      'NO_SHOW': 'red'
    };
    return colors[status] || 'default';
  }
}
