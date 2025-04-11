import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-update-room',
  standalone: false,
  templateUrl: './update-room.component.html',
  styleUrl: './update-room.component.scss'
})
export class UpdateRoomComponent {

  updateRoomForm: FormGroup;
  id: any; // ✅ Declare it first

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private adminService: AdminService,
    private activatedroute: ActivatedRoute // ✅ Initialize it first
  ) { 
    this.id = this.activatedroute.snapshot.params['id']; // ✅ Now it's initialized correctly
    this.updateRoomForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      price: ['', Validators.required]
    });
    this.getRoomsById();
  }


  submitForm() {
    if (this.updateRoomForm.valid) {
      console.log("Submitting data:", this.updateRoomForm.value);
      this.adminService.updateRoomDetails(this.id, this.updateRoomForm.value).subscribe(res => {
        this.message.success(`Room Updated Successfully`, { nzDuration: 5000 });
        this.router.navigateByUrl("/admin/dashboard");
      }, error => {
        this.message.error(`${error.error}`, { nzDuration: 5000 });
      });
    } else {
      this.message.error("Please fill in all required fields.");
    }
  }

  getRoomsById(){
    this.adminService.getRoomsById(this.id).subscribe(res=>{
      this.updateRoomForm.patchValue(res);
    },error=>{
      this.message.error(`${error.error}`,{nzDuration:5000})
    })
  }

}

