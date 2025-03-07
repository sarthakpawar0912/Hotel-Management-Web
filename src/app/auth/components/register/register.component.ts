import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth/auth.service';
import { NzMessageService } from 'ng-zorro-antd/message';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: false,
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
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
