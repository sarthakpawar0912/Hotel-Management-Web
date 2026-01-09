import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NzMessageService } from 'ng-zorro-antd/message';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-post-room',
  standalone: false,
  templateUrl: './post-room.component.html',
  styleUrl: './post-room.component.scss'
})
export class PostRoomComponent {

  roomDetailsForm: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  isSubmitting = false;

  // Room type options
  roomTypes = ['Standard', 'Deluxe', 'Suite', 'Presidential', 'Single', 'Double', 'Twin', 'Family'];

  // Price formatters
  formatterRupee = (value: number): string => `₹ ${value}`;
  parserRupee = (value: string): number => Number(value.replace('₹ ', '')) || 0;

  constructor(private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private adminService: AdminService
  ) {
    this.roomDetailsForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      capacity: [2, [Validators.min(1), Validators.max(10)]],
      floorNumber: [1, [Validators.min(0)]],
      roomNumber: ['']
    });
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        this.message.error('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        this.message.error('Image size should be less than 5MB');
        return;
      }
      this.selectedFile = file;

      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  // Remove selected image
  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  submitForm() {
    if (this.roomDetailsForm.invalid) {
      this.message.error('Please fill all required fields');
      return;
    }

    this.isSubmitting = true;

    // Create FormData for multipart upload
    const formData = new FormData();
    formData.append('name', this.roomDetailsForm.get('name')?.value);
    formData.append('type', this.roomDetailsForm.get('type')?.value);
    formData.append('price', this.roomDetailsForm.get('price')?.value);

    // Optional fields
    if (this.roomDetailsForm.get('description')?.value) {
      formData.append('description', this.roomDetailsForm.get('description')?.value);
    }
    if (this.roomDetailsForm.get('capacity')?.value) {
      formData.append('capacity', this.roomDetailsForm.get('capacity')?.value);
    }
    if (this.roomDetailsForm.get('floorNumber')?.value !== null) {
      formData.append('floorNumber', this.roomDetailsForm.get('floorNumber')?.value);
    }
    if (this.roomDetailsForm.get('roomNumber')?.value) {
      formData.append('roomNumber', this.roomDetailsForm.get('roomNumber')?.value);
    }

    // Add image if selected
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.adminService.postRoomDetails(formData).subscribe(
      res => {
        this.isSubmitting = false;
        this.message.success('Room posted successfully', { nzDuration: 5000 });
        this.router.navigateByUrl('/admin/dashboard');
      },
      error => {
        this.isSubmitting = false;
        this.message.error(`${error.error || 'Failed to create room'}`, { nzDuration: 5000 });
      }
    );
  }

}
