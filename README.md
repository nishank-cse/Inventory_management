# InventoryMaster 🚀

A full-stack **Inventory Management System** built using the **MERN Stack** (MongoDB, Express.js, React.js, Node.js).  
Designed for efficient inventory tracking, stock management, reporting, and role-based access control with a modern UI and secure backend architecture.

---

# 🌐 Live Demo

## Frontend
https://inventory-management-git-main-nishank-mukhijas-projects.vercel.app

## Backend API
https://inventory-management-0kvz.onrender.com

---

# ✨ Features

## 🔐 Authentication & Authorization
- JWT-based Authentication
- Secure Password Hashing with Bcrypt
- Role-Based Access Control (Admin / Staff)
- Protected Routes & Middleware

---

## 📦 Inventory Management
- Add / Update / Delete Products
- Real-time Stock Tracking
- Low Stock Alerts
- Product Categorization
- Stock In / Stock Out Management

---

## 📊 Reports & Analytics
- Dashboard Statistics
- Inventory Reports
- Stock Movement History
- PDF Export
- Excel Export

---

## 🎨 Frontend Highlights
- Responsive Modern UI
- Built with React + Vite
- Tailwind CSS Styling
- Framer Motion Animations
- Recharts Data Visualization
- React Hook Form + Yup Validation

---

# 🛠️ Tech Stack

## Frontend
- React 19
- Vite
- Tailwind CSS
- Axios
- React Router DOM
- React Hook Form
- Yup
- Framer Motion
- Recharts
- Lucide React

---

## Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT Authentication
- Bcrypt
- Helmet
- Express Rate Limit
- PDFKit
- XLSX

---

# 📂 Project Structure

```bash
InventoryMaster
│
├── frontend
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── services
│   │   ├── context
│   │   ├── hooks
│   │   └── utils
│   │
│   ├── public
│   └── package.json
│
├── backend
│   ├── controllers
│   ├── routes
│   ├── middlewares
│   ├── models
│   ├── utils
│   └── package.json
│
└── README.md
🔑 Environment Variables
  Backend .env
  PORT=5000
  MONGO_URI=your_mongodb_connection_string
  JWT_SECRET=your_super_secret_key
  NODE_ENV=development
Frontend .env
  VITE_API_URL=https://inventory-management-0kvz.onrender.com
🚀 Installation & Setup
  1️⃣ Clone Repository
  git clone https://github.com/nishank-cse/Inventory_management.git
  cd Inventory_management
  ⚙️ Backend Setup
  cd backend
  npm install
  npm run dev
  
  Backend runs on:
  
  http://localhost:5000
  🎨 Frontend Setup
  cd frontend
  npm install
  npm run dev
  
  Frontend runs on:
  
  http://localhost:5173