import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerService } from '../../services/customer.service';

@Component({
  selector: 'app-customer-reviews',
  standalone: false,
  templateUrl: './customer-reviews.component.html',
  styleUrls: ['./customer-reviews.component.scss']
})
export class CustomerReviewsComponent implements OnInit {
  myReviews: any[] = [];
  loading = false;

  isModalVisible = false;
  isEditMode = false;
  selectedReview: any = null;
  reviewForm!: FormGroup;

  constructor(
    private customerService: CustomerService,
    private message: NzMessageService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.loadMyReviews();
    this.initForm();
  }

  initForm(): void {
    this.reviewForm = this.fb.group({
      overallRating: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
      cleanlinessRating: [5],
      serviceRating: [5],
      amenitiesRating: [5],
      valueForMoneyRating: [5],
      locationRating: [5],
      title: [''],
      comment: ['', [Validators.required, Validators.minLength(10)]],
      pros: [''],
      cons: [''],
      isAnonymous: [false]
    });
  }

  loadMyReviews(): void {
    this.loading = true;
    this.customerService.getMyReviews().subscribe({
      next: (res) => {
        this.myReviews = res;
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load reviews');
        this.loading = false;
      }
    });
  }

  showEditModal(review: any): void {
    this.isEditMode = true;
    this.selectedReview = review;
    this.reviewForm.patchValue(review);
    this.isModalVisible = true;
  }

  handleCancel(): void {
    this.isModalVisible = false;
  }

  handleSubmit(): void {
    if (this.reviewForm.invalid) {
      Object.values(this.reviewForm.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity();
      });
      return;
    }

    const reviewData = this.reviewForm.value;

    if (this.isEditMode && this.selectedReview) {
      this.customerService.updateReview(this.selectedReview.id, reviewData).subscribe({
        next: () => {
          this.message.success('Review updated successfully');
          this.isModalVisible = false;
          this.loadMyReviews();
        },
        error: () => this.message.error('Failed to update review')
      });
    }
  }

  deleteReview(reviewId: number): void {
    this.customerService.deleteReview(reviewId).subscribe({
      next: () => {
        this.message.success('Review deleted');
        this.loadMyReviews();
      },
      error: () => this.message.error('Failed to delete review')
    });
  }

  getStatusText(review: any): string {
    if (review.isApproved) return 'Published';
    return 'Pending Approval';
  }

  getStatusColor(review: any): string {
    return review.isApproved ? 'success' : 'warning';
  }

  hasDetailedRatings(review: any): boolean {
    return review.cleanlinessRating || review.serviceRating ||
           review.amenitiesRating || review.valueForMoneyRating;
  }
}
