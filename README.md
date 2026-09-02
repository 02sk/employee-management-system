# 🏢 Employee Management System

A modern, full-stack **Employee Management System** built with the MERN stack.  
The application provides role-based access for **Admin, HR, and Employees** to manage employees, attendance, leaves, profiles, and account settings through a clean and responsive interface.

---

## ✨ Features

### 🔐 Authentication & Authorization

- Secure JWT-based authentication
- Role-based access control
- Separate dashboards for Admin/HR and Employees
- Protected routes
- Employee-specific profile access
- Unauthorized users are redirected automatically

### 👑 Admin & HR

- 📊 Dashboard overview
- 👥 Employee management
- ➕ Add employees
- ✏️ Edit employee information
- 🗑️ Delete employees
- 🔑 Create employee accounts
- 🕒 View and manage attendance
- 📅 Review employee leaves
- ✅ Approve leave requests
- ❌ Reject leave requests
- ⚙️ Configure attendance settings

### 👨‍💻 Employee

- 📊 Personal dashboard
- 🕒 View personal attendance
- 📅 Apply for leave
- 👤 View personal profile
- ⚙️ Manage account settings
- 🌙 Dark/Light mode
- 🔒 Access restricted to personal data

### 🕒 Attendance

- Employee check-in
- Employee check-out
- Attendance status tracking
- Date-based attendance viewing
- Admin/HR attendance overview
- Employee-specific attendance protection

### 📅 Leave Management

- Apply for leave
- Leave types:
  - Casual
  - Sick
  - Annual
  - Unpaid
  - Other
- Leave duration calculation
- Leave status:
  - Pending
  - Approved
  - Rejected
- Admin/HR approval and rejection

### 🎨 UI/UX

- Modern dashboard interface
- Responsive design
- Mobile-friendly navigation
- Dark mode
- Clean cards and tables
- Role-specific navigation
- Loading and error states

---

## 🛠️ Tech Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcryptjs
- CORS
- dotenv

### Deployment

- Vercel — Frontend
- Render — Backend
- MongoDB Atlas — Database

---

## 🏗️ Project Structure

```text
employee-management-system/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── config/
│   │   └── db.js
│   │
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
