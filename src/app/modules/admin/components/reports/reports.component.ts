import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-reports',
  standalone: false,
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
  dashboardSummary: any = {};
  revenueReport: any = {};
  occupancyReport: any = {};
  bookingReport: any = {};
  guestReport: any = {};
  roomPerformance: any[] = [];

  loading = false;
  dateRange: Date[] = [];
  selectedYear = new Date().getFullYear();
  selectedMonth = new Date().getMonth() + 1;

  constructor(
    private adminService: AdminService,
    private message: NzMessageService
  ) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.dateRange = [firstDay, today];
  }

  ngOnInit(): void {
    this.loadDashboardSummary();
    this.loadReports();
  }

  loadDashboardSummary(): void {
    this.adminService.getDashboardSummary().subscribe({
      next: (res) => this.dashboardSummary = res,
      error: () => this.message.error('Failed to load dashboard summary')
    });
  }

  loadReports(): void {
    if (this.dateRange.length !== 2) return;

    this.loading = true;
    const startDate = this.formatDate(this.dateRange[0]);
    const endDate = this.formatDate(this.dateRange[1]);

    this.adminService.getRevenueReport(startDate, endDate).subscribe({
      next: (res) => this.revenueReport = res,
      error: () => {}
    });

    this.adminService.getOccupancyReport(startDate, endDate).subscribe({
      next: (res) => this.occupancyReport = res,
      error: () => {}
    });

    this.adminService.getBookingReport(startDate, endDate).subscribe({
      next: (res) => this.bookingReport = res,
      error: () => {}
    });

    this.adminService.getGuestReport(startDate, endDate).subscribe({
      next: (res) => this.guestReport = res,
      error: () => {}
    });

    this.adminService.getRoomPerformanceReport(startDate, endDate).subscribe({
      next: (res) => {
        this.roomPerformance = res.rooms || [];
        this.loading = false;
      },
      error: () => this.loading = false
    });
  }

  onDateChange(): void {
    this.loadReports();
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(value || 0);
  }
}
