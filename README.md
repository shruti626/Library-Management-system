# AetherLibrary - Premium MERN Library Management System

AetherLibrary is a premium, modern, high-fidelity Library Management System built using the MERN stack (MongoDB, Express, React, Node.js). It features a dark-themed, glassmorphic UI styled with custom Vanilla CSS, and includes role-based authorization (Admin / Member), borrow tracking, due date countdown logs, dynamic analytics, and micro-animations.

---

## Features

- 👤 **Role-Based Access Control**: Separate workflows and dashboard stations for **Librarian (Admin)** and **Library Member (User)**.
- 🔑 **Secure Authentication**: Password hashing using `bcryptjs` and request gating with `jsonwebtoken` (JWT).
- 📚 **Dynamic Book Inventory**: Full CRUD operations for librarians; searchable, category-filtered catalog view for members.
- 🔄 **Borrowing & Return System**: Smart transaction flows that decrement and increment available stock dynamically.
- 📅 **Due Date Tracking**: Color-coded countdown badges highlighting active borrow statuses (Overdue, Due Today, Safe).
- 📊 **Intelligent Dashboard**: High-level statistics summary grids and category breakdown progress visualizer.
- 🎨 **WOW Aesthetics**: Blur glassmorphism effects, neon borders, smooth scale transitions, custom loading indicators, and confetti reward animations.

---

## Tech Stack

- **Frontend**: React.js (Vite), Axios, Lucide Icons, Canvas-Confetti, custom CSS
- **Backend**: Node.js, Express.js, JWT, BcryptJS
- **Database**: MongoDB (via Mongoose ODM)

---

## Project Structure

```
library-management-system/
├── backend/                  # Node.js API server
│   ├── src/
│   │   ├── config/db.js      # Mongoose MongoDB connection
│   │   ├── middleware/       # Auth checks (protect, authorize)
│   │   ├── models/           # User, Book, IssuedBook models
│   │   ├── routes/           # REST endpoints (auth, books, issues)
│   │   ├── index.js          # App entrypoint
│   │   └── seed.js           # Seeder script
│   └── package.json
├── frontend/                 # React client
│   ├── src/
│   │   ├── components/       # Navbar, BookCard, BookModal, StatCard
│   │   ├── context/          # AuthState & Axios interceptor
│   │   ├── pages/            # LoginRegister, Dashboard, BooksList, IssuedBooks, Profile
│   │   ├── App.jsx           # App routing & guards
│   │   └── index.css         # Glassmorphism design system
│   ├── index.html            # Web SEO configuration
│   └── package.json
├── package.json              # Monorepo runner
└── README.md
```

---

## Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) (Ensure your local MongoDB service is running on `mongodb://127.0.0.1:27017`)

### 1. Install Dependencies
Run the install script from the root directory to configure the root, backend, and frontend packages:
```bash
npm run install-all
```

### 2. Configure Environment Variables
A default `.env` is already configured in the `backend/` folder:
- **Port**: `5000`
- **Database URI**: `mongodb://127.0.0.1:27017/library_db`
- **JWT Secret**: `supersecretkeyforlibrarysystem`

If you are using MongoDB Atlas, update the `MONGODB_URI` inside `backend/.env` with your cluster connection string.

### 3. Seed initial Database Records
Execute the seeder script to populate default librarian/member profiles and book catalogs:
```bash
npm run seed
```

### 4. Start Development Dev Servers
Launch both the Express API server and React client concurrently:
```bash
npm run dev
```

The React client will run on **http://localhost:5173** and the API backend will run on **http://localhost:5000**.

---

## Default Credentials (Seeded Data)

### 1. Librarian (Admin Access)
- **Email**: `admin@aether.com`
- **Password**: `password123`

### 2. Library Member (User Access)
- **Email**: `member@aether.com`
- **Password**: `password123`
