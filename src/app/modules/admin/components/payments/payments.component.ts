import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-payments',
  standalone: false,
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.scss']
})
export class PaymentsComponent implements OnInit {
  payments: any[] = [];
  filteredPayments: any[] = [];
  loading = false;
  filterStatus = 'all';
  searchText = '';
  dateRange: Date[] = [];

  constructor(
    private adminService: AdminService,
    private message: NzMessageService
  ) {
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.dateRange = [firstDay, today];
  }

  ngOnInit(): void {
    this.loadPayments();
  }

  loadPayments(): void {
    this.loading = true;
    this.adminService.getAllPayments().subscribe({
      next: (res) => {
        this.payments = res;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load payments');
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    let filtered = [...this.payments];

    if (this.filterStatus !== 'all') {
      filtered = filtered.filter(p => p.paymentStatus === this.filterStatus);
    }

    if (this.dateRange && this.dateRange.length === 2) {
      const startDate = this.dateRange[0];
      const endDate = this.dateRange[1];
      filtered = filtered.filter(p => {
        const paidAt = new Date(p.paidAt);
        return paidAt >= startDate && paidAt <= endDate;
      });
    }

    this.filteredPayments = filtered;
  }

  onDateRangeChange(): void {
    this.applyFilter();
  }

  clearFilters(): void {
    this.filterStatus = 'all';
    this.searchText = '';
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.dateRange = [firstDay, today];
    this.applyFilter();
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'orange',
      'COMPLETED': 'green',
      'FAILED': 'red'
    };
    return colors[status] || 'default';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'PENDING': 'clock-circle',
      'COMPLETED': 'check-circle',
      'FAILED': 'close-circle'
    };
    return icons[status] || 'question-circle';
  }

  getMethodColor(method: string): string {
    const colors: { [key: string]: string } = {
      'RAZORPAY': 'blue',
      'CARD': 'purple',
      'UPI': 'green',
      'CASH': 'orange',
      'NETBANKING': 'cyan'
    };
    return colors[method?.toUpperCase()] || 'default';
  }

  getMethodIcon(method: string): string {
    const icons: { [key: string]: string } = {
      'RAZORPAY': 'credit-card',
      'CARD': 'credit-card',
      'UPI': 'qrcode',
      'CASH': 'dollar',
      'NETBANKING': 'bank'
    };
    return icons[method?.toUpperCase()] || 'wallet';
  }

  getTotalStats(): any {
    return {
      total: this.payments.length,
      completed: this.payments.filter(p => p.paymentStatus === 'COMPLETED').length,
      pending: this.payments.filter(p => p.paymentStatus === 'PENDING').length,
      failed: this.payments.filter(p => p.paymentStatus === 'FAILED').length,
      totalAmount: this.payments.filter(p => p.paymentStatus === 'COMPLETED').reduce((sum, p) => sum + (p.totalAmount || 0), 0)
    };
  }
}
