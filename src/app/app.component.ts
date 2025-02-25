import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { UserStorageService } from './auth/services/storage/user-storage.service';

@Component({
  selector: 'app-root',
  standalone: false,
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  isCustomerLoggedIn: boolean = false;
  isAdminLoggedIn: boolean = false;

  constructor(
    private router: Router,
    private userStorage: UserStorageService,
    private cdr: ChangeDetectorRef // 🔹 Used for forcing UI refresh
  ) {}

  ngOnInit() {
    this.updateLoginStatus();

    // 🔹 Subscribe to login state changes to update UI dynamically
    this.userStorage.user$.subscribe(user => {
      this.isAdminLoggedIn = user?.role === 'ADMIN';
      this.isCustomerLoggedIn = user?.role === 'CUSTOMER';
      this.cdr.detectChanges(); // 🔹 Force UI refresh
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.updateLoginStatus();
      }
    });
  }

  updateLoginStatus() {
    this.isCustomerLoggedIn = this.userStorage.isCustomerLoggedIn();
    this.isAdminLoggedIn = this.userStorage.isAdminLoggedIn();
    this.cdr.detectChanges(); // 🔹 Ensure UI reflects changes
  }

  logout() {
    this.userStorage.signOut();
    this.router.navigateByUrl('/').then(() => {
      window.location.reload(); // 🔹 Ensures complete logout and UI reset
    });
  }
}
