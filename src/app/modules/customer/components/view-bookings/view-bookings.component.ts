import { Component } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { CustomerService } from '../../services/customer.service';

declare var Razorpay: any;

@Component({
  selector: 'app-view-bookings',
  standalone: false,
  templateUrl: './view-bookings.component.html',
  styleUrls: ['./view-bookings.component.scss']
})
export class ViewBookingsComponent {

  currentPage = 1;
  total = 0;
  bookings: any[] = [];
  loading = false;
  paymentLoading = false;
  cancelLoading = false;
  selectedBookingId: number | null = null;

  // Invoice Modal
  invoiceModalVisible = false;
  selectedInvoice: any = null;
  invoiceLoading = false;

  // GST Rates
  cgstRate = 9;
  sgstRate = 9;

  constructor(
    private customerService: CustomerService,
    private message: NzMessageService
  ) {
    this.loadRazorpayScript();
    this.getBookings();
  }

  // Get count of active bookings
  getActiveBookingsCount(): number {
    return this.bookings.filter(b =>
      ['PENDING', 'APPROVED', 'CHECKED_IN'].includes(b.reservationStatus)
    ).length;
  }

  // Check if booking can be cancelled
  canCancelBooking(booking: any): boolean {
    // Can cancel if PENDING or APPROVED and not yet checked in
    const cancellableStatuses = ['PENDING', 'APPROVED'];
    if (!cancellableStatuses.includes(booking.reservationStatus)) {
      return false;
    }

    // Cannot cancel if already paid
    if (booking.isPaid) {
      return false;
    }

    // Check if check-in date is in the future
    const checkInDate = new Date(booking.checkInDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return checkInDate > today;
  }

  // Cancel booking
  cancelBooking(booking: any): void {
    this.cancelLoading = true;
    this.selectedBookingId = booking.id;

    this.customerService.cancelBooking(booking.id).subscribe({
      next: () => {
        this.message.success('Booking cancelled successfully');
        booking.reservationStatus = 'CANCELLED';
        this.cancelLoading = false;
        this.selectedBookingId = null;
        this.getBookings(); // Refresh the list
      },
      error: (error) => {
        this.message.error(error.error?.message || 'Failed to cancel booking');
        this.cancelLoading = false;
        this.selectedBookingId = null;
      }
    });
  }

  loadRazorpayScript(): void {
    if (!(window as any).Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;
      document.body.appendChild(script);
    }
  }

  getBookings(): void {
    this.loading = true;
    this.customerService.getMyBookings(this.currentPage - 1).subscribe({
      next: (res) => {
        this.bookings = res.reservationDtoList || [];
        this.total = (res.totalPages || 1) * 5;
        this.loading = false;
      },
      error: (error) => {
        this.message.error(error.error || 'Failed to load bookings');
        this.loading = false;
      }
    });
  }

  pageIndexChange(value: number): void {
    this.currentPage = value;
    this.getBookings();
  }

  // Calculate GST breakdown
  calculateGST(amount: number): { cgst: number; sgst: number; total: number; grandTotal: number } {
    const cgst = Math.round(amount * this.cgstRate / 100);
    const sgst = Math.round(amount * this.sgstRate / 100);
    const total = cgst + sgst;
    const grandTotal = amount + total;
    return { cgst, sgst, total, grandTotal };
  }

  // Check if payment is needed
  canPay(booking: any): boolean {
    return booking.reservationStatus === 'APPROVED' && !booking.isPaid;
  }

  // Check if can view invoice
  canViewInvoice(booking: any): boolean {
    return booking.reservationStatus === 'CHECKED_IN' ||
           booking.reservationStatus === 'CHECKED_OUT' ||
           booking.isPaid;
  }

  // Initiate Payment
  initiatePayment(booking: any): void {
    this.paymentLoading = true;
    this.selectedBookingId = booking.id;

    this.customerService.createPaymentOrder(booking.id).subscribe({
      next: (orderResponse) => {
        this.paymentLoading = false;
        this.openRazorpayCheckout(orderResponse, booking);
      },
      error: (error) => {
        this.paymentLoading = false;
        this.selectedBookingId = null;
        this.message.error(error.error?.error || 'Failed to create payment order');
      }
    });
  }

  openRazorpayCheckout(orderData: any, booking: any): void {
    const options = {
      key: orderData.key || 'rzp_test_yourkeyhere',
      amount: orderData.amount,
      currency: orderData.currency || 'INR',
      name: 'Hotel Management System',
      description: `Booking #${booking.id} - ${booking.roomName}`,
      order_id: orderData.orderId,
      prefill: {
        name: booking.userName || '',
        email: '',
        contact: ''
      },
      theme: {
        color: '#1890ff'
      },
      handler: (response: any) => {
        this.verifyPayment(response, booking);
      },
      modal: {
        ondismiss: () => {
          this.message.warning('Payment cancelled');
        }
      }
    };

    const rzp = new Razorpay(options);
    rzp.on('payment.failed', (response: any) => {
      this.message.error('Payment failed: ' + response.error.description);
    });
    rzp.open();
  }

  verifyPayment(razorpayResponse: any, booking: any): void {
    const paymentData = {
      razorpayOrderId: razorpayResponse.razorpay_order_id,
      razorpayPaymentId: razorpayResponse.razorpay_payment_id,
      razorpaySignature: razorpayResponse.razorpay_signature
    };

    this.customerService.verifyPayment(paymentData).subscribe({
      next: (result) => {
        this.message.success('Payment successful!');
        booking.isPaid = true;
        this.getBookings();

        // Show invoice after successful payment
        setTimeout(() => {
          this.viewInvoice(booking);
        }, 1000);
      },
      error: (error) => {
        this.message.error('Payment verification failed');
      }
    });
  }

  // View Invoice
  viewInvoice(booking: any): void {
    this.invoiceLoading = true;
    this.invoiceModalVisible = true;

    this.customerService.getInvoiceByReservation(booking.id).subscribe({
      next: (invoice) => {
        this.selectedInvoice = invoice;
        this.invoiceLoading = false;
      },
      error: (error) => {
        // If no invoice exists, create one from booking data
        const gst = this.calculateGST(booking.price);
        this.selectedInvoice = {
          invoiceNumber: `INV-${booking.id}-${Date.now()}`,
          reservationId: booking.id,
          guestName: booking.userName,
          roomName: booking.roomName,
          roomType: booking.roomType,
          checkInDate: booking.checkInDate,
          checkOutDate: booking.checkOutDate,
          nights: booking.nights || this.calculateNights(booking.checkInDate, booking.checkOutDate),
          roomCharges: booking.price,
          serviceCharges: 0,
          additionalCharges: 0,
          discount: booking.discount || 0,
          subtotal: booking.price - (booking.discount || 0),
          cgst: gst.cgst,
          sgst: gst.sgst,
          totalTax: gst.total,
          grandTotal: gst.grandTotal - (booking.discount || 0),
          amountPaid: booking.isPaid ? gst.grandTotal - (booking.discount || 0) : 0,
          balanceDue: booking.isPaid ? 0 : gst.grandTotal - (booking.discount || 0),
          isPaid: booking.isPaid,
          issuedAt: new Date().toISOString()
        };
        this.invoiceLoading = false;
      }
    });
  }

  calculateNights(checkIn: string, checkOut: string): number {
    if (!checkIn || !checkOut) return 1;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 1;
  }

  closeInvoiceModal(): void {
    this.invoiceModalVisible = false;
    this.selectedInvoice = null;
  }

  // Print Invoice
  printInvoice(): void {
    const printContent = document.getElementById('invoice-print-section');
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      this.message.error('Please allow popups to print invoice');
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${this.selectedInvoice?.invoiceNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', Arial, sans-serif; padding: 40px; color: #333; }
          .invoice-container { max-width: 800px; margin: 0 auto; }
          .invoice-header { text-align: center; margin-bottom: 30px; border-bottom: 3px solid #1890ff; padding-bottom: 20px; }
          .invoice-header h1 { color: #1890ff; font-size: 28px; margin-bottom: 5px; }
          .invoice-header .subtitle { color: #666; font-size: 14px; }
          .invoice-title { background: #1890ff; color: white; padding: 10px 20px; font-size: 20px; margin: 20px 0; }
          .invoice-meta { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .invoice-meta-section { flex: 1; }
          .invoice-meta-section h3 { color: #1890ff; margin-bottom: 10px; font-size: 14px; text-transform: uppercase; }
          .invoice-meta-section p { margin: 5px 0; font-size: 14px; }
          .invoice-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          .invoice-table th { background: #f5f5f5; padding: 12px; text-align: left; border-bottom: 2px solid #ddd; }
          .invoice-table td { padding: 12px; border-bottom: 1px solid #eee; }
          .invoice-table .amount { text-align: right; }
          .invoice-summary { margin-top: 30px; }
          .summary-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; }
          .summary-row.subtotal { border-top: 2px solid #333; margin-top: 10px; padding-top: 15px; }
          .summary-row.grand-total { background: #1890ff; color: white; padding: 15px; margin-top: 10px; font-size: 18px; font-weight: bold; }
          .summary-row .label { font-weight: 500; }
          .tax-note { font-size: 12px; color: #666; margin-top: 5px; }
          .footer { margin-top: 40px; text-align: center; color: #666; font-size: 12px; border-top: 1px solid #ddd; padding-top: 20px; }
          .status-badge { display: inline-block; padding: 5px 15px; border-radius: 20px; font-size: 12px; font-weight: bold; }
          .status-paid { background: #52c41a; color: white; }
          .status-unpaid { background: #ff4d4f; color: white; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="invoice-container">
          <div class="invoice-header">
            <h1>HOTEL MANAGEMENT SYSTEM</h1>
            <p class="subtitle">Tax Invoice / Receipt</p>
          </div>

          <div class="invoice-title">
            INVOICE #${this.selectedInvoice?.invoiceNumber}
            <span class="status-badge ${this.selectedInvoice?.isPaid ? 'status-paid' : 'status-unpaid'}" style="float: right;">
              ${this.selectedInvoice?.isPaid ? 'PAID' : 'UNPAID'}
            </span>
          </div>

          <div class="invoice-meta">
            <div class="invoice-meta-section">
              <h3>Bill To</h3>
              <p><strong>${this.selectedInvoice?.guestName || 'Guest'}</strong></p>
              <p>${this.selectedInvoice?.guestEmail || ''}</p>
              <p>${this.selectedInvoice?.guestPhone || ''}</p>
              ${this.selectedInvoice?.gstin ? `<p>GSTIN: ${this.selectedInvoice.gstin}</p>` : ''}
            </div>
            <div class="invoice-meta-section" style="text-align: right;">
              <h3>Invoice Details</h3>
              <p>Date: ${new Date(this.selectedInvoice?.issuedAt).toLocaleDateString('en-IN')}</p>
              <p>Reservation #${this.selectedInvoice?.reservationId}</p>
            </div>
          </div>

          <table class="invoice-table">
            <thead>
              <tr>
                <th>Description</th>
                <th>Details</th>
                <th class="amount">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${this.selectedInvoice?.roomName || 'Room'}</strong><br><small>${this.selectedInvoice?.roomType || ''}</small></td>
                <td>
                  Check-in: ${new Date(this.selectedInvoice?.checkInDate).toLocaleDateString('en-IN')}<br>
                  Check-out: ${new Date(this.selectedInvoice?.checkOutDate).toLocaleDateString('en-IN')}<br>
                  <small>${this.selectedInvoice?.nights || 1} Night(s)</small>
                </td>
                <td class="amount">₹${(this.selectedInvoice?.roomCharges || 0).toLocaleString('en-IN')}</td>
              </tr>
              ${this.selectedInvoice?.serviceCharges > 0 ? `
              <tr>
                <td>Service Charges</td>
                <td>Additional Services</td>
                <td class="amount">₹${this.selectedInvoice.serviceCharges.toLocaleString('en-IN')}</td>
              </tr>` : ''}
              ${this.selectedInvoice?.additionalCharges > 0 ? `
              <tr>
                <td>Additional Charges</td>
                <td>${this.selectedInvoice.additionalChargesDescription || 'Extra charges'}</td>
                <td class="amount">₹${this.selectedInvoice.additionalCharges.toLocaleString('en-IN')}</td>
              </tr>` : ''}
            </tbody>
          </table>

          <div class="invoice-summary">
            <div class="summary-row">
              <span class="label">Subtotal</span>
              <span>₹${(this.selectedInvoice?.subtotal || this.selectedInvoice?.roomCharges || 0).toLocaleString('en-IN')}</span>
            </div>
            ${this.selectedInvoice?.discount > 0 ? `
            <div class="summary-row" style="color: #52c41a;">
              <span class="label">Discount</span>
              <span>- ₹${this.selectedInvoice.discount.toLocaleString('en-IN')}</span>
            </div>` : ''}
            <div class="summary-row">
              <span class="label">CGST (9%)</span>
              <span>₹${(this.selectedInvoice?.cgst || 0).toLocaleString('en-IN')}</span>
            </div>
            <div class="summary-row">
              <span class="label">SGST (9%)</span>
              <span>₹${(this.selectedInvoice?.sgst || 0).toLocaleString('en-IN')}</span>
            </div>
            <div class="tax-note">*Tax calculated as per GST regulations</div>
            <div class="summary-row grand-total">
              <span>GRAND TOTAL</span>
              <span>₹${(this.selectedInvoice?.grandTotal || 0).toLocaleString('en-IN')}</span>
            </div>
            ${this.selectedInvoice?.amountPaid > 0 ? `
            <div class="summary-row">
              <span class="label">Amount Paid</span>
              <span style="color: #52c41a;">₹${this.selectedInvoice.amountPaid.toLocaleString('en-IN')}</span>
            </div>` : ''}
            ${this.selectedInvoice?.balanceDue > 0 ? `
            <div class="summary-row">
              <span class="label">Balance Due</span>
              <span style="color: #ff4d4f;">₹${this.selectedInvoice.balanceDue.toLocaleString('en-IN')}</span>
            </div>` : ''}
          </div>

          <div class="footer">
            <p>Thank you for staying with us!</p>
            <p>This is a computer-generated invoice and does not require a signature.</p>
            <p style="margin-top: 10px;">For any queries, please contact: support@hotelmanagement.com</p>
          </div>
        </div>
      </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  // Download Invoice as PDF (using print to PDF)
  downloadInvoice(): void {
    this.message.info('Use "Save as PDF" option in the print dialog');
    this.printInvoice();
  }

  getStatusColor(status: string): string {
    const colors: { [key: string]: string } = {
      'PENDING': 'processing',
      'APPROVED': 'success',
      'REJECTED': 'error',
      'CANCELLED': 'default',
      'CHECKED_IN': 'cyan',
      'CHECKED_OUT': 'purple',
      'NO_SHOW': 'warning'
    };
    return colors[status] || 'default';
  }

  getStatusIcon(status: string): string {
    const icons: { [key: string]: string } = {
      'PENDING': 'sync',
      'APPROVED': 'check-circle',
      'REJECTED': 'close-circle',
      'CANCELLED': 'stop',
      'CHECKED_IN': 'login',
      'CHECKED_OUT': 'logout',
      'NO_SHOW': 'warning'
    };
    return icons[status] || 'question-circle';
  }
}
