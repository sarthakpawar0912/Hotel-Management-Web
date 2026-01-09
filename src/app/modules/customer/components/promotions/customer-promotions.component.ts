import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-promotions',
  standalone: false,
  templateUrl: './customer-promotions.component.html',
  styleUrls: ['./customer-promotions.component.scss']
})
export class CustomerPromotionsComponent implements OnInit {
  promotions: any[] = [];
  loading = false;

  constructor(
    private customerService: CustomerService,
    private message: NzMessageService
  ) {}

  ngOnInit(): void {
    this.loadPromotions();
  }

  loadPromotions(): void {
    this.loading = true;
    this.customerService.getActivePromotions().subscribe({
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

  copyCode(code: string): void {
    navigator.clipboard.writeText(code).then(() => {
      this.message.success('Promo code copied to clipboard!');
    });
  }

  isExpiringSoon(endDate: string): boolean {
    const end = new Date(endDate);
    const now = new Date();
    const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysLeft <= 7 && daysLeft > 0;
  }

  getDaysLeft(endDate: string): number {
    const end = new Date(endDate);
    const now = new Date();
    return Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  }

  getDiscountText(promo: any): string {
    if (promo.discountType === 'PERCENTAGE') {
      return `${promo.discountValue}% OFF`;
    }
    return `₹${promo.discountValue} OFF`;
  }

  getPromoTypeColor(promo: any): string {
    if (promo.discountType === 'PERCENTAGE') {
      return 'purple';
    }
    return 'geekblue';
  }

  getPromoTypeLabel(promo: any): string {
    if (promo.discountType === 'PERCENTAGE') {
      return 'Percentage Discount';
    }
    return 'Flat Discount';
  }
}
