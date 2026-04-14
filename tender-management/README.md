# 🏛️ Tender Management System

A full-stack web application for managing government tenders and company bids — built with React, Node.js, Express, and MongoDB.

---

## 📌 Project Overview

The Tender Management System (TMS) is a digital e-procurement platform that enables:
- **Government officials** to create and manage tenders, review bids, and select winners.
- **Companies** to register, browse active tenders, and submit competitive bids.

The system automatically handles tender lifecycle — tenders move from **Active → Closed** once their end date passes, and to **Completed** once a winner is selected.

---

## 🧰 Technologies Used

| Layer      | Technology                        |
|------------|-----------------------------------|
| Frontend   | React 18, React Router v6         |
| Backend    | Node.js, Express.js               |
| Database   | MongoDB with Mongoose ODM         |
| Auth       | JWT (JSON Web Tokens) for Company |
| Styling    | Pure CSS (no frameworks)          |
| Fonts      | Crimson Pro + DM Sans (Google)    |

---

## 📁 Folder Structure

```
tender-management/
├── backend/
│   ├── controllers/
│   │   ├── authController.js       # Register, login, govt login
│   │   ├── tenderController.js     # CRUD for tenders
│   │   └── bidController.js        # Submit & fetch bids
│   ├── middleware/
│   │   └── auth.js                 # JWT verification middleware
│   ├── models/
│   │   ├── User.js                 # Company user schema
│   │   ├── Tender.js               # Tender schema
│   │   └── Bid.js                  # Bid schema
│   ├── routes/
│   │   ├── auth.js                 # /api/auth routes
│   │   ├── tenders.js              # /api/tenders routes
│   │   └── bids.js                 # /api/bids routes
│   ├── .env                        # Environment variables
│   ├── .env.example                # Env template
│   ├── package.json
│   └── server.js                   # App entry point
│
└── frontend/
    ├── public/
    │   └── index.html
    └── src/
        ├── components/
        │   ├── NoticeBar.js         # Scrolling ticker of active tenders
        │   ├── GovernmentSidebar.js # Sidebar for govt portal
        │   ├── CompanySidebar.js    # Sidebar for company portal
        │   ├── DashboardContent.js  # 6-card dashboard (shared)
        │   ├── TenderList.js        # Tender table with filters
        │   ├── TenderDetail.js      # Full tender detail view
        │   └── BidList.js           # Bids viewer (shared)
        ├── context/
        │   └── AuthContext.js       # Global auth state (React Context)
        ├── pages/
        │   ├── HomePage.js          # Landing page
        │   ├── GovernmentLoginPage.js
        │   ├── CompanyAuthPage.js   # Login + Register tabs
        │   ├── government/
        │   │   ├── GovDashboard.js
        │   │   ├── CreateTender.js
        │   │   ├── GovViewTender.js
        │   │   ├── GovViewBid.js
        │   │   └── GovSelectBid.js
        │   └── company/
        │       ├── CompanyDashboard.js
        │       ├── CompanyViewTender.js
        │       ├── CompanyViewBid.js
        │       └── CompanySubmitBid.js
        ├── utils/
        │   └── api.js               # All API call functions
        ├── App.js                   # Routes + protected routes
        ├── index.css                # Global styles
        └── index.js                 # React entry point
```

---

