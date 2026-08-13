# DevConnect

A full-stack developer networking platform inspired by Tinder — connect with other developers, send connection requests, chat in real-time with Socket.io, and upgrade to premium plans with Razorpay integration.

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 19, Redux Toolkit, React Router DOM 7, Tailwind CSS, DaisyUI, Vite, Axios |
| **Backend** | Node.js, Express 5, Mongoose, JWT, Bcrypt, Cookie Parser, CORS, Nodemailer, Multer |
| **Real-time** | Socket.io |
| **Database** | MongoDB (Mongoose ODM) |
| **Payments** | Razorpay |
| **Email** | Nodemailer (Gmail SMTP) |

## Features

- **Authentication** — Sign up, login, logout, forgot password with email reset link
- **Feed** — Discover other developers with skill-based filtering
- **Connection Requests** — Send interest / ignore requests, accept or reject incoming requests
- **Profile** — View and edit profile, upload profile photo, change password
- **Real-time Chat** — Instant messaging with Socket.io, typing indicators, online status, read receipts
- **Premium Plans** — Silver (₹299/mo) and Gold (₹499/mo) with Razorpay checkout
- **Payment History** — View all past transactions
- **Email Receipts** — Payment confirmation emails sent after successful transactions
- **Webhooks** — Razorpay webhook handler for payment status updates and refunds

## Project Structure

```
DevConnect-backend/
├── src/
│   ├── app.js                    # Express app, CORS, webhook, Socket.io server
│   ├── config/
│   │   └── database.js           # MongoDB connection helper
│   ├── middlewares/
│   │   ├── auth.js               # JWT cookie-based authentication
│   │   └── upload.js             # Multer file upload middleware
│   ├── models/
│   │   ├── user.js               # User schema
│   │   ├── payment.js            # Payment schema
│   │   ├── connectionRequest.js  # Connection request schema
│   │   └── message.js            # Message schema
│   ├── routes/
│   │   ├── auth.js               # Signup, login, logout, forgot/reset password
│   │   ├── profile.js            # View/edit profile, upload photo, change password
│   │   ├── request.js            # Send/review connection requests
│   │   ├── user.js               # Feed, connections, requests, user profile
│   │   ├── payment.js            # Payment order, verify, history, plans
│   │   └── chat.js               # Send message, get messages, conversations, mark read
│   └── utils/
│   │   ├── validation.js         # Signup + profile validators
│   │   ├── razorpay.js           # Razorpay SDK instance
│   │   └── email.js              # Nodemailer email service
│   ├── public/
│   │   └── uploads/              # Uploaded profile photos
│   ├── .env                      # Environment variables
│   └── package.json

DevConnect-web/
├── src/
│   ├── App.jsx                   # Router setup
│   ├── main.jsx                  # React entry point
│   ├── components/
│   │   ├── Body.jsx              # Authenticated layout wrapper
│   │   ├── NavBar.jsx            # Navigation bar with premium crown icon
│   │   ├── Footer.jsx            # Footer
│   │   ├── Login.jsx             # Login / Signup form
│   │   ├── ForgotPassword.jsx    # Forgot password form
│   │   ├── ResetPassword.jsx     # Reset password form
│   │   ├── Feed.jsx              # People you may know
│   │   ├── Profile.jsx           # Profile wrapper
│   │   ├── EditProfile.jsx       # Edit profile with photo upload
│   │   ├── Connections.jsx       # Connections list with chat buttons
│   │   ├── Requests.jsx          # Incoming requests
│   │   ├── UserCard.jsx          # Reusable user card with chat button
│   │   ├── Premium.jsx           # Premium plans with Razorpay checkout
│   │   ├── PaymentSuccess.jsx    # Payment success page
│   │   ├── PaymentFailure.jsx    # Payment failure page
│   │   ├── Chat.jsx              # Main chat layout with Socket.io
│   │   ├── ChatList.jsx          # Conversations sidebar with online status
│   │   ├── ChatWindow.jsx        # Message view with real-time updates, typing, read receipts
│   │   └── MessageInput.jsx      # Message input with typing indicator
│   └── utils/
│       ├── constants.js          # BASE_URL from env
│       ├── apiClient.js          # Axios instance with 401 interceptor
│       ├── appStore.js           # Redux store
│       ├── userSlice.js          # User state
│       ├── feedSlice.js          # Feed state
│       ├── connectionSlice.js    # Connections state
│       ├── requestSlice.js       # Requests state
│       ├── paymentService.js     # Payment API calls
│       ├── chatService.js        # Chat API calls
│       └── socket.js             # Socket.io client singleton
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
- Gmail account with App Password (for emails)

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
EMAIL_USER=your_email@gmail.com
EMAIL_APP_PASSWORD=your_gmail_app_password
EMAIL_FROM="DevConnect" <your_email@gmail.com>
FRONTEND_URL=http://localhost:5173
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
| POST | `/auth/forgot-password` | Send password reset email |
| POST | `/auth/reset-password/:token` | Reset password with token |

### Profile
| Method | Endpoint | Description |
|---|---|---|
| GET | `/profile/view` | View own profile |
| PATCH | `/profile/edit` | Edit profile |
| PATCH | `/profile/changePassword` | Change password |
| POST | `/profile/upload-photo` | Upload profile photo (multipart/form-data) |

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
| GET | `/feed` | Get feed suggestions |
| GET | `/user/connections` | Get connections |
| GET | `/user/requests` | Get received requests |
| GET | `/user/profile/:userId` | Get user profile by ID |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| POST | `/chat/send` | Send a message |
| GET | `/chat/messages/:userId` | Get chat history with a user |
| GET | `/chat/conversations` | List all conversations |
| PATCH | `/chat/read` | Mark messages as read |

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
| `EMAIL_USER` | Gmail address for sending emails |
| `EMAIL_APP_PASSWORD` | Gmail app password (not regular password) |
| `EMAIL_FROM` | From name and email for outgoing emails |
| `FRONTEND_URL` | Frontend URL for password reset links |

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
- `resetPasswordToken`, `resetPasswordExpires` — for password reset flow
- Timestamps enabled
- Password hashed with bcrypt

### Message
- `senderId`, `receiverId` — references to User
- `message` — text content
- `readBy` — array of user IDs who have read the message
- `readAt` — timestamp when message was read
- Index on `{ senderId, receiverId, createdAt }` for fast chat history queries
- Timestamps enabled

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

## Real-time Chat Architecture

### Socket.io Flow
```
Frontend (React)                 Backend (Node.js)
     │                               │
     │  1. Connect via WS + JWT      │
     ├──────────────────────────────►│
     │  2. Verify JWT                │
     │  3. Join user room            │
     │  4. Broadcast onlineUsers     │
     │◄──────────────────────────────│
     │                               │
     │  5. Emit sendMessage          │
     ├──────────────────────────────►│
     │  6. Save to MongoDB           │
     │  7. Emit to sender + receiver │
     │◄──────────────────────────────│
     │  8. UI updates instantly      │
