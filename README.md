# DevConnect

A full-stack developer networking platform inspired by Tinder — connect with other developers, send connection requests, and upgrade to premium plans with Razorpay integration.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Redux Toolkit, React Router DOM 7, Tailwind CSS, DaisyUI, Vite, Axios |
| **Backend** | Node.js, Express 5, Mongoose, JWT, Bcrypt, Cookie Parser, CORS |
| **Database** | MongoDB (Mongoose ODM) |
| **Payments** | Razorpay |

## Features

- **Authentication** — Sign up, login, logout with JWT stored in HTTP-only cookies
- **Feed** — Discover other developers with skill-based filtering
- **Connection Requests** — Send interest / ignore requests, accept or reject incoming requests
- **Profile** — View and edit your profile, change password
- **Premium Plans** — Silver (₹299/mo) and Gold (₹499/mo) with Razorpay checkout
- **Payment History** — View all past transactions
- **Webhooks** — Razorpay webhook handler for payment status updates and refunds

## Project Structure

```
DevConnect-backend/
├── src/
│   ├── app.js                    # Express app, CORS, webhook, route registration
│   ├── config/
│   │   └── database.js           # MongoDB connection helper
│   ├── middlewares/
│   │   └── auth.js               # JWT cookie-based authentication
│   ├── models/
│   │   ├── user.js               # User schema
│   │   ├── payment.js            # Payment schema
│   │   └── connectionRequest.js  # Connection request schema
│   ├── routes/
│   │   ├── auth.js               # Signup, login, logout
│   │   ├── profile.js            # View/edit profile, change password
│   │   ├── request.js            # Send/review connection requests
│   │   ├── user.js               # Feed, connections, requests
│   │   └── payment.js            # Payment order, verify, history, plans
│   └── utils/
│       ├── validation.js         # Signup + profile validators
│       └── razorpay.js           # Razorpay SDK instance
├── .env                          # Environment variables
├── .env.example                  # Environment template
└── package.json

DevConnect-web/
├── src/
│   ├── App.jsx                   # Router setup
│   ├── main.jsx                  # React entry point
│   ├── components/
│   │   ├── Body.jsx              # Authenticated layout wrapper
│   │   ├── NavBar.jsx            # Navigation bar
│   │   ├── Footer.jsx            # Footer
│   │   ├── Login.jsx             # Login / Signup form
│   │   ├── Feed.jsx              # People you may know
│   │   ├── Profile.jsx           # Profile wrapper
│   │   ├── EditProfile.jsx       # Edit profile form
│   │   ├── Connections.jsx       # Connections list
│   │   ├── Requests.jsx          # Incoming requests
│   │   ├── UserCard.jsx          # Reusable user card
│   │   ├── Premium.jsx           # Premium plans with Razorpay checkout
│   │   ├── PaymentSuccess.jsx    # Payment success page
│   │   └── PaymentFailure.jsx    # Payment failure page
│   └── utils/
│       ├── constants.js          # BASE_URL from env
│       ├── apiClient.js          # Axios instance with 401 interceptor
│       ├── appStore.js           # Redux store
│       ├── userSlice.js          # User state
│       ├── feedSlice.js          # Feed state
│       ├── connectionSlice.js    # Connections state
│       ├── requestSlice.js       # Requests state
│       └── paymentService.js     # Payment API calls
├── .env                          # Frontend env vars
├── vite.config.js
├── tailwind.config.js
└── package.json
```

## Getting Started

### Prerequisites

- Node.js (v16+)
- MongoDB
- Razorpay account (test mode is fine)

### 1. Clone the repository

```bash
git clone <repo-url>
cd DevConnect-backend
cd ../DevConnect-web
```

### 2. Backend Setup

```bash
cd DevConnect-backend
npm install
```

Create a `.env` file in the backend root:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
RAZORPAY_KEY_ID=rzp_test_YOUR_KEY_ID
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret
```

Start the backend server:

```bash
npm run dev
```

Server runs at `http://localhost:3000`

### 3. Frontend Setup

```bash
cd DevConnect-web
npm install
```

Create a `.env` file in the frontend root:

```env
VITE_API_URL=http://localhost:3000
VITE_RAZORPAY_KEY_ID=rzp_test_********
```

