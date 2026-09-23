# CampusConnect - Production-Grade Campus Event Management Platform

CampusConnect is a full-stack, enterprise-ready MERN platform engineered for discovering, hosting, and managing campus events. Built with modern UI/UX principles, dark mode, role-based authorization (Student, Organizer, Admin), and secure JWT authentication.

**Live Platform URL:** [https://campus-connect-seven-pi.vercel.app](https://campus-connect-seven-pi.vercel.app)

---

## 🚀 Key Features

### 🎨 UI/UX & Design System
- **Theme System**: Full Light & Dark mode support with auto system preference detection and state persistence.
- **Reusable Component Library**: Modular UI primitives (`Button`, `Card`, `Modal`, `Input`, `Badge`, `Skeleton`, `EmptyState`, `Toast`).
- **Feedback Notifications**: Custom Toast provider replacing primitive browser alerts.

### 🌐 Public Landing Page & Event Discovery
- **Hero & Value Proposition**: High-converting landing page showcasing platform metrics, features, and steps.
- **Explore Catalog**: Search events by title/description/location, filter by categories (*Hackathons, Workshops, Cultural & Arts, Sports & Gaming, Club Meetups, Seminars*), and sort by upcoming date or seat capacity.
- **Seat Capacity Tracking**: Real-time progress bars indicating registration capacity (e.g. "18 / 40 seats filled").

### 🔐 Authentication & Role-Based Access Control
- **JWT Security**: Token-based authentication with password hashing via `bcryptjs`.
- **Role Portals**:
  - 🎓 **Student Portal**: Register for events, track registrations, and cancel participation.
  - 🎪 **Organizer Portal**: Publish new campus events with rich details, manage seat limits, edit/delete owned events, and view real-time attendee rosters.
  - 🛡️ **Admin Portal**: Platform dashboard metrics (Total Users, Students, Organizers, Events, Registrations), user management (role elevation/demotion, deletion), and content moderation.
  - 👤 **Profile & Settings**: Profile customization (Name, Department, Bio, Avatar) and optional password security update.

---

## 🛠️ Technology Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide React, React Router DOM v7, Axios.
- **Backend**: Node.js, Express 5, Mongoose 9, JSON Web Tokens (JWT), BcryptJS, CORS, Dotenv.
- **Database**: MongoDB (Mongoose ODM with schema validation & indexing).

---

## 📁 Project Architecture

```
campus-connect/
├── backend/
│   ├── config/
│   │   └── db.js                 # Database connection with graceful error diagnostics
│   ├── middleware/
│   │   ├── auth.js               # JWT verification & role guards
│   │   └── errorHandler.js       # Centralized API error handler
│   ├── models/
│   │   ├── User.js               # User schema (student, organizer, admin)
│   │   ├── Event.js              # Event schema (categories, capacity, location)
│   │   └── Registration.js       # Unique student-event registration schema
│   ├── controllers/
│   │   ├── authController.js     # Auth & profile management
│   │   ├── eventController.js    # Event CRUD & filtering logic
│   │   ├── registrationController.js # Event registration & cancellation
│   │   └── adminController.js    # Admin analytics & user management
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── eventRoutes.js
│   │   ├── registrationRoutes.js
│   │   └── adminRoutes.js
│   ├── server.js                 # App entry point & health check (/api/health)
│   ├── seed.js                   # Demo data seeder script
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── context/              # Auth, Theme, Toast providers
│   │   ├── components/ui/        # Reusable UI component system
│   │   ├── components/layout/    # Navbar & Footer
│   │   ├── components/events/    # EventCard, EventFilter, AttendeesModal, CreateEventModal
│   │   ├── pages/                # LandingPage, ExploreEvents, Login, Register, Dashboards, Profile
│   │   └── utils/api.js          # Intercepted Axios instance
│   └── .env.example
└── README.md
```

---

## ⚡ Quick Start & Setup Instructions

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Seed demo accounts & events:
   ```bash
   npm run seed
   ```
5. Start the backend server:
   ```bash
   npm start
   ```
   *The server will run at `http://localhost:5000`.*

### 2. Frontend Setup

1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy environment configuration:
   ```bash
   cp .env.example .env
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```
   *Open the printed localhost URL (e.g. `http://localhost:5173`) in your browser.*

---

## 🌐 Deploying to Render (Backend) & Vercel (Frontend)

### Render (Backend Deployment)

1. Create a **Web Service** on [Render](https://render.com) pointing to the `backend` directory.
2. Build Command: `npm install`
3. Start Command: `npm start`
4. Set the following **Environment Variables** in Render Dashboard:
   - `MONGO_URI`: Your MongoDB Atlas URI (e.g. `mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/campusconnect?retryWrites=true&w=majority`)
   - `JWT_SECRET`: A strong secret key (e.g. `campusconnect_super_secret_jwt_key_2026`)
   - `NODE_ENV`: `production`

> [!IMPORTANT]
> **Fixing `bad auth : authentication failed` on MongoDB Atlas / Render:**
> 1. In **MongoDB Atlas**, go to **Database Access** and verify your database user's username and password.
> 2. If your password contains special characters (such as `@`, `:`, `/`, `?`, `#`), **URL encode** them in your `MONGO_URI`:
>    - `@` $\rightarrow$ `%40`
>    - `:` $\rightarrow$ `%3A`
>    - `/` $\rightarrow$ `%2F`
>    - `#` $\rightarrow$ `%23`
> 3. Go to **Network Access** in MongoDB Atlas and ensure `0.0.0.0/0` (Allow access from anywhere) is added.

---

## 🔑 Demo Login Accounts

| Role | Email | Password |
|---|---|---|
| **Student** | `student@demo.com` | `password123` |
| **Organizer** | `organizer@demo.com` | `password123` |
| **Admin** | `admin@demo.com` | `admin123` |

*(Note: The login page includes 1-click Quick Demo Fill buttons for instant testing).*
