import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  registerForm!: FormGroup;


  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private message: NzMessageService,
    private router: Router
  ) {}


  ngOnInit() {
    this.registerForm = this.fb.group({
      email: [null, [Validators.email, Validators.required]],
      password: [null, Validators.required],
      name: [null, Validators.required]
    });
  }

  submitForm() {
    this.authService.register(this.registerForm.value).subscribe(
      res => {
        if (res.id) {
          this.message.success('SignUp Successful', { nzDuration: 5000 });
          this.router.navigateByUrl('/');
        } else {
          this.message.error(res.message || 'Registration failed.', { nzDuration: 5000 });
        }
      },
      error => {
        this.message.error(error.error?.message || 'Registration failed.', { nzDuration: 5000 });
      }
    );
  }

}
