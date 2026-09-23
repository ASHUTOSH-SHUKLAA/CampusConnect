# CampusConnect - Production-Grade Campus Event Management Platform

CampusConnect is a full-stack, enterprise-ready MERN platform engineered for discovering, hosting, and managing campus events. Built with modern UI/UX principles, dark mode, role-based authorization (Student, Organizer, Admin), and secure JWT authentication.

**Live Demo URL:** [https://campus-connect-seven-pi.vercel.app](https://campus-connect-seven-pi.vercel.app)

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
│   │   └── db.js                 # Database connection
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
│   ├── server.js                 # App entry point
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

## 🔑 Demo Login Accounts

| Role | Email | Password |
|---|---|---|
| **Student** | `student@demo.com` | `password123` |
| **Organizer** | `organizer@demo.com` | `password123` |
| **Admin** | `admin@demo.com` | `admin123` |

*(Note: The login page includes 1-click Quick Demo Fill buttons for instant testing).*

---

## 🔒 Security Best Practices Implemented

1. **Password Hashing**: Passwords stored using `bcryptjs` with salt rounds.
2. **Server-Side Authorization**: API routes check user roles and resource ownership on `PUT`/`DELETE` endpoints.
3. **No Secrets in Code**: Environment variables used for database connection and JWT secret keys.
4. **Error Sanitization**: Server stack traces are stripped in production mode.
