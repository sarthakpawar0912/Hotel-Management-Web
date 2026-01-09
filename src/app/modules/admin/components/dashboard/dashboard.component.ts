import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

  currentpage = 1;
  rooms: any[] = [];
  total = 0;
  loading = false;

  // Dashboard Summary Stats
  dashboardStats = {
    totalRooms: 0,
    availableRooms: 0,
    occupiedRooms: 0,
    todayCheckIns: 0,
    todayCheckOuts: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    occupancyRate: 0,
    pendingBookings: 0
  };
  statsLoading = true;

  // Search and Filter
  searchName = '';
  searchType = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;
  filterAvailable: boolean | null = null;
  isSearchMode = false;

  // Filter options
  roomTypes: string[] = [];
  priceRange = { min: 0, max: 10000 };

  // Default image for rooms without image
  defaultImage = 'https://images.unsplash.com/photo-1629140727571-9b5c6f6267b4?w=300';

  constructor(
    private adminService: AdminService,
    private message: NzMessageService,
    private modalService: NzModalService
  ) { }

  ngOnInit() {
    this.loadDashboardStats();
    this.getRooms();
    this.loadFilterOptions();
  }

  loadDashboardStats() {
    this.statsLoading = true;
    this.adminService.getDashboardSummary().subscribe({
      next: (res) => {
        this.dashboardStats = {
          totalRooms: res.totalRooms || 0,
          availableRooms: res.availableRooms || 0,
          occupiedRooms: res.occupiedRooms || 0,
          todayCheckIns: res.todayCheckIns || 0,
          todayCheckOuts: res.todayCheckOuts || 0,
          totalRevenue: res.totalRevenue || 0,
          monthlyRevenue: res.monthlyRevenue || 0,
          occupancyRate: res.occupancyRate || 0,
          pendingBookings: res.pendingBookings || 0
        };
        this.statsLoading = false;
      },
      error: () => {
        this.statsLoading = false;
      }
    });
  }

  loadFilterOptions() {
    this.adminService.getFilterOptions().subscribe(
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

    this.adminService.getRooms(this.currentpage - 1).subscribe(
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
        this.message.error(`Failed to load rooms: ${error.error}`);
        this.loading = false;
      }
    );
  }

  searchRooms() {
    this.loading = true;
    this.isSearchMode = true;

    this.adminService.searchRooms(
      this.searchName || undefined,
      this.searchType || undefined,
      this.minPrice ?? undefined,
      this.maxPrice ?? undefined,
      undefined,
      this.filterAvailable ?? undefined,
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
    this.filterAvailable = null;
    this.isSearchMode = false;
    this.currentpage = 1;
    this.getRooms();
  }

  pageIndexChange(value: any) {
    this.currentpage = value;
    this.getRooms();
  }

  deleteRoom(roomId: number) {
    this.adminService.deleteRoom(roomId).subscribe(
      res => {
        this.message.success('Room Deleted Successfully', { nzDuration: 5000 });
        this.getRooms();
      },
      error => {
        this.message.error(`${error.error}`, { nzDuration: 5000 });
      }
    );
  }

  showConfirm(roomId: number) {
    this.modalService.confirm({
      nzTitle: 'Confirm',
      nzContent: 'Do you want to delete this room?',
      nzOkText: 'Delete',
      nzCancelText: 'Cancel',
      nzOnOk: () => this.deleteRoom(roomId)
    });
  }

  getRoomImage(room: any): string {
    if (room.image) {
      return 'data:image/jpeg;base64,' + room.image;
    }
    return this.defaultImage;
  }

}
