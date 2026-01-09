import { Component, OnInit } from '@angular/core';
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
export class RoomsComponent implements OnInit {

  // Expose Math to template
  Math = Math;

  currentpage = 1;
  rooms: any[] = [];
  total = 0;
  loading = false;
  isVisibleMiddle = false;
  checkInDate: Date | null = null;
  checkOutDate: Date | null = null;
  id!: number;
  selectedRoom: any = null;

  // Search and Filter
  searchName = '';
  searchType = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  filterCapacity: number | null = null;
  isSearchMode = false;

  // Filter options
  roomTypes: string[] = [];
  priceRange = { min: 0, max: 10000 };

  // GST Rate
  gstRate = 18;

  // Default image
  defaultImage = 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=300';

  // Price formatters
  priceFormatter = (value: number): string => `₹ ${value}`;
  priceParser = (value: string): string => value.replace('₹ ', '');

  constructor(
    private customerService: CustomerService,
    private message: NzMessageService,
    private modalService: NzModalService,
    private userStorageService: UserStorageService
  ) { }

  ngOnInit() {
    this.getRooms();
    this.loadFilterOptions();
  }

  loadFilterOptions() {
    this.customerService.getFilterOptions().subscribe(
      res => {
        if (res.roomTypes) {
          this.roomTypes = res.roomTypes;
        }
        if (res.minPrice !== null && res.maxPrice !== null) {
          this.priceRange = { min: res.minPrice, max: res.maxPrice };
        }
      },
      error => {
        console.error('Failed to load filter options:', error);
      }
    );
  }

  getRooms() {
    this.loading = true;

    if (this.isSearchMode) {
      this.searchRooms();
      return;
    }

    this.customerService.getRooms(this.currentpage - 1).subscribe(
      (res) => {
        if (res && res.roomDtoList) {
          this.rooms = res.roomDtoList;
          this.total = res.totalElements || res.totalPages * 10;
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

  searchRooms() {
    this.loading = true;
    this.isSearchMode = true;

    this.customerService.searchRooms(
      this.searchName || undefined,
      this.searchType || undefined,
      this.minPrice ?? undefined,
      this.maxPrice ?? undefined,
      this.filterCapacity ?? undefined,
      this.currentpage - 1
    ).subscribe(
      res => {
        if (res && res.roomDtoList) {
          this.rooms = res.roomDtoList;
          this.total = res.totalElements || res.totalPages * 10;
        } else {
          this.rooms = [];
          this.total = 0;
        }
        this.loading = false;
      },
      error => {
        this.message.error(`Search failed: ${error.error}`);
        this.loading = false;
      }
    );
  }

  onSearch() {
    this.currentpage = 1;
    this.isSearchMode = true;
    this.searchRooms();
  }

  clearFilters() {
    this.searchName = '';
    this.searchType = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.filterCapacity = null;
    this.isSearchMode = false;
    this.currentpage = 1;
    this.getRooms();
  }

  pageIndexChange(value: number) {
    this.currentpage = value;
    this.getRooms();
  }

  onCheckInChange(date: Date | null) {
    this.checkInDate = date;
    if (this.checkOutDate && date && this.checkOutDate < date) {
      this.checkOutDate = null;
    }
  }

  onCheckOutChange(date: Date | null) {
    this.checkOutDate = date;
  }

  disableCheckOutDate = (date: Date): boolean => {
    return this.checkInDate ? date <= this.checkInDate : false;
  };

  disableCheckInDate = (date: Date): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  handleCancelMiddle(): void {
    this.isVisibleMiddle = false;
    this.selectedRoom = null;
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

    this.customerService.bookRoom(obj).subscribe(
      (res) => {
        this.message.success('Booking request submitted for approval!', { nzDuration: 5000 });
        this.isVisibleMiddle = false;
        this.selectedRoom = null;
      },
      (error) => {
        this.message.error(`${error.error}`, { nzDuration: 5000 });
      }
    );
  }

  formatDate(date: Date | null): string {
    return date ? date.toISOString().split('T')[0] : '';
  }

  showModalMiddle(room: any) {
    this.id = room.id;
    this.selectedRoom = room;
    this.checkInDate = null;
    this.checkOutDate = null;
    this.isVisibleMiddle = true;
  }

  getRoomImage(room: any): string {
    if (room.image) {
      return 'data:image/jpeg;base64,' + room.image;
    }
    return this.defaultImage;
  }

  // Calculate number of nights
  getNights(): number {
    if (!this.checkInDate || !this.checkOutDate) {
      return 0;
    }
    const diffTime = Math.abs(this.checkOutDate.getTime() - this.checkInDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Calculate estimated price (room rate only)
  getEstimatedPrice(): number {
    if (!this.checkInDate || !this.checkOutDate || !this.selectedRoom) {
      return 0;
    }
    return this.getNights() * this.selectedRoom.price;
  }

  // Calculate estimated tax
  getEstimatedTax(): number {
    return Math.round(this.getEstimatedPrice() * this.gstRate / 100);
  }

  // Calculate estimated total
  getEstimatedTotal(): number {
    return this.getEstimatedPrice() + this.getEstimatedTax();
  }

}