## ⚙️ Setup Instructions (Windows + MongoDB Compass)

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or above)
- [MongoDB Compass](https://www.mongodb.com/try/download/compass) (for local MongoDB)

---

### Step 1 — Start MongoDB

1. Open **MongoDB Compass**
2. Click **Connect** with the default URI: `mongodb://localhost:27017`
3. MongoDB is now running locally ✅

---

### Step 2 — Backend Setup

Open a terminal (Command Prompt or PowerShell):

```bash
cd tender-management/backend
npm install
```

The `.env` file is already included with default values:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/tender_management
JWT_SECRET=tms_super_secret_key_2024
```

Start the backend:
```bash
npm start
```

You should see:
```
✅ Connected to MongoDB
✅ Server running on http://localhost:5000
```

---

### Step 3 — Frontend Setup

Open a **new terminal**:

```bash
cd tender-management/frontend
npm install
npm start
```

The app will open at **http://localhost:3000** 🎉

---

## 🔐 Default Admin Login

| Field    | Value             |
|----------|-------------------|
| Email    | admin@gmail.com   |
| Password | admin123          |
| Role     | Government Admin  |

> ⚠️ These credentials are **hardcoded** in the backend (`authController.js`). No database entry is needed.

---

## 🔑 How JWT Authentication Works

JWT (JSON Web Token) is used **only for Company users**.

### Flow:
1. Company registers → password is **hashed** with bcrypt and stored in MongoDB
2. Company logs in → server verifies password and returns a **JWT token**
3. Frontend stores the token in **localStorage**
4. For protected actions (submit bid), the token is sent in the `Authorization: Bearer <token>` header
5. Backend middleware (`auth.js`) verifies the token before allowing access

### Government Login:
- Government credentials are **hardcoded** in `authController.js`
- No JWT is issued — the frontend simply stores the role in localStorage
- All tender creation and winner selection is behind a frontend route guard (`ProtectedRoute`)

---

## ⏱️ How Time-Based Tender Status Works

Tender status transitions automatically:

```
ACTIVE  ──(endDate passed)──▶  CLOSED  ──(winner selected)──▶  COMPLETED
```

### Implementation:
- Every time the backend fetches tenders, it runs `updateTenderStatuses()`
- This query moves any `active` tender where `endDate < now` to `closed`:
  ```js
  await Tender.updateMany(
    { status: 'active', endDate: { $lt: now } },
    { $set: { status: 'closed' } }
  );
  ```
- **Notice Bar** only shows `active` tenders — closed tenders are automatically removed
- **Submit Bid** checks both `status === 'active'` AND `endDate > now` before allowing submission
- When government selects a winner, status becomes `completed`

---

## 🌐 API Endpoints

### Auth
| Method | Route                         | Description           |
|--------|-------------------------------|-----------------------|
| POST   | /api/auth/register            | Register company      |
| POST   | /api/auth/login               | Company login         |
| POST   | /api/auth/government-login    | Government login      |

### Tenders
| Method | Route                          | Description              |
|--------|--------------------------------|--------------------------|
| GET    | /api/tenders                   | Get all tenders (filter) |
| GET    | /api/tenders/notice            | Active tenders for bar   |
| GET    | /api/tenders/stats             | Dashboard stats          |
| GET    | /api/tenders/:id               | Get one tender           |
| POST   | /api/tenders                   | Create tender (govt)     |
| PUT    | /api/tenders/:id/select-winner | Select winner            |

### Bids
| Method | Route                       | Description              |
|--------|-----------------------------|--------------------------|
| POST   | /api/bids                   | Submit bid (JWT required)|
| GET    | /api/bids/tender/:tenderId  | Get bids for a tender    |
| GET    | /api/bids/my-bids           | Company's own bids       |

---

## 📊 Database Collections

### users
```json
{
  "name": "ABC Constructions Pvt Ltd",
  "email": "abc@example.com",
  "password": "<bcrypt hash>",
  "createdAt": "2024-01-01T00:00:00Z"
}
```

### tenders
```json
{
  "title": "Construction of NH-48",
  "amount": 50000000,
  "description": "...",
  "field": "Construction",
  "startDate": "2024-01-01",
  "endDate": "2024-02-01",
  "winningDate": "2024-02-15",
  "status": "active",
  "winnerCompanyId": null,
  "winnerCompanyName": null
}
```

### bids
```json
{
  "tenderId": "<ObjectId>",
  "companyId": "<ObjectId>",
  "companyName": "ABC Constructions Pvt Ltd",
  "bidAmount": 45000000,
  "idea": "Prefabricated bridge segments",
  "description": "We propose...",
  "createdAt": "2024-01-15T00:00:00Z"
}
```

---

## 🎨 Features Summary

| Feature                          | Status |
|----------------------------------|--------|
| Government hardcoded login       | ✅     |
| Company register + JWT login     | ✅     |
| Scrolling notice bar             | ✅     |
| 6-category dashboard with stats  | ✅     |
| Create tender (govt)             | ✅     |
| View active/closed/completed     | ✅     |
| Submit bid (active only)         | ✅     |
| View all bids on a tender        | ✅     |
| Select winner by company ID      | ✅     |
| Auto status update (time-based)  | ✅     |
| Protected routes per role        | ✅     |
| Responsive sidebar layout        | ✅     |

---

## 🐛 Troubleshooting

**"Cannot connect to MongoDB"**
→ Make sure MongoDB Compass is open and connected to `localhost:27017`

**"Connection error. Is the backend running?"**
→ Make sure backend is running on port 5000 (`npm start` in `/backend`)

**Frontend shows blank page**
→ Check browser console for errors; ensure both frontend and backend are running

**JWT token expired**
→ Log out and log in again; tokens expire after 7 days

---

## 📝 Notes for Developers

- The `proxy` field in `frontend/package.json` points to `http://localhost:5000`, so all `/api/...` calls are forwarded automatically during development.
- For production, set `REACT_APP_API_URL` and update `utils/api.js` BASE_URL accordingly.
- Government portal has no JWT — access is controlled purely by frontend route guards and localStorage role storage.
