# 🛒 Full-Stack Amazon Clone (MERN Stack)

Welcome to the **Amazon Clone** repository! This is a fully functional, highly responsive, and robust e-commerce web application built entirely from scratch using the **MERN** stack (MongoDB, Express, React, Node.js). 

This project aims to replicate the core functionalities of Amazon, providing a seamless user experience from product browsing to checkout, complete with secure authentication and persistent cart management.

---

## 📑 Table of Contents
1. [Key Features](#-key-features)
2. [Technology Stack](#-technology-stack)
3. [Project Architecture & File Structure](#-project-architecture--file-structure)
4. [Implementation Details (Topic by Topic)](#-implementation-details-topic-by-topic)
   - [Authentication & Security](#1-authentication--security)
   - [Global State Management](#2-global-state-management)
   - [Database Schema & Models](#3-database-schema--models)
   - [API Integration & Routing](#4-api-integration--routing)
   - [Design System & UI](#5-design-system--ui)
5. [Getting Started (Local Development)](#-getting-started-local-development)
6. [Deployment Guide](#-deployment-guide)

---

## 🌟 Key Features

- **JWT Authentication System:** Secure user registration, login, and session persistence.
- **Dynamic Product Catalog:** Products are fetched directly from a MongoDB database and rendered seamlessly.
- **Intelligent Search Algorithm:** Multi-word search functionality that filters products by title, description, or category dynamically.
- **Persistent Shopping Cart:** Add, remove, and update quantities. The cart syncs securely with the backend database so users never lose their items.
- **Multi-Step Checkout Flow:** Captures shipping addresses, calculates dynamic tax and savings, processes mock payments, and generates order success states.
- **Amazon-Aesthetic UI/UX:** A bespoke design system utilizing modern CSS features to perfectly mimic the look, feel, and responsiveness of Amazon.

---

## 🛠️ Technology Stack

**Frontend (Client):**
- **React.js 19:** UI Library for building component-driven interfaces.
- **Vite:** Next-generation frontend tooling for blazing fast builds.
- **React Router v7:** Client-side routing for navigating between pages.
- **Axios:** For handling HTTP requests and interceptors.
- **Vanilla CSS:** Custom styling without relying on bulky CSS frameworks, ensuring maximum performance and control.

**Backend (Server):**
- **Node.js & Express.js:** Robust runtime and framework for building RESTful APIs.
- **MongoDB & Mongoose:** NoSQL database and Object Data Modeling (ODM) library.
- **JSON Web Tokens (JWT):** For stateless, secure user authentication.
- **Bcrypt.js:** For secure password hashing.
- **CORS & Dotenv:** For handling cross-origin requests and environment configurations.

---

## 📂 Project Architecture & File Structure

The project follows a modular, decoupled architecture, divided strictly into two main directories: `frontend` and `backend`.

```text
amazon_clone/
├── backend/                  # Express/Node.js Server
│   ├── config/               
│   │   └── db.js             # MongoDB connection logic
│   ├── controllers/          
│   │   ├── authController.js # Login/Signup logic
│   │   ├── cartController.js # Cart sync logic
│   │   └── productController.js # Product fetching
│   ├── middleware/           
│   │   └── authMiddleware.js # JWT verification
│   ├── models/               
│   │   ├── Product.js        # Product Schema
│   │   └── User.js           # User Schema (includes cart array)
│   ├── routes/               
│   │   ├── authRoutes.js     # /api/auth endpoints
│   │   ├── cartRoutes.js     # /api/cart endpoints
│   │   └── productRoutes.js  # /api/products endpoints
│   ├── server.js             # Backend entry point
│   └── package.json          
│
├── frontend/                 # React/Vite Client
│   ├── src/
│   │   ├── api/
│   │   │   └── axios.js      # Global Axios instance with interceptors
│   │   ├── components/       # Reusable UI elements
│   │   │   ├── CartItem.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProductCard.jsx
│   │   │   └── Spinner.jsx
│   │   ├── context/          # React Context API global states
│   │   │   ├── AuthContext.jsx
│   │   │   └── CartContext.jsx
│   │   ├── hooks/            
│   │   │   └── useProducts.js # Custom hook for data fetching
│   │   ├── pages/            # Page-level components
│   │   │   ├── CartPage.jsx
│   │   │   ├── CheckoutPage.jsx
│   │   │   ├── HomePage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── ProductDetailPage.jsx
│   │   │   └── SignupPage.jsx
│   │   ├── App.jsx           # Main routing configuration
│   │   ├── main.jsx          # React entry point
│   │   └── index.css         # Global design system & variables
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── .gitignore                # Global git ignores (node_modules, .env)
```

---

## 🧠 Implementation Details (Topic by Topic)

### 1. Authentication & Security
- **Backend Hashing:** When a user registers, the password is hashed using `bcryptjs` before being saved to MongoDB. The backend never stores plain-text passwords.
- **JWT Issuance:** Upon successful login, the server generates a JWT containing the user's ID, signed with a hidden `JWT_SECRET`.
- **Frontend Interceptors:** The frontend stores this token in `localStorage`. The `axios.js` setup utilizes **Axios Interceptors** to automatically attach the `Authorization: Bearer <token>` header to every single outgoing request, ensuring smooth, authenticated data syncing.
- **Route Protection:** React Router and `AuthContext` are used to redirect unauthenticated users away from the Checkout page back to the Login page.

### 2. Global State Management
Instead of passing props deeply through the component tree (Prop Drilling), the app utilizes the **React Context API**:
- **`AuthContext`:** Manages the user's logged-in state. It provides global methods like `login()`, `signup()`, and `logout()`, which communicate directly with the backend and update the UI everywhere instantly.
- **`CartContext`:** Manages the shopping cart. It uses optimistic UI updates (updating the screen instantly so it feels fast) while sending Axios `POST`/`PUT`/`DELETE` requests to the backend quietly in the background to ensure data isn't lost if the user refreshes.

### 3. Database Schema & Models
The data layer relies on Mongoose schemas to strictly define data shape:
- **Product Model:** Contains `title`, `description`, `price`, `category`, `image`, and `stock` fields.
- **User Model:** Contains `name`, `email`, `password` (hashed), and importantly, a nested `cart` array that stores `productId` references and `quantity`. This allows the user's cart to persist across multiple devices.

### 4. API Integration & Routing
- **RESTful Endpoints:** The backend provides clean, isolated routes (e.g., `GET /api/products`, `POST /api/cart`).
- **Custom Hooks:** The frontend abstracts complex data fetching logic into custom hooks like `useProducts`, which handles loading states, error catching, and data formatting automatically.

### 5. Design System & UI
- **CSS Variables:** `index.css` acts as the source of truth, establishing global CSS variables for Amazon's distinct color palette (`--amazon-dark`, `--amazon-yellow`), typography, and box-shadows.
- **Responsive Flexbox/Grid:** Pages like the Product Grid and Cart use CSS Grid and Flexbox to automatically reorganize from desktop layouts to mobile-friendly vertical stacks.
- **Micro-interactions:** Buttons feature subtle hover states, active compressions, and loading spinners to provide users with immediate, satisfying feedback.

---

## 🚀 Getting Started (Local Development)

Follow these steps to run the application on your local machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- A MongoDB Cluster (via [MongoDB Atlas](https://www.mongodb.com/atlas/database) or local installation)

### 1. Clone the Repository
```bash
git clone <your-github-repo-url>
cd amazon_clone
```

### 2. Backend Setup
Open your terminal and navigate to the backend folder:
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add your sensitive credentials:
```env
PORT=5000
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=any_super_secret_string_you_want
```
Start the backend server:
```bash
npm run dev
# Expected output: "MongoDB Connected ✅" and "Server running on port 5000"
```

### 3. Frontend Setup
Open a *new* terminal window and navigate to the frontend folder:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` folder to tell React where the API is:
```env
VITE_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
# The application will launch at http://localhost:5173
```

---

## 🌍 Deployment Guide

To put your clone on the live internet, we highly recommend **Render** (for the backend) and **Vercel or Render** (for the frontend). 

### Step 1: Whitelist MongoDB Atlas IP (CRITICAL)
Cloud providers use dynamic IP addresses. If you don't whitelist them, MongoDB will reject your deployed backend's connection attempts.
1. Log into MongoDB Atlas.
2. Go to **Security > Network Access**.
3. Click **Add IP Address** and select **Allow Access From Anywhere** (`0.0.0.0/0`).
4. Click **Confirm**.

### Step 2: Deploy the Backend
1. Connect your GitHub repository to [Render](https://render.com/).
2. Create a new **Web Service**, select your repository, and set the Root Directory to `backend`.
3. Set the Build Command to `npm install` and the Start Command to `node server.js`.
4. Go to **Environment Variables** and add the variables from your local `backend/.env` file (`MONGO_URI` and `JWT_SECRET`).
5. Deploy. Once live, copy your backend URL (e.g., `https://my-amazon-backend.onrender.com`).

### Step 3: Deploy the Frontend
1. On your preferred platform (e.g., Render Static Site or Vercel), select your repository and set the Root Directory to `frontend`.
2. Set the Build Command to `npm run build` and the Publish Directory to `dist`.
3. Go to **Environment Variables** and add:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://my-amazon-backend.onrender.com/api` *(Paste the backend URL you got from Step 2, and ensure it ends with `/api`)*.
4. Deploy the frontend.

> **Note:** If you update `VITE_API_URL` *after* deploying, you must trigger a manual redeploy/clear build cache, because Vite bakes environment variables into the static HTML at build-time.

---

## 📜 License
This project is an independent clone created for educational and portfolio purposes. It is not affiliated with, maintained, authorized, endorsed, or sponsored by Amazon.com, Inc.
