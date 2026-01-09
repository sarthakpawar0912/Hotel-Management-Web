import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-promotions',
  standalone: false,
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss']
})
export class PromotionsComponent implements OnInit {
  promotions: any[] = [];
  loading = false;

  isModalVisible = false;
  isEditMode = false;
  selectedPromotion: any = null;
  promotionForm!: FormGroup;

  discountTypes = ['PERCENTAGE', 'FIXED_AMOUNT'];

  constructor(
    private adminService: AdminService,
    private message: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadPromotions();
    this.initForm();
  }

  initForm(): void {
    this.promotionForm = this.fb.group({
      name: ['', [Validators.required]],
      description: [''],
      code: ['', [Validators.required]],
      discountType: ['PERCENTAGE', [Validators.required]],
      discountValue: [0, [Validators.required, Validators.min(0)]],
      minBookingAmount: [0],
      maxDiscountAmount: [null],
      startDate: [null, [Validators.required]],
      endDate: [null, [Validators.required]],
      usageLimit: [null],
      termsAndConditions: ['']
    });
  }

  loadPromotions(): void {
    this.loading = true;
    this.adminService.getAllPromotions().subscribe({
      next: (res) => {
        this.promotions = res;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load promotions');
        this.loading = false;
      }
    });
  }

  showAddModal(): void {
    this.isEditMode = false;
    this.selectedPromotion = null;
    this.promotionForm.reset({ discountType: 'PERCENTAGE' });
    this.isModalVisible = true;
  }

  showEditModal(promotion: any): void {
    this.isEditMode = true;
    this.selectedPromotion = promotion;
    this.promotionForm.patchValue({
      ...promotion,
      startDate: new Date(promotion.startDate),
      endDate: new Date(promotion.endDate)
    });
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  handleSubmit(): void {
    if (this.promotionForm.invalid) {
      Object.values(this.promotionForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const formValue = this.promotionForm.value;
    const promotionData = {
      ...formValue,
      startDate: this.formatDate(formValue.startDate),
      endDate: this.formatDate(formValue.endDate)
    };

    if (this.isEditMode && this.selectedPromotion) {
      this.adminService.updatePromotion(this.selectedPromotion.id, promotionData).subscribe({
        next: () => {
          this.message.success('Promotion updated successfully');
          this.isModalVisible = false;
          this.loadPromotions();
        },
        error: () => this.message.error('Failed to update promotion')
      });
    } else {
      this.adminService.createPromotion(promotionData).subscribe({
        next: () => {
          this.message.success('Promotion created successfully');
          this.isModalVisible = false;
          this.loadPromotions();
        },
        error: () => this.message.error('Failed to create promotion')
      });
    }
  }

  activatePromotion(id: number): void {
    this.adminService.activatePromotion(id).subscribe({
      next: () => {
        this.message.success('Promotion activated');
        this.loadPromotions();
      },
      error: () => this.message.error('Failed to activate promotion')
    });
  }

  deactivatePromotion(id: number): void {
    this.adminService.deactivatePromotion(id).subscribe({
      next: () => {
        this.message.success('Promotion deactivated');
        this.loadPromotions();
      },
      error: () => this.message.error('Failed to deactivate promotion')
    });
  }

  deletePromotion(id: number): void {
    this.modal.confirm({
      nzTitle: 'Delete Promotion',
      nzContent: 'Are you sure you want to delete this promotion?',
      nzOkDanger: true,
      nzOnOk: () => {
        this.adminService.deletePromotion(id).subscribe({
          next: () => {
            this.message.success('Promotion deleted');
            this.loadPromotions();
          },
          error: () => this.message.error('Failed to delete promotion')
        });
      }
    });
  }

  formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  isExpired(endDate: string): boolean {
    return new Date(endDate) < new Date();
  }
}
