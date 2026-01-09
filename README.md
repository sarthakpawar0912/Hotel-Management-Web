# Hotel Management System - Frontend

A modern **Angular 18** frontend application for the Hotel Management System featuring Ng-Zorro UI, Razorpay payment integration, and responsive design.

---

## Table of Contents

1. [Overview](#1-overview)
2. [Features](#2-features)
3. [Tech Stack](#3-tech-stack)
4. [Project Structure](#4-project-structure)
5. [Screenshots](#5-screenshots)
6. [Installation](#6-installation)
7. [Configuration](#7-configuration)
8. [Running the Application](#8-running-the-application)
9. [Customer Module](#9-customer-module)
10. [Admin Module](#10-admin-module)
11. [Razorpay Integration](#11-razorpay-integration)
12. [Styling & Theme](#12-styling--theme)

---

## 1. Overview

This is the frontend application for the Hotel Management System, providing:
- **Customer Portal**: Browse rooms, book stays, pay online, manage bookings
- **Admin Panel**: Manage rooms, reservations, guests, payments, and more
- **Responsive Design**: Works on desktop, tablet, and mobile devices

**Backend Repository:** [Hotel-Management-Application](https://github.com/sarthakpawar0912/Hotel-Management-Application.git)

---

## 2. Features

### Customer Features
- Browse available rooms with filters
- Book rooms with date selection
- Apply promo codes for discounts
- Pay online via Razorpay
- View booking history
- View and download invoices
- Submit and manage reviews
- Receive notifications

### Admin Features
- Dashboard with statistics
- Room management (CRUD)
- Reservation management
- Guest check-in/check-out
- Payment tracking
- Invoice generation
- Promotion management
- Review moderation
- Reports and analytics

---

## 3. Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 18.x | Frontend framework |
| Ng-Zorro Ant Design | 18.x | UI component library |
| TypeScript | 5.x | Programming language |
| RxJS | 7.x | Reactive programming |
| Razorpay Checkout | Latest | Payment gateway |
| SCSS | - | Styling |

---

## 4. Project Structure

```
src/
├── app/
│   ├── auth/                    # Authentication module
│   │   ├── components/          # Login, Register
│   │   └── services/            # Auth, Storage services
│   │
│   ├── modules/
│   │   ├── admin/               # Admin module
│   │   │   ├── components/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── post-room/
│   │   │   │   ├── update-room/
│   │   │   │   ├── reservations/
│   │   │   │   ├── guests/
│   │   │   │   ├── check-in-out/
│   │   │   │   ├── payments/
│   │   │   │   ├── invoices/
│   │   │   │   ├── promotions/
│   │   │   │   ├── reviews/
│   │   │   │   └── reports/
│   │   │   └── admin-services/
│   │   │
│   │   └── customer/            # Customer module
│   │       ├── components/
│   │       │   ├── layout/      # Customer layout with sidebar
│   │       │   ├── rooms/       # Browse rooms
│   │       │   ├── view-bookings/
│   │       │   ├── reviews/
│   │       │   ├── notifications/
│   │       │   └── promotions/
│   │       └── services/
│   │
│   ├── app.component.*          # Root component
│   └── app.module.ts            # Root module
│
├── assets/                      # Static assets
└── styles.scss                  # Global styles
```

---

## 5. Screenshots

### Customer Portal
- **Browse Rooms**: Grid layout with filters, room cards with images
- **Book Room**: Modal with date picker and price breakdown
- **My Bookings**: Table/card view with status badges
- **Payment**: Razorpay checkout integration

### Admin Panel
- **Dashboard**: Room grid with edit/delete actions
- **Reservations**: Table with status management
- **Check-In/Out**: Guest management interface
- **Reports**: Revenue and booking analytics

---

## 6. Installation

### Prerequisites
- Node.js 18+ and npm
- Angular CLI 18+

### Steps

```bash
# Clone the repository
git clone https://github.com/sarthakpawar0912/Hotel-Management-Web.git
cd Hotel-Management-Web

# Install dependencies
npm install

# Install Angular CLI globally (if not installed)
npm install -g @angular/cli
```

---

## 7. Configuration

### API Configuration
Edit `src/app/modules/customer/services/customer.service.ts`:

```typescript
const BASIC_URL = "http://localhost:8080/";
```

### Razorpay Configuration
The Razorpay key is received from the backend during payment creation.

---

## 8. Running the Application

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`

### Production Build

```bash
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

---

## 9. Customer Module

### Layout
The customer module uses a dedicated layout component with:
- Fixed sidebar (240px width)
- Navigation menu
- Notification badge
- Logout button

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Browse Rooms | `/customer/rooms` | View and filter available rooms |
| My Bookings | `/customer/bookings` | View booking history |
| My Reviews | `/customer/reviews` | Manage submitted reviews |
| Notifications | `/customer/notifications` | View notifications |
| Promotions | `/customer/promotions` | View active promotions |

### Booking Flow
1. Browse rooms with filters
2. Click "Book Now" on a room
3. Select check-in and check-out dates
4. View price breakdown (room rate + taxes)
5. Confirm booking
6. Wait for admin approval
7. Make payment via Razorpay
8. Receive confirmation email

---

## 10. Admin Module

### Pages

| Page | Route | Description |
|------|-------|-------------|
| Dashboard | `/admin/dashboard` | View all rooms |
| Add Room | `/admin/room` | Create new room |
| Edit Room | `/admin/room/:id` | Update room details |
| Reservations | `/admin/reservations` | Manage bookings |
| Check-In/Out | `/admin/check-in-out` | Guest management |
| Guests | `/admin/guests` | View guest records |
| Payments | `/admin/payments` | View payment history |
| Invoices | `/admin/invoices` | View/generate invoices |
| Promotions | `/admin/promotions` | Manage promo codes |
| Reviews | `/admin/reviews` | View customer reviews |
| Reports | `/admin/reports` | Analytics dashboard |

---

## 11. Razorpay Integration

### How it Works

```
1. Customer clicks "Pay Now"
           |
           v
2. Frontend calls: POST /api/customer/payments/create-order/{reservationId}
           |
           v
3. Backend creates Razorpay order and returns order details
           |
           v
4. Frontend opens Razorpay Checkout with order details
           |
           v
5. Customer completes payment on Razorpay
           |
           v
6. Razorpay returns: orderId, paymentId, signature
           |
           v
7. Frontend calls: POST /api/customer/payments/verify
           |
           v
8. Backend verifies signature and updates payment status
           |
           v
9. Success message shown to customer
```

### Code Example

```typescript
// view-bookings.component.ts

makePayment(booking: any): void {
  // 1. Create order
  this.customerService.createPaymentOrder(booking.id).subscribe({
    next: (order) => {
      // 2. Open Razorpay checkout
      const options = {
        key: order.key,
        amount: order.amount,
        currency: 'INR',
        name: 'Hotel Management',
        order_id: order.orderId,
        handler: (response: any) => {
          // 3. Verify payment
          this.verifyPayment(response);
        }
      };
      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    }
  });
}
```

---

## 12. Styling & Theme

### Color Palette

| Color | Hex Code | Usage |
|-------|----------|-------|
| Primary Purple | `#6a1b9a` | Headers, buttons, accents |
| Light Purple | `#ab47bc` | Gradients, hover states |
| Dark Purple | `#4a148c` | Sidebar, footer |
| Success Green | `#52c41a` | Success states |
| Error Red | `#ff4d4f` | Error states |
| Warning Yellow | `#faad14` | Pending states |

### Layout Classes

```scss
// Page header with gradient
.page-header {
  background: linear-gradient(135deg, #6a1b9a, #ab47bc);
  color: white;
  padding: 32px 24px;
}

// Content container
.page-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px;
}

// Card grid
.room-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
}
```

### Responsive Breakpoints

| Breakpoint | Max Width | Columns |
|------------|-----------|---------|
| Desktop | > 1200px | 3 columns |
| Tablet | 992px | 2 columns |
| Mobile | 768px | 1 column |

---

## Development Commands

```bash
# Start development server
ng serve

# Build for production
ng build --configuration production

# Run tests
ng test

# Generate component
ng generate component modules/customer/components/new-component

# Generate service
ng generate service modules/customer/services/new-service
```

---

## Author

**Sarthak Pawar**
- GitHub: [@sarthakpawar0912](https://github.com/sarthakpawar0912)

---

## License

This project is for educational and portfolio purposes.
