import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-post-room',
  standalone: false,
  templateUrl:'./post-room.component.html',
  styleUrl: './post-room.component.scss'
})
export class PostRoomComponent {

  roomDetailsForm:FormGroup; 
  
  constructor(private fb:FormBuilder,
    private message:NzMessageService,
    private router:Router,
    private adminService:AdminService
  ){this.roomDetailsForm=this.fb.group({
    name:['',Validators.required],
    type:['',Validators.required],
    price:['',Validators.required], 
  })}


  submitForm() {
    this.adminService.postRoomDetails(this.roomDetailsForm.value).subscribe(res => {
      this.message.success(`Room posted Successfully`, { nzDuration: 5000 });
      this.router.navigateByUrl('/admin/dashboard'); // Fixed typo here
    }, error => {
      this.message.error(`${error.error}`, { nzDuration: 5000 });
    });
  }
  
}
