import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-guests',
  standalone: false,
  templateUrl: './guests.component.html',
  styleUrls: ['./guests.component.scss']
})
export class GuestsComponent implements OnInit {
  guests: any[] = [];
  filteredGuests: any[] = [];
  loading = false;
  searchText = '';
  filterType = 'all';
  filterLoyalty: string | null = null;

  isModalVisible = false;
  isEditMode = false;
  guestForm!: FormGroup;
  selectedGuest: any = null;

  isViewModalVisible = false;
  viewGuest: any = null;

  loyaltyTiers = ['BRONZE', 'SILVER', 'GOLD', 'PLATINUM'];
  idProofTypes = ['AADHAR', 'PAN', 'PASSPORT', 'DRIVING_LICENSE', 'VOTER_ID'];

  constructor(
    private adminService: AdminService,
    private message: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadGuests();
    this.initForm();
  }

  initForm(): void {
    this.guestForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: [''],
      email: ['', [Validators.email]],
      phone: ['', [Validators.required]],
      alternatePhone: [''],
      dateOfBirth: [null],
      gender: [''],
      nationality: [''],
      address: [''],
      city: [''],
      state: [''],
      country: [''],
      zipCode: [''],
      idProofType: [''],
      idProofNumber: [''],
      companyName: [''],
      gstin: [''],
      preferences: [''],
      specialRequests: ['']
    });
  }

  loadGuests(): void {
    this.loading = true;
    this.adminService.getAllGuests().subscribe({
      next: (res) => {
        this.guests = res;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.message.error('Failed to load guests');
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    let filtered = [...this.guests];

    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(g =>
        g.firstName?.toLowerCase().includes(search) ||
        g.lastName?.toLowerCase().includes(search) ||
        g.email?.toLowerCase().includes(search) ||
        g.phone?.includes(search)
      );
    }

    if (this.filterType === 'vip') {
      filtered = filtered.filter(g => g.isVip);
    } else if (this.filterType === 'blacklisted') {
      filtered = filtered.filter(g => g.isBlacklisted);
    }

    if (this.filterLoyalty) {
      filtered = filtered.filter(g => g.loyaltyTier === this.filterLoyalty);
    }

    this.filteredGuests = filtered;
  }

  clearFilters(): void {
    this.searchText = '';
    this.filterType = 'all';
    this.filterLoyalty = null;
    this.filteredGuests = [...this.guests];
  }

  getVipCount(): number {
    return this.guests.filter(g => g.isVip).length;
  }

  showAddModal(): void {
    this.isEditMode = false;
    this.selectedGuest = null;
    this.guestForm.reset();
    this.isModalVisible = true;
  }

  showEditModal(guest: any): void {
    this.isEditMode = true;
    this.selectedGuest = guest;
    this.guestForm.patchValue(guest);
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  handleSubmit(): void {
    if (this.guestForm.invalid) {
      Object.values(this.guestForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const guestData = this.guestForm.value;

    if (this.isEditMode && this.selectedGuest) {
      this.adminService.updateGuest(this.selectedGuest.id, guestData).subscribe({
        next: () => {
          this.message.success('Guest updated successfully');
          this.isModalVisible = false;
          this.loadGuests();
        },
        error: () => this.message.error('Failed to update guest')
      });
    } else {
      this.adminService.createGuest(guestData).subscribe({
        next: () => {
          this.message.success('Guest created successfully');
          this.isModalVisible = false;
          this.loadGuests();
        },
        error: () => this.message.error('Failed to create guest')
      });
    }
  }

  showViewModal(guest: any): void {
    this.viewGuest = guest;
    this.isViewModalVisible = true;
  }

  closeViewModal(): void {
    this.isViewModalVisible = false;
    this.viewGuest = null;
  }

  editFromView(): void {
    if (this.viewGuest) {
      this.closeViewModal();
      this.showEditModal(this.viewGuest);
    }
  }

  markAsVip(guestId: number): void {
    this.adminService.markGuestAsVip(guestId, true).subscribe({
      next: () => {
        this.message.success('Guest marked as VIP');
        this.loadGuests();
      },
      error: () => this.message.error('Failed to mark as VIP')
    });
  }

  removeVipStatus(guestId: number): void {
    this.adminService.markGuestAsVip(guestId, false).subscribe({
      next: () => {
        this.message.success('VIP status removed');
        this.loadGuests();
      },
      error: () => this.message.error('Failed to remove VIP status')
    });
  }

  blacklistGuest(guest: any): void {
    this.modal.confirm({
      nzTitle: 'Blacklist Guest',
      nzContent: 'Enter reason for blacklisting:',
      nzOnOk: () => {
        const reason = 'Violation of hotel policies';
        this.adminService.blacklistGuest(guest.id, reason).subscribe({
          next: () => {
            this.message.success('Guest blacklisted');
            this.loadGuests();
          },
          error: () => this.message.error('Failed to blacklist guest')
        });
      }
    });
  }

  removeFromBlacklist(guestId: number): void {
    this.adminService.removeGuestFromBlacklist(guestId).subscribe({
      next: () => {
        this.message.success('Guest removed from blacklist');
        this.loadGuests();
      },
      error: () => this.message.error('Failed to remove from blacklist')
    });
  }

  deleteGuest(guestId: number): void {
    this.modal.confirm({
      nzTitle: 'Delete Guest',
      nzContent: 'Are you sure you want to delete this guest?',
      nzOkDanger: true,
      nzOnOk: () => {
        this.adminService.deleteGuest(guestId).subscribe({
          next: () => {
            this.message.success('Guest deleted');
            this.loadGuests();
          },
          error: () => this.message.error('Failed to delete guest')
        });
      }
    });
  }

  getLoyaltyColor(tier: string): string {
    const colors: { [key: string]: string } = {
      'BRONZE': 'orange',
      'SILVER': 'default',
      'GOLD': 'gold',
      'PLATINUM': 'purple'
    };
    return colors[tier] || 'default';
  }
}
