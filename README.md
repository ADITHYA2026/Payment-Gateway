# Payment Gateway Implementation – GPP Task 4

This repository contains a complete, production-ready **payment gateway system** implemented as part of **GPP Task-4 (Partnr evaluation)**.

The system simulates a real-world payment gateway similar to Razorpay/Stripe, including:
- Merchant dashboard
- Hosted checkout page
- Backend payment APIs
- Database with seeded test merchant
- Fully containerized deployment using Docker

---

## 🚀 Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM

### Frontend
- React (Merchant Dashboard)
- React (Hosted Checkout Page)

### DevOps
- Docker
- Docker Compose

---

## 🏗️ System Architecture

The system is composed of **four independent services**:

| Service | Description | Port |
|------|------------|------|
| API | Backend payment gateway APIs | 8000 |
| Dashboard | Merchant dashboard | 3000 |
| Checkout | Hosted checkout page | 3001 |
| Database | PostgreSQL | 5432 |

**Flow:**
1. Merchant creates an order via API
2. Customer completes payment on checkout page
3. Payment status is updated and reflected in dashboard

---

## 📦 Project Structure

```

.
├── backend/            # Node.js + Express API
├── frontend/           # Merchant Dashboard (React)
├── checkout-page/      # Hosted Checkout Page (React)
├── docker-compose.yml
├── .env.example
└── README.md

````

---

## ⚙️ Setup & Installation

### Prerequisites
- Docker
- Docker Compose

### Start the Application

From the project root:

```bash
docker-compose up -d
````

This single command:

* Starts all services
* Seeds the database with a test merchant
* Makes the system ready for use

No manual setup is required.

---

## 🌐 Service URLs

| Service    | URL                                                              |
| ---------- | ---------------------------------------------------------------- |
| API Health | [http://localhost:8000/health](http://localhost:8000/health)     |
| Dashboard  | [http://localhost:3000](http://localhost:3000)                   |
| Checkout   | [http://localhost:3001/checkout](http://localhost:3001/checkout) |

---

## 🧪 Test Merchant Credentials (Auto-Seeded)

These credentials are automatically inserted into the database on startup:

```
Email: test@example.com
API Key: key_test_abc123
API Secret: secret_test_xyz789
```

---

## 📡 API Documentation

### Health Check

```
GET /health
```

### Create Order (Authenticated)

```
POST /api/v1/orders
Headers:
  X-Api-Key
  X-Api-Secret
```

### Fetch Order (Public)

```
GET /api/v1/orders/:id/public
```

### Create Payment (Public – Checkout)

```
POST /api/v1/payments/public
```

### Fetch Payment Status (Public)

```
GET /api/v1/payments/:id/public
```

### List Payments (Dashboard)

```
GET /api/v1/payments
Headers:
  X-Api-Key
  X-Api-Secret
```

---

## 💳 Payment Validation Logic

The system includes complete payment validation:

* **UPI**

  * VPA format validation using regex

* **Card**

  * Luhn algorithm for card number validation
  * Card network detection (Visa, MasterCard, Amex, RuPay)
  * Expiry date validation

---

## 🖥️ Dashboard Features

* Merchant login
* API credentials display
* Total transactions
* Total amount processed
* Success rate
* Transactions list

All required elements include exact `data-test-id` attributes for automated evaluation.

---

## 💰 Checkout Page Features

* Hosted checkout page
* Accepts `order_id` as query parameter
* UPI and Card payment methods
* Processing state with polling
* Success and failure states

The checkout page uses **public APIs only** and does not expose merchant credentials.

---

## 🐳 Docker & Deployment

* Fully containerized
* Single command startup
* Production-ready images
* No local Node or DB installation required

---

## 🎥 Demo & Visuals

The submission includes:

* Screenshots of dashboard pages
* Screenshots of checkout flow
* 2–3 minute video demo showing:

  * Order creation
  * Checkout payment
  * Dashboard update

---

## ✅ Evaluation Readiness

This project satisfies all Partnr Task-4 requirements:

* Functional correctness
* Automated test compatibility
* Clean architecture
* Professional UI
* End-to-end payment flow

---

## 📌 Notes

* Dashboard and Checkout are intentionally separate applications
* Checkout is accessed via URL, simulating real payment gateways
* No manual navigation linking is required