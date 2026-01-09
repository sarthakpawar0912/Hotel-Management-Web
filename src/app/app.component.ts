import { ChangeDetectorRef, Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { Subject, interval } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { UserStorageService } from './auth/services/storage/user-storage.service';
import { CustomerService } from './modules/customer/services/customer.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  isCustomerLoggedIn = false;
  isAdminLoggedIn = false;
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
    // Check token validity on app load
    this.userStorage.checkTokenValidity();
    this.updateLoginStatus();

    // Subscribe to user changes
    this.userStorage.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.updateLoginStatus();
      });

    // Update login status on navigation
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.updateLoginStatus();
      });

    // Poll for notification count every 30 seconds for customers
    interval(30000)
      .pipe(
        takeUntil(this.destroy$),
        filter(() => this.isCustomerLoggedIn)
      )
      .subscribe(() => {
        this.fetchNotificationCount();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  updateLoginStatus(): void {
    const role = this.userStorage.getUserRole();
    const hasValidToken = this.userStorage.getToken() !== null && !this.userStorage.isTokenExpired();

    // Reset both first to ensure mutual exclusivity
    this.isCustomerLoggedIn = false;
    this.isAdminLoggedIn = false;

    if (hasValidToken) {
      // Check role (case-insensitive)
      const normalizedRole = role?.toUpperCase();
      if (normalizedRole === 'ADMIN' || normalizedRole === 'ROLE_ADMIN') {
        this.isAdminLoggedIn = true;
      } else if (normalizedRole === 'CUSTOMER' || normalizedRole === 'ROLE_CUSTOMER' || normalizedRole === 'USER') {
        this.isCustomerLoggedIn = true;
        this.fetchNotificationCount();
      }
    }

    this.cdr.detectChanges();
  }

  fetchNotificationCount(): void {
    if (!this.isCustomerLoggedIn) return;

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
    this.isAdminLoggedIn = false;
    this.isCustomerLoggedIn = false;
    this.notificationCount = 0;
    this.router.navigateByUrl('/').then(() => {
      window.location.reload();
    });
  }

}
