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
  id: number;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  existingImage: string | null = null;
  isSubmitting = false;
  loading = true;

  // Room type options
  roomTypes = ['Standard', 'Deluxe', 'Suite', 'Presidential', 'Single', 'Double', 'Twin', 'Family'];

  // Price formatters
  formatterRupee = (value: number): string => `₹ ${value}`;
  parserRupee = (value: string): number => Number(value.replace('₹ ', '')) || 0;

  constructor(
    private fb: FormBuilder,
    private message: NzMessageService,
    private router: Router,
    private adminService: AdminService,
    private activatedroute: ActivatedRoute
  ) {
    this.id = this.activatedroute.snapshot.params['id'];
    this.updateRoomForm = this.fb.group({
      name: ['', Validators.required],
      type: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      description: [''],
      capacity: [2, [Validators.min(1), Validators.max(10)]],
      floorNumber: [1, [Validators.min(0)]],
      roomNumber: ['']
    });
    this.getRoomsById();
  }

  // Handle file selection
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        this.message.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        this.message.error('Image size should be less than 5MB');
        return;
      }
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
  }

  submitForm() {
    if (this.updateRoomForm.invalid) {
      this.message.error('Please fill all required fields');
      return;
    }

    this.isSubmitting = true;

    const formData = new FormData();
    formData.append('name', this.updateRoomForm.get('name')?.value);
    formData.append('type', this.updateRoomForm.get('type')?.value);
    formData.append('price', this.updateRoomForm.get('price')?.value);

    if (this.updateRoomForm.get('description')?.value) {
      formData.append('description', this.updateRoomForm.get('description')?.value);
    }
    if (this.updateRoomForm.get('capacity')?.value) {
      formData.append('capacity', this.updateRoomForm.get('capacity')?.value);
    }
    if (this.updateRoomForm.get('floorNumber')?.value !== null) {
      formData.append('floorNumber', this.updateRoomForm.get('floorNumber')?.value);
    }
    if (this.updateRoomForm.get('roomNumber')?.value) {
      formData.append('roomNumber', this.updateRoomForm.get('roomNumber')?.value);
    }

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.adminService.updateRoomDetails(this.id, formData).subscribe(
      res => {
        this.isSubmitting = false;
        this.message.success('Room updated successfully', { nzDuration: 5000 });
        this.router.navigateByUrl('/admin/dashboard');
      },
      error => {
        this.isSubmitting = false;
        this.message.error(`${error.error || 'Failed to update room'}`, { nzDuration: 5000 });
      }
    );
  }

  getRoomsById() {
    this.adminService.getRoomsById(this.id).subscribe(
      res => {
        this.updateRoomForm.patchValue({
          name: res.name,
          type: res.type,
          price: res.price,
          description: res.description,
          capacity: res.capacity || 2,
          floorNumber: res.floorNumber || 1,
          roomNumber: res.roomNumber
        });

        // Set existing image if available
        if (res.image) {
          this.existingImage = 'data:image/jpeg;base64,' + res.image;
          this.imagePreview = this.existingImage;
        }
        this.loading = false;
      },
      error => {
        this.loading = false;
        this.message.error(`${error.error}`, { nzDuration: 5000 });
      }
    );
  }

}

