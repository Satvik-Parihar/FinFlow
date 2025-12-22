# 💼 FINFLOW - Expense Management System

An advanced **MERN Stack application** that simplifies and automates the expense reimbursement process for companies.  
It provides **role-based expense submission**, **approval workflows**, **conditional approval rules**, and **built-in currency & OCR support**.

---

## 🚀 Features

### 🔐 Authentication & User Management
- Secure **Signup/Login** with JWT-based authentication.  
- On first signup, a **Company and Admin** are auto-created (based on selected country & currency).  
- **Admin Capabilities**:
  - Create Employees and Managers.  
  - Assign and change roles (Employee, Manager).  
  - Define reporting relationships between employees and managers.  

---

### 🧾 Expense Submission (Employee Role)
- Submit expenses with:
  - Amount, Category, Description, Date  
  - Upload receipt image (OCR supported)  
- **Multi-currency support** (automatic conversion to company’s base currency).  
- View complete **expense history** (Approved, Pending, Rejected).  

---

### ✅ Approval Workflow (Manager/Admin Role)
- **Multi-level approval flow** configurable by Admin.  
- Example:
Step 1 → Manager → Step 2 → Finance → Step 3 → Director

- Each approver can:
- Approve/Reject with comments  
- Forward to next level only if approved  

---

### ⚙ Conditional Approval Rules
Supports **flexible approval policies**:
- **Percentage Rule** → Approve if X% of approvers approve  
- **Specific Approver Rule** → e.g., CFO approval = auto-approved  
- **Hybrid Rule** → Combine both (e.g., 60% OR CFO approves)  
- Can be used alongside **multi-level workflows**  

---

### 👤 Role Permissions
| Role      | Permissions |
|-----------|-------------|
| **Admin** | Create company, manage users & roles, configure approval rules, view all expenses, override approvals |
| **Manager** | Approve/reject expenses, view team expenses, escalate |
| **Employee** | Submit expenses, view personal expense history & approval status |

---

### 🧠 Additional Features
- **OCR for Receipts** (via Tesseract.js / Google Vision API): Extracts amount, date, description, merchant.  
- **Real-time Currency Conversion**:
- Countries & currencies: [REST Countries API](https://restcountries.com/v3.1/all?fields=name,currencies)  
- Exchange rates: [ExchangeRate API](https://api.exchangerate-api.com/v4/latest/USD)  

---

## 🧩 Tech Stack
- **Frontend:** React.js  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB (Mongoose ODM)  
- **OCR Engine:** Tesseract.js / Google Vision API (optional)  
- **APIs Used:** REST Countries API, ExchangeRate API  

---

## 🧪 Installation & Setup

```bash
# Clone the repository
git clone https://github.com/your-username/finflow.git

# Navigate into project
cd finflow/finflow-project

# Install dependencies
cd backend && npm install
cd ../frontend && npm install

# Create a .env file inside backend/
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EXCHANGE_API_URL=https://api.exchangerate-api.com/v4/latest
COUNTRIES_API_URL=https://restcountries.com/v3.1/all?fields=name,currencies

# Run backend
cd backend
npm run dev

# Run frontend (in another terminal)
cd frontend
npm start

finflow-project/
│
├── backend/        # Express.js + MongoDB backend
│   ├── models/     # Database schemas
│   ├── routes/     # API endpoints
│   ├── controllers/# Business logic
│   ├── utils/      # Helper functions
│   └── server.js   # Entry point
│
├── frontend/       # React.js frontend
│   ├── src/        # Components, pages, hooks
│   └── package.json
│
└── README.md
