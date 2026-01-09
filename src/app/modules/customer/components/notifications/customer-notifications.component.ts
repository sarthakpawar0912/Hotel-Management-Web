import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-notifications',
  standalone: false,
  templateUrl: './customer-notifications.component.html',
  styleUrls: ['./customer-notifications.component.scss']
})
export class CustomerNotificationsComponent implements OnInit {
  notifications: any[] = [];
  loading = false;
  unreadCount = 0;

  constructor(
    private customerService: CustomerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
    this.loadUnreadCount();
  }

  loadNotifications(): void {
    this.loading = true;
    this.customerService.getMyNotifications().subscribe({
      next: (res) => {
        this.notifications = res;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load notifications');
        this.loading = false;
      }
    });
  }

  loadUnreadCount(): void {
    this.customerService.getUnreadCount().subscribe({
      next: (res) => this.unreadCount = res.count || res,
      error: () => {}
    });
  }

  markAsRead(notificationId: number): void {
    this.customerService.markNotificationAsRead(notificationId).subscribe({
      next: () => {
        this.loadNotifications();
        this.loadUnreadCount();
      },
      error: () => this.message.error('Failed to mark as read')
    });
  }

  markAllAsRead(): void {
    this.customerService.markAllNotificationsAsRead().subscribe({
      next: () => {
        this.message.success('All notifications marked as read');
        this.loadNotifications();
        this.loadUnreadCount();
      },
      error: () => this.message.error('Failed to mark all as read')
    });
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'BOOKING_CONFIRMATION': 'check-circle',
      'BOOKING_CANCELLATION': 'close-circle',
      'CHECK_IN_REMINDER': 'login',
      'CHECK_OUT_REMINDER': 'logout',
      'CHECK_IN_CONFIRMATION': 'login',
      'CHECK_OUT_CONFIRMATION': 'logout',
      'PAYMENT_SUCCESS': 'dollar-circle',
      'PAYMENT_FAILED': 'exclamation-circle',
      'REVIEW_REQUEST': 'star',
      'PROMOTIONAL': 'gift',
      'GENERAL': 'bell'
    };
    return icons[type] || 'bell';
  }

  getNotificationColor(type: string): string {
    const colors: { [key: string]: string } = {
      'BOOKING_CONFIRMATION': 'green',
      'BOOKING_CANCELLATION': 'red',
      'PAYMENT_SUCCESS': 'green',
      'PAYMENT_FAILED': 'red',
      'PROMOTIONAL': 'gold',
      'CHECK_IN_REMINDER': 'blue',
      'CHECK_OUT_REMINDER': 'orange',
      'REVIEW_REQUEST': 'purple'
    };
    return colors[type] || 'blue';
  }

  getTypeTagColor(type: string): string {
    const colors: { [key: string]: string } = {
      'BOOKING_CONFIRMATION': 'success',
      'BOOKING_CANCELLATION': 'error',
      'PAYMENT_SUCCESS': 'success',
      'PAYMENT_FAILED': 'error',
      'PROMOTIONAL': 'gold',
      'CHECK_IN_REMINDER': 'processing',
      'CHECK_OUT_REMINDER': 'warning',
      'REVIEW_REQUEST': 'purple'
    };
    return colors[type] || 'default';
  }

  formatNotificationType(type: string): string {
    if (!type) return 'General';
    return type.split('_').map(word =>
      word.charAt(0) + word.slice(1).toLowerCase()
    ).join(' ');
  }
}
