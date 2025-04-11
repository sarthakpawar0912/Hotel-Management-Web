import { ChangeDetectorRef, Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth/auth.service';
import { UserStorageService } from '../../services/storage/user-storage.service';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  loginForm!: FormGroup;
  isAdminLoggedIn: boolean = false;
  isCustomerLoggedIn: boolean = false;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router,
    private userStorage: UserStorageService,
    private cdr: ChangeDetectorRef
  ) {}



  ngOnInit() {
    this.loginForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, Validators.required]
    });

    // 🔴 Subscribe to user state to update UI automatically
    this.userStorage.user$.subscribe(user => {
      this.isAdminLoggedIn = user?.role === 'ADMIN';
      this.isCustomerLoggedIn = user?.role === 'CUSTOMER';
      this.cdr.detectChanges(); // 🔴 Force UI update
    });
  }


  submitForm() {
    if (this.loginForm.invalid) {
      this.message.error('Please fill in all required fields.');
      return;
    }
  

    this.authService.login(this.loginForm.value).subscribe(
      res => {
        if (res.userId && res.jwt) {
          const user = { id: res.userId, role: res.userRole };
  
          this.userStorage.saveUser(user);
          this.userStorage.saveToken(res.jwt);
  
          this.cdr.detectChanges(); // Force UI refresh
  
        // ✅ Use navigateByUrl() to ensure redirection works correctly
        if (user.role === 'ADMIN') {
          this.router.navigateByUrl('/admin/dashboard');
        } else {
          this.router.navigateByUrl('/customer/rooms');
        }
        } else {
          this.message.error('Login failed. Invalid response from server.');
        }
      },
      error => {
        this.message.error('Invalid credentials. Please try again.');
      }
    );
  }
}
