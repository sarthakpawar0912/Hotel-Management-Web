import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { UserStorageService } from '../../../../auth/services/storage/user-storage.service';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-rooms',
  standalone: false,
  templateUrl: './rooms.component.html',
  styleUrl: './rooms.component.scss'
})
export class RoomsComponent {
  currentpage = 1;
  rooms: any[] = [];
  total = 0;
  loading = false;
  isVisibleMiddle: boolean = false;

  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  id!: number;

  constructor(
    private customerService: CustomerService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private userStorageService: UserStorageService
  ) {
    this.getRooms();
  }

  getRooms() {
    this.loading = true;
    this.customerService.getRooms(this.currentpage - 1).subscribe(
      (res) => {
        console.log('Rooms API Response:', res);
        if (res && res.roomDtoList) {
          this.rooms = res.roomDtoList;
          this.total = res.totalPages * 10;
        } else {
          this.rooms = [];
          this.total = 0;
        }
        this.loading = false;
      },
      (error) => {
        this.message.error(`Failed to load rooms: ${error.error}`);
        this.loading = false;
      }
    );
  }

  pageIndexChange(value: number) {
    this.currentpage = value;
    this.getRooms();
  }

  // Handle Check-in Date Selection
  onCheckInChange(date: Date | null) {
    console.log('Check-in Date Selected:', date);
    this.checkInDate = date;

    // Reset check-out date if it's before the new check-in date
    if (this.checkOutDate && date && this.checkOutDate < date) {
      this.checkOutDate = null;
    }
  }

  // Handle Check-out Date Selection
  onCheckOutChange(date: Date | null) {
    console.log('Check-out Date Selected:', date);
    this.checkOutDate = date;
  }

  // Disable Check-out Dates before Check-in Date
  disableCheckOutDate = (date: Date): boolean => {
    return this.checkInDate ? date <= this.checkInDate : false;
  };

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
  }

  handleOkMiddle(): void {
    if (!this.checkInDate || !this.checkOutDate) {
      this.message.error('Please select both check-in and check-out dates.');
      return;
    }

    const userId = this.userStorageService.getUserId();
    if (!userId) {
      this.message.error('User not found. Please log in.');
      return;
    }

    const obj = {
      userId: userId,
      roomId: this.id,
      checkInDate: this.formatDate(this.checkInDate),
      checkOutDate: this.formatDate(this.checkOutDate)
    };

    console.log('Booking Request Payload:', obj);

    this.customerService.bookRoom(obj).subscribe(
      (res) => {
        this.message.success(`Request submitted for approval..!`, { nzDuration: 5000 });
        this.isVisibleMiddle = false;
      },
      (error) => {
        this.message.error(`${error.error}`, { nzDuration: 5000 });
      }
    );
  }

  formatDate(date: Date | null): string {
    return date ? date.toISOString().split('T')[0] : '';
  }

  showModalMiddle(id: number) {
    console.log('Booking modal opened for room ID:', id);
    this.id = id;
    this.checkInDate = null;
    this.checkOutDate = null;
    this.isVisibleMiddle = true;
  }
}