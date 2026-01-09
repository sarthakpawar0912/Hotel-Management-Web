import { Component, OnInit } from '@angular/core';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzModalService } from 'ng-zorro-antd/modal';
import { AdminService } from '../../admin-services/admin.service';

@Component({
  selector: 'app-invoices',
  standalone: false,
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  invoices: any[] = [];
  filteredInvoices: any[] = [];
  loading = false;
  filterStatus = 'all';
  searchText = '';

  selectedInvoice: any = null;
  detailModalVisible = false;

  constructor(
    private adminService: AdminService,
    private message: NzMessageService,
    private modal: NzModalService
  ) {}

  ngOnInit(): void {
    this.loadInvoices();
  }

  loadInvoices(): void {
    this.loading = true;
    this.adminService.getAllInvoices().subscribe({
      next: (res) => {
        this.invoices = res;
        this.applyFilter();
        this.loading = false;
      },
      error: () => {
        this.message.error('Failed to load invoices');
        this.loading = false;
      }
    });
  }

  applyFilter(): void {
    let filtered = [...this.invoices];

    // Filter by status
    if (this.filterStatus === 'paid') {
      filtered = filtered.filter(i => i.isPaid);
    } else if (this.filterStatus === 'unpaid') {
      filtered = filtered.filter(i => !i.isPaid);
    }

    // Filter by search text
    if (this.searchText) {
      const search = this.searchText.toLowerCase();
      filtered = filtered.filter(i =>
        i.invoiceNumber?.toLowerCase().includes(search) ||
        i.guestName?.toLowerCase().includes(search) ||
        i.userName?.toLowerCase().includes(search) ||
        i.guestEmail?.toLowerCase().includes(search) ||
        i.reservationId?.toString().includes(search)
      );
    }

    this.filteredInvoices = filtered;
  }

  clearFilters(): void {
    this.filterStatus = 'all';
    this.searchText = '';
    this.filteredInvoices = [...this.invoices];
  }

  viewInvoice(invoice: any): void {
    this.selectedInvoice = invoice;
    this.detailModalVisible = true;
  }

  markAsPaid(invoiceId: number): void {
    this.modal.confirm({
      nzTitle: 'Mark as Paid',
      nzContent: 'Are you sure you want to mark this invoice as paid?',
      nzOnOk: () => {
        this.adminService.markInvoiceAsPaid(invoiceId).subscribe({
          next: () => {
            this.message.success('Invoice marked as paid');
            this.loadInvoices();
          },
          error: () => this.message.error('Failed to update invoice')
        });
      }
    });
  }

  downloadInvoice(invoice: any): void {
    this.selectedInvoice = invoice;
    this.message.info('Preparing invoice for download...');

    // Generate PDF using browser print to PDF
    setTimeout(() => {
      const printContent = document.getElementById('invoicePrint');
      if (printContent) {
        const originalContent = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContent;
        window.location.reload();
      }
    }, 200);
  }

  printInvoice(invoice: any): void {
    this.selectedInvoice = invoice;
    setTimeout(() => {
      const printContent = document.getElementById('invoicePrint');
      if (printContent) {
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(`
            <html>
              <head>
                <title>Invoice ${invoice.invoiceNumber}</title>
                <style>
                  body { font-family: Arial, sans-serif; padding: 20px; }
                  .invoice-header { display: flex; justify-content: space-between; margin-bottom: 20px; }
                  .invoice-brand h2 { margin: 0; color: #6a1b9a; }
                  .invoice-meta h3 { margin: 0 0 8px 0; }
                  .info-section { margin-bottom: 16px; }
                  .info-section h4 { margin: 0 0 8px 0; color: #6a1b9a; }
                  .info-section p { margin: 4px 0; }
                  .charges-breakdown { margin-top: 16px; }
                  .charge-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f0f0f0; }
                  .charge-item.total { font-weight: bold; font-size: 18px; border-top: 2px solid #6a1b9a; }
                  .charge-item.due { color: #ff4d4f; font-weight: bold; }
                  .charge-item.discount { color: #52c41a; }
                  hr { border: none; border-top: 1px solid #e8e8e8; margin: 16px 0; }
                  @media print { body { print-color-adjust: exact; -webkit-print-color-adjust: exact; } }
                </style>
              </head>
              <body>
                ${printContent.innerHTML}
              </body>
            </html>
          `);
          printWindow.document.close();
          printWindow.print();
        }
      }
    }, 200);
  }

  addCharges(invoice: any): void {
    this.modal.confirm({
      nzTitle: 'Add Additional Charges',
      nzContent: 'Enter amount to add:',
      nzOnOk: () => {
        this.adminService.addAdditionalCharges(invoice.id, 500, 'Additional services').subscribe({
          next: () => {
            this.message.success('Charges added');
            this.loadInvoices();
          },
          error: () => this.message.error('Failed to add charges')
        });
      }
    });
  }

  applyDiscount(invoice: any): void {
    this.modal.confirm({
      nzTitle: 'Apply Discount',
      nzContent: 'Enter discount amount:',
      nzOnOk: () => {
        this.adminService.applyDiscount(invoice.id, 200, 'Loyalty discount').subscribe({
          next: () => {
            this.message.success('Discount applied');
            this.loadInvoices();
          },
          error: () => this.message.error('Failed to apply discount')
        });
      }
    });
  }

  getTotalStats(): any {
    return {
      total: this.invoices.length,
      paid: this.invoices.filter(i => i.isPaid).length,
      unpaid: this.invoices.filter(i => !i.isPaid).length,
      totalAmount: this.invoices.reduce((sum, i) => sum + (i.grandTotal || 0), 0),
      outstandingAmount: this.invoices.filter(i => !i.isPaid).reduce((sum, i) => sum + (i.balanceDue || 0), 0)
    };
  }
}
