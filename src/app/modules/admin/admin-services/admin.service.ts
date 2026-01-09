import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserStorageService } from '../../../auth/services/storage/user-storage.service';

const BASIC_URL = "http://localhost:8080/";

@Injectable({
  providedIn: 'root'
})

export class AdminService {

  constructor(private http: HttpClient,
    private userStorage: UserStorageService
  ) { }

  // ==================== ROOM MANAGEMENT ====================

  postRoomDetails(formData: FormData): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/room', formData, {
      headers: this.createAuthorizationHeaderWithoutContentType(),
    });
  }

  getRooms(pageNumber: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/rooms/${pageNumber}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deleteRoom(roomId: number): Observable<any> {
    return this.http.delete(BASIC_URL + `api/admin/room/${roomId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateRoomDetails(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/room/${id}`, formData, {
      headers: this.createAuthorizationHeaderWithoutContentType(),
    });
  }

  getRoomsById(id: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/room/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  searchRooms(
    name?: string,
    type?: string,
    minPrice?: number,
    maxPrice?: number,
    capacity?: number,
    available?: boolean,
    pageNumber: number = 0
  ): Observable<any> {
    let params = new HttpParams().set('pageNumber', pageNumber.toString());

    if (name) params = params.set('name', name);
    if (type) params = params.set('type', type);
    if (minPrice !== undefined && minPrice !== null) params = params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined && maxPrice !== null) params = params.set('maxPrice', maxPrice.toString());
    if (capacity !== undefined && capacity !== null) params = params.set('capacity', capacity.toString());
    if (available !== undefined && available !== null) params = params.set('available', available.toString());

    return this.http.get(BASIC_URL + 'api/admin/rooms/search', {
      headers: this.createAuthorizationHeader(),
      params: params
    });
  }

  getFilterOptions(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/rooms/filter-options', {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== RESERVATION MANAGEMENT ====================

  getReservations(pageNumber: number): Observable<any> {
    return this.http.get(BASIC_URL + `api/admin/reservations/${pageNumber}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  changeReservationStatus(reservationId: number, status: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/reservation/${reservationId}/${status}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== GUEST MANAGEMENT ====================

  createGuest(guestData: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/guests', guestData, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateGuest(id: number, guestData: any): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/guests/${id}`, guestData, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getGuestById(id: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/guests/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllGuests(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/guests', {
      headers: this.createAuthorizationHeader(),
    });
  }

  searchGuests(search: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/guests/search?name=${search}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getVipGuests(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/guests/vip', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getBlacklistedGuests(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/guests/blacklisted', {
      headers: this.createAuthorizationHeader(),
    });
  }

  addLoyaltyPoints(guestId: number, points: number): Observable<any> {
    return this.http.post(`${BASIC_URL}api/admin/guests/${guestId}/loyalty/add?points=${points}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deductLoyaltyPoints(guestId: number, points: number): Observable<any> {
    return this.http.post(`${BASIC_URL}api/admin/guests/${guestId}/loyalty/deduct?points=${points}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  markGuestAsVip(guestId: number, isVip: boolean = true): Observable<any> {
    return this.http.post(`${BASIC_URL}api/admin/guests/${guestId}/vip?isVip=${isVip}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  blacklistGuest(guestId: number, reason: string): Observable<any> {
    return this.http.post(`${BASIC_URL}api/admin/guests/${guestId}/blacklist?reason=${reason}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  removeGuestFromBlacklist(guestId: number): Observable<any> {
    return this.http.delete(`${BASIC_URL}api/admin/guests/${guestId}/blacklist`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deleteGuest(guestId: number): Observable<any> {
    return this.http.delete(`${BASIC_URL}api/admin/guests/${guestId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== CHECK-IN/CHECK-OUT ====================

  checkIn(reservationId: number, checkInDetails?: any): Observable<any> {
    return this.http.post(`${BASIC_URL}api/admin/check-in-out/check-in/${reservationId}`, checkInDetails || {}, {
      headers: this.createAuthorizationHeader(),
    });
  }

  checkOut(reservationId: number, checkOutDetails?: any): Observable<any> {
    return this.http.post(`${BASIC_URL}api/admin/check-in-out/check-out/${reservationId}`, checkOutDetails || {}, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getTodayCheckIns(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/check-in-out/today-check-ins', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getTodayCheckOuts(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/check-in-out/today-check-outs', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getUpcomingCheckIns(days: number = 7): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/check-in-out/upcoming-check-ins?days=${days}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getUpcomingCheckOuts(days: number = 7): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/check-in-out/upcoming-check-outs?days=${days}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getPendingCheckIns(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/check-in-out/pending-check-ins', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getPendingCheckOuts(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/check-in-out/pending-check-outs', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getCurrentlyCheckedInGuests(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/check-in-out/currently-checked-in', {
      headers: this.createAuthorizationHeader(),
    });
  }

  markAsNoShow(reservationId: number): Observable<any> {
    return this.http.post(`${BASIC_URL}api/admin/check-in-out/no-show/${reservationId}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  cancelReservation(reservationId: number, reason: string): Observable<any> {
    return this.http.post(`${BASIC_URL}api/admin/check-in-out/cancel/${reservationId}?reason=${reason}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getDailySummary(date: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/check-in-out/daily-summary?date=${date}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getOccupancyStatus(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/check-in-out/occupancy-status', {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== REPORTS & ANALYTICS ====================

  getDashboardSummary(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/reports/dashboard', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getQuickStats(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/reports/quick-stats', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getRevenueReport(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/reports/revenue?startDate=${startDate}&endDate=${endDate}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getDailyRevenue(date: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/reports/revenue/daily?date=${date}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getMonthlyRevenue(year: number, month: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/reports/revenue/monthly?year=${year}&month=${month}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getYearlyRevenue(year: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/reports/revenue/yearly?year=${year}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getOccupancyReport(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/reports/occupancy?startDate=${startDate}&endDate=${endDate}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getBookingReport(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/reports/bookings?startDate=${startDate}&endDate=${endDate}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getGuestReport(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/reports/guests?startDate=${startDate}&endDate=${endDate}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getRepeatGuestAnalysis(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/reports/guests/repeat-analysis', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getRoomPerformanceReport(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/reports/room-performance?startDate=${startDate}&endDate=${endDate}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getTaxReport(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/reports/tax?startDate=${startDate}&endDate=${endDate}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== REVIEWS MANAGEMENT ====================

  getAllReviews(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/reviews', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getPendingReviews(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/reviews/pending', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getApprovedReviews(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/reviews/approved', {
      headers: this.createAuthorizationHeader(),
    });
  }

  approveReview(reviewId: number): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/reviews/${reviewId}/approve`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  rejectReview(reviewId: number): Observable<any> {
    return this.http.delete(`${BASIC_URL}api/admin/reviews/${reviewId}/reject`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  respondToReview(reviewId: number, response: string): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/reviews/${reviewId}/respond?response=${encodeURIComponent(response)}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getReviewStatistics(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/reviews/statistics', {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== PROMOTIONS MANAGEMENT ====================

  createPromotion(promotionData: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/promotions', promotionData, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updatePromotion(id: number, promotionData: any): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/promotions/${id}`, promotionData, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllPromotions(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/promotions', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getPromotionById(id: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/promotions/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getActivePromotions(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/promotions/active', {
      headers: this.createAuthorizationHeader(),
    });
  }

  activatePromotion(id: number): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/promotions/${id}/activate`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deactivatePromotion(id: number): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/promotions/${id}/deactivate`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deletePromotion(id: number): Observable<any> {
    return this.http.delete(`${BASIC_URL}api/admin/promotions/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  validatePromoCode(code: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/promotions/validate/${code}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== INVOICE MANAGEMENT ====================

  generateInvoice(reservationId: number): Observable<any> {
    return this.http.post(`${BASIC_URL}api/admin/invoices/generate/${reservationId}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getInvoiceById(id: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/invoices/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getInvoiceByReservation(reservationId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/invoices/reservation/${reservationId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllInvoices(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/invoices', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getUnpaidInvoices(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/invoices/unpaid', {
      headers: this.createAuthorizationHeader(),
    });
  }

  markInvoiceAsPaid(invoiceId: number): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/invoices/${invoiceId}/mark-paid`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  addAdditionalCharges(invoiceId: number, amount: number, description: string): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/invoices/${invoiceId}/additional-charges?amount=${amount}&description=${encodeURIComponent(description)}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  applyDiscount(invoiceId: number, amount: number, description: string): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/invoices/${invoiceId}/discount?amount=${amount}&description=${encodeURIComponent(description)}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== PAYMENT MANAGEMENT ====================

  getAllPayments(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/payments', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getPaymentById(id: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/payments/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getPaymentByReservation(reservationId: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/payments/reservation/${reservationId}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getPaymentsByDateRange(startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/payments/date-range?startDate=${startDate}&endDate=${endDate}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== PROPERTY MANAGEMENT ====================

  createProperty(propertyData: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/properties', propertyData, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updateProperty(id: number, propertyData: any): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/properties/${id}`, propertyData, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getPropertyById(id: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/properties/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllProperties(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/properties', {
      headers: this.createAuthorizationHeader(),
    });
  }

  getActiveProperties(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/properties/active', {
      headers: this.createAuthorizationHeader(),
    });
  }

  activateProperty(id: number): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/properties/${id}/activate`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deactivateProperty(id: number): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/properties/${id}/deactivate`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  deleteProperty(id: number): Observable<any> {
    return this.http.delete(`${BASIC_URL}api/admin/properties/${id}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  updatePropertyLogo(id: number, formData: FormData): Observable<any> {
    return this.http.put(`${BASIC_URL}api/admin/properties/${id}/logo`, formData, {
      headers: this.createAuthorizationHeaderWithoutContentType(),
    });
  }

  // ==================== CALENDAR & AVAILABILITY ====================

  getRoomAvailability(roomId: number, startDate: string, endDate: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/availability/room/${roomId}?startDate=${startDate}&endDate=${endDate}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  checkRoomAvailability(roomId: number, checkIn: string, checkOut: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/availability/check?roomId=${roomId}&checkIn=${checkIn}&checkOut=${checkOut}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAvailableRoomsForDates(checkIn: string, checkOut: string): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/availability/available-rooms?checkIn=${checkIn}&checkOut=${checkOut}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  setCustomPricing(roomId: number, date: string, customPrice: number): Observable<any> {
    return this.http.post(`${BASIC_URL}api/admin/availability/custom-price?roomId=${roomId}&date=${date}&customPrice=${customPrice}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  blockRoom(roomId: number, startDate: string, endDate: string, reason: string): Observable<any> {
    return this.http.post(`${BASIC_URL}api/admin/availability/block?roomId=${roomId}&startDate=${startDate}&endDate=${endDate}&reason=${encodeURIComponent(reason)}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  unblockRoom(roomId: number, startDate: string, endDate: string): Observable<any> {
    return this.http.post(`${BASIC_URL}api/admin/availability/unblock?roomId=${roomId}&startDate=${startDate}&endDate=${endDate}`, null, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getMonthlyCalendar(roomId: number, year: number, month: number): Observable<any> {
    return this.http.get(`${BASIC_URL}api/admin/availability/calendar/${roomId}?year=${year}&month=${month}`, {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== NOTIFICATION MANAGEMENT ====================

  sendNotification(userId: number, notificationData: any): Observable<any> {
    return this.http.post(`${BASIC_URL}api/admin/notifications/send/${userId}`, notificationData, {
      headers: this.createAuthorizationHeader(),
    });
  }

  sendBulkNotification(notificationData: any): Observable<any> {
    return this.http.post(BASIC_URL + 'api/admin/notifications/send-bulk', notificationData, {
      headers: this.createAuthorizationHeader(),
    });
  }

  getAllNotifications(): Observable<any> {
    return this.http.get(BASIC_URL + 'api/admin/notifications', {
      headers: this.createAuthorizationHeader(),
    });
  }

  // ==================== HELPER METHODS ====================

  createAuthorizationHeader() {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set('Authorization', 'Bearer ' + this.userStorage.getToken());
  }

  createAuthorizationHeaderWithoutContentType() {
    let authHeaders: HttpHeaders = new HttpHeaders();
    return authHeaders.set('Authorization', 'Bearer ' + this.userStorage.getToken());
  }

}
