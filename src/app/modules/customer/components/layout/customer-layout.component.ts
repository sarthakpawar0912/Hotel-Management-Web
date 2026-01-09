import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { UserStorageService } from '../../../../auth/services/storage/user-storage.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-layout',
  standalone: false,
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.scss']
})
export class CustomerLayoutComponent implements OnInit, OnDestroy {
  notificationCount = 0;
  currentYear = new Date().getFullYear();
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router,
    private userStorage: UserStorageService,
    private customerService: CustomerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.fetchNotificationCount();

    // Poll for notification count every 30 seconds
    interval(30000)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.fetchNotificationCount();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  fetchNotificationCount(): void {
    this.customerService.getUnreadCount().subscribe({
      next: (count) => {
        this.notificationCount = count || 0;
        this.cdr.detectChanges();
      },
      error: () => {
        this.notificationCount = 0;
      }
    });
  }

  logout(): void {
    this.userStorage.signOut();
    this.router.navigateByUrl('/').then(() => {
      window.location.reload();
    });
  }
}
