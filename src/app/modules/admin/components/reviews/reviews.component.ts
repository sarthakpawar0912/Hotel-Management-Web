import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-reviews',
  standalone: false,
  templateUrl: './reviews.component.html',
  styleUrls: ['./reviews.component.scss']
})
export class ReviewsComponent implements OnInit {
  reviews: any[] = [];
  filteredReviews: any[] = [];
  statistics: any = {};
  loading = false;
  filterStatus = 'all';

  responseModalVisible = false;
  selectedReview: any = null;
  adminResponse = '';

  constructor(
    private adminService: AdminService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadReviews();
    this.loadStatistics();
  }

  loadReviews(): void {
    this.loading = true;
    this.adminService.getAllReviews().subscribe({
      next: (res) => {
        this.reviews = res;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load reviews');
        this.loading = false;
      }
    });
  }

  loadStatistics(): void {
    this.adminService.getReviewStatistics().subscribe({
      next: (res) => this.statistics = res,
      error: () => {}
    });
  }

  applyFilter(): void {
    if (this.filterStatus === 'pending') {
      this.filteredReviews = this.reviews.filter(r => !r.isApproved);
    } else if (this.filterStatus === 'approved') {
      this.filteredReviews = this.reviews.filter(r => r.isApproved);
    } else {
      this.filteredReviews = [...this.reviews];
    }
  }

  approveReview(reviewId: number): void {
    this.adminService.approveReview(reviewId).subscribe({
      next: () => {
        this.message.success('Review approved');
        this.loadReviews();
        this.loadStatistics();
      },
      error: () => this.message.error('Failed to approve review')
    });
  }

  rejectReview(reviewId: number): void {
    this.modal.confirm({
      nzTitle: 'Reject Review',
      nzContent: 'Are you sure you want to reject and delete this review?',
      nzOkDanger: true,
      nzOnOk: () => {
        this.adminService.rejectReview(reviewId).subscribe({
          next: () => {
            this.message.success('Review rejected');
            this.loadReviews();
            this.loadStatistics();
          },
          error: () => this.message.error('Failed to reject review')
        });
      }
    });
  }

  showResponseModal(review: any): void {
    this.selectedReview = review;
    this.adminResponse = review.adminResponse || '';
    this.responseModalVisible = true;
  }

  submitResponse(): void {
    if (!this.adminResponse.trim()) {
      this.message.warning('Please enter a response');
      return;
    }

    this.adminService.respondToReview(this.selectedReview.id, this.adminResponse).subscribe({
      next: () => {
        this.message.success('Response submitted');
        this.responseModalVisible = false;
        this.loadReviews();
      },
      error: () => this.message.error('Failed to submit response')
    });
  }

  getRatingStars(rating: number): number[] {
    return Array(rating).fill(0);
  }
}
