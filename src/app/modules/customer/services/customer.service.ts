import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../../auth/services/storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private http: HttpClient,
    private userStorage: UserStorageService
  ) { }

  // ==================== ROOM MANAGEMENT ====================

  getRooms(pageNumber: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/customer/rooms/${pageNumber}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  searchRooms(
    name?: string,
    type?: string,
    minPrice?: number,
    maxPrice?: number,
    capacity?: number,
    pageNumber: number = 0
  ): Observable<any> {
    let params = new HttpParams().set('pageNumber', pageNumber.toString());

    if (name) params = params.set('name', name);
    if (type) params = params.set('type', type);
    if (minPrice !== undefined && minPrice !== null) params = params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined && maxPrice !== null) params = params.set('maxPrice', maxPrice.toString());
    if (capacity !== undefined && capacity !== null) params = params.set('capacity', capacity.toString());

    return this.http.get(BASIC_URL + 'api/customer/rooms/search', {
      headers: this.createAuthorizationHeader(),
      params: params
    });
  }

  getFilterOptions(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/customer/rooms/filter-options', {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== BOOKING MANAGEMENT ====================

  bookRoom(bookingDto: any): Observable<any> {
    return this.http.post(`${BASIC_URL}api/customer/book`, bookingDto, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getMyBookings(pageNumber: number): Observable<any> {
    const userId = this.userStorage.getUserId();
    return this.http.get(`${BASIC_URL}api/customer/bookings/${userId}/${pageNumber}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  cancelBooking(reservationId: number): Observable<any> {
    const userId = this.userStorage.getUserId();
    return this.http.put(`${BASIC_URL}api/customer/bookings/${reservationId}/cancel?userId=${userId}`, null, {
      headers: this.createAuthorizationHeader(),
      responseType: 'text'
    });
  }

  // ==================== REVIEWS ====================

  submitReview(reviewData: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/customer/reviews', reviewData, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getMyReviews(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/customer/reviews/my-reviews', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getReviewsByRoom(roomId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/customer/reviews/room/${roomId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateReview(reviewId: number, reviewData: any): Observable<any> {
    return this.http.put(`${BASIC_URL}api/customer/reviews/${reviewId}`, reviewData, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deleteReview(reviewId: number): Observable<any> {
    return this.http.delete(`${BASIC_URL}api/customer/reviews/${reviewId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  canReviewRoom(roomId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/customer/reviews/can-review/${roomId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== PROMOTIONS ====================

  getActivePromotions(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/customer/promotions/active', {
      headers: this.createAuthorizationHeader(),
    });
  }

  validatePromoCode(code: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/customer/promotions/validate/${code}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  applyPromoCode(reservationId: number, promoCode: string): Observable<any> {
    return this.http.post(`${BASIC_URL}api/customer/promotions/apply?reservationId=${reservationId}&promoCode=${promoCode}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== PAYMENTS ====================

  createPaymentOrder(reservationId: number): Observable<any> {
    return this.http.post(`${BASIC_URL}api/customer/payments/create-order/${reservationId}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  verifyPayment(paymentData: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/customer/payments/verify', paymentData, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getMyPayments(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/customer/payments/my-payments', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getPaymentByReservation(reservationId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/customer/payments/reservation/${reservationId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== INVOICES ====================

  getMyInvoices(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/customer/invoices/my-invoices', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getInvoiceById(invoiceId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/customer/invoices/${invoiceId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getInvoiceByReservation(reservationId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/customer/invoices/reservation/${reservationId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== NOTIFICATIONS ====================

  getMyNotifications(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/customer/notifications', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getUnreadNotifications(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/customer/notifications/unread', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getUnreadCount(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/customer/notifications/unread-count', {
      headers: this.createAuthorizationHeader(),
    });
  }

  markNotificationAsRead(notificationId: number): Observable<any> {
    return this.http.put(`${BASIC_URL}api/customer/notifications/${notificationId}/read`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  markAllNotificationsAsRead(): Observable<any> {
    return this.http.put(BASIC_URL + 'api/customer/notifications/mark-all-read', null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== AVAILABILITY CHECK ====================

  checkRoomAvailability(roomId: number, checkIn: string, checkOut: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/public/availability/check?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getRoomPriceForDates(roomId: number, checkIn: string, checkOut: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/public/availability/price?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== HELPER METHODS ====================

  createAuthorizationHeader() {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set('Authorization', 'Bearer ' + this.userStorage.getToken());
  }

}