```

### Socket Events

| Event | Direction | Purpose |
|---|---|---|
| `sendMessage` | Client → Server | Send a new message |
| `receiveMessage` | Server → Client | Receive a new message instantly |
| `typing` | Client → Server | Notify that user is typing |
| `stopTyping` | Client → Server | Notify that user stopped typing |
| `markAsRead` | Client → Server | Mark messages as read |
| `messagesRead` | Server → Client | Notify sender that messages were read |
| `onlineUsers` | Server → Client | Broadcast list of online user IDs |
| `disconnect` | Server → Client | User went offline |

### Real-time Features

1. **Instant messaging** — Messages appear instantly without page refresh
2. **Typing indicator** — Shows "typing..." when the other user is typing (2s debounce)
3. **Online/offline status** — Green dot on avatars, `onlineUsers` event updates on connect/disconnect
4. **Read receipts** — "Sent" for delivered messages, "Read" when receiver opens the chat
5. **Room-based delivery** — Each user joins their own room, messages targeted via `socket.to(receiverId).emit()`

### Chat Components

- **ChatList** — Conversations sidebar with last message, timestamp, online status indicator
- **ChatWindow** — Message bubbles grouped by date, sender avatars, read receipts, typing status in header
- **MessageInput** — Auto-expanding textarea, Enter to send, typing indicator with debounce

## Payment Flow Architecture

### Step-by-Step
```
1. User clicks "Buy" on Premium page
2. Frontend loads Razorpay Checkout SDK dynamically
3. Frontend calls POST /payment/create with plan details
4. Backend validates plan and amount, creates Razorpay order
5. Backend saves Payment record (status: pending) with razorpayOrderId
6. Frontend opens Razorpay Checkout modal with order details
7. User enters card details and pays
8. Razorpay processes payment and returns signature to frontend
9. Frontend calls POST /payment/verify with signature details
10. Backend verifies HMAC-SHA256 signature
11. Backend updates payment status to "completed"
12. Frontend navigates to success/failure page
13. Razorpay sends webhook to backend (source of truth)
14. Backend verifies webhook signature and updates payment idempotently
15. Backend sends payment receipt email to user
```

### Security
- Server-side plan/amount validation prevents tampering
- HMAC-SHA256 signature verification on both verify endpoint and webhook
- Order ID mismatch check prevents cross-order tampering
- JWT authentication on all protected endpoints
- Conditional webhook updates prevent race conditions
- Socket.io connections authenticated via JWT handshake

## License

ISC
