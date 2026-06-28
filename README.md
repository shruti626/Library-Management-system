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



