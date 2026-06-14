# TruYum Restaurant System 🍕

![Angular](https://img.shields.io/badge/Angular-21-red.svg) ![Node.js](https://img.shields.io/badge/Node.js-Express-green.svg) ![MongoDB](https://img.shields.io/badge/MongoDB-Database-blue.svg)

A full-stack, modern restaurant management and food ordering system built using the **MEAN Stack** (MongoDB, Express.js, Angular, Node.js). This platform provides a seamless food ordering experience for customers and a powerful management dashboard for administrators.

---

## 🚀 Key Features

### 🛒 For Customers
- **Modern UI/UX**: A responsive, beautifully designed interface with dynamic animations, tooltips, and a sleek dark theme aesthetic.
- **Smart Menu Browsing**: Categorized food items with SEO-friendly URL slugs (e.g., `/food/margherita-pizza`).
- **Real-Time Cart**: State management using modern Angular Signals for instant updates without page reloads.
- **Secure Checkout**: Delivery address management and simulated Cash On Delivery (COD) order placement.
- **Order Tracking**: View past orders and track current order statuses directly from the profile.
- **OTP Authentication**: Secure phone number-based login system.

### 👑 For Administrators
- **Dashboard Analytics**: A comprehensive view of total revenue, total orders, and daily performance metrics.
- **Menu Management**: Easily add, edit, or remove food items.
- **Image Uploading**: Seamless local media management for food images using Multer.
- **Order Processing**: Update order statuses from `PLACED` ➔ `PREPARING` ➔ `OUT_FOR_DELIVERY` ➔ `DELIVERED`.

---

## 🛠️ Technology Stack

### Frontend (Client-Side)
- **Framework**: Angular 21 (Standalone Components)
- **Styling**: Bootstrap 5, Vanilla CSS, CSS Variables
- **State Management**: Angular Signals
- **Routing**: Angular Router with `withInMemoryScrolling` (Smooth Scroll & Position Restoration)

### Backend (Server-Side)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Security**: JSON Web Tokens (JWT), Bcrypt for hashing
- **File Uploads**: Multer (Local Storage)

---

## ⚙️ Installation & Setup Guide

Follow these steps to run the project on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher)
- [MongoDB](https://www.mongodb.com/) (Running locally or a MongoDB Atlas URI)
- [Angular CLI](https://angular.io/cli) installed globally (`npm install -g @angular/cli`)

### 1. Clone the Repository
```bash
git clone https://github.com/Swayamgupta07/YummyFood-Resturant-System.git
cd YummyFood-Resturant-System
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory and add your environment variables:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/truyum
JWT_SECRET=your_super_secret_key_here
JWT_EXPIRES_IN=30d
```
Run the development server:
```bash
npm run dev
```
*The backend server will start running on http://localhost:5000*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```
Start the Angular development server:
```bash
ng serve
```
*The application will automatically open in your browser at http://localhost:4200*

---

## 🌐 API Endpoints Reference

### Authentication
- `POST /api/auth/login` - User Login / OTP Generation

### Foods
- `GET /api/foods` - Fetch all food items
- `GET /api/foods/:idOrSlug` - Fetch a specific food item by ID or Slug
- `POST /api/foods` - Add a new food item (Admin)

### Orders
- `POST /api/orders` - Place a new order
- `GET /api/orders/my-orders` - Fetch the logged-in user's order history
- `GET /api/orders` - Fetch all orders (Admin)
- `PUT /api/orders/:id/status` - Update the status of an order (Admin)

---

## 👨‍💻 Architecture Highlights

- **Global Error Handling**: Built with an Angular `HttpInterceptor` to globally catch backend errors and display them using a custom Toast notification system.
- **Authentication Flow**: Incoming HTTP requests are intercepted by an Auth Interceptor which automatically attaches the JWT token to the `Authorization` header for secure endpoints.
- **Modular Design**: The backend follows a strict Controller-Route-Model architecture for clean code separation.

---
*Developed as a capstone project for Wipro Training.*