Start the frontend dev server:

```bash
npm run dev
```

Frontend runs at `http://localhost:5173`

### 4. Razorpay Webhook Setup

In your Razorpay Dashboard:
1. Go to **Settings → Webhooks**
2. Add webhook URL: `https://your-domain.com/payment/webhook`
3. Select events: `payment.captured`, `payment.failed`, `refund.processed`, `refund.failed`
4. Copy the webhook secret and add it to backend `.env` as `RAZORPAY_WEBHOOK_SECRET`

## API Endpoints

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/signup` | Register new user |
| POST | `/login` | Login user |
| POST | `/logout` | Logout user |

### Profile
| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile/view` | View own profile |
| PATCH | `/profile/edit` | Edit profile |
| PATCH | `/profile/password` | Change password |

### Connection Requests
| Method | Endpoint | Description |
|---|---|---|
| POST | `/request/send/interested/:userId` | Send interest |
| POST | `/request/send/ignored/:userId` | Ignore user |
| POST | `/request/review/accepted/:requestId` | Accept request |
| POST | `/request/review/rejected/:requestId` | Reject request |

### Users
| Method | Endpoint | Description |
|---|---|---|
| GET | `/user/feed` | Get feed suggestions |
| GET | `/user/connections` | Get connections |
| GET | `/user/requests` | Get received requests |

### Payments
| Method | Endpoint | Description |
|---|---|---|
| POST | `/payment/create` | Create Razorpay order |
| POST | `/payment/verify` | Verify payment signature |
| POST | `/payment/webhook` | Razorpay webhook handler |
| GET | `/payment/history` | Get payment history |
| GET | `/payment/plans` | Get available plans |
| GET | `/payment/:id` | Get payment by ID |

## Test Credentials / Dummy Data

### Razorpay Test Cards

Use these test card details in Razorpay checkout to verify payment flow:

| Field | Value |
|---|---|
| Card Number | `4111 1111 1111 1111` |
| CVV | `123` (any 3 digits) |
| Expiry | Any future date (e.g., `12/28`) |
| Name | Any name (e.g., `Test User`) |

For UPI test payments, use any valid UPI ID like `success@razorpay` (success scenario) or `failure@razorpay` (failure scenario).

### Dummy User for Testing

You can sign up a test user directly from the frontend `/login` page:

| Field | Value |
|---|---|
| First Name | `Test` |
| Last Name | `User` |
| Email | `test@example.com` |
| Password | `Test@1234` |
| Age | `25` |
| Gender | `male` |

Or use this cURL command:

```bash
curl -X POST http://localhost:3000/signup \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Test",
    "lastName": "User",
    "emailId": "test@example.com",
    "password": "Test@1234",
    "age": 25,
    "gender": "male"
  }'
```

## Environment Variables

### Backend (.env)
| Variable | Description |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Secret for signing JWT tokens |
| `RAZORPAY_KEY_ID` | Razorpay test/live key ID |
| `RAZORPAY_KEY_SECRET` | Razorpay test/live key secret |
| `RAZORPAY_WEBHOOK_SECRET` | Razorpay webhook secret for signature verification |

### Frontend (.env)
| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL |
| `VITE_RAZORPAY_KEY_ID` | Razorpay public key for Checkout SDK |

## Scripts

### Backend
```bash
npm start      # Start with node
npm run dev    # Start with nodemon (auto-reload)
```

### Frontend
```bash
npm run dev    # Start dev server
npm run build  # Production build
npm run lint   # Run ESLint
npm run preview # Preview production build
```

## Database Schema

### User
- `firstName`, `lastName`, `emailId`, `password`, `age`, `gender`, `photoUrl`, `about`, `skills`
- Timestamps enabled
- Password hashed with bcrypt

### Payment
- `userId`, `amount`, `currency`, `status`, `paymentGateway`
- `razorpayOrderId`, `razorpayPaymentId`, `razorpaySignature`
- `planId`, `planName`, `paymentMethod`
- `refundId`, `refundStatus`
- Timestamps enabled

### ConnectionRequest
- `fromUserId`, `toUserId`, `status` (interested/ignored/accepted/rejected)
- Timestamps enabled
- Compound unique index on `{ fromUserId, toUserId }`

## License

ISC
