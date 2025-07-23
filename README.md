# 🚀 OTP Auth Notes App

A full-stack MERN application built for the **Highway Delite**, featuring:

✅ **Email + OTP Signup/Login**  
📝 **Personal Note Management** 
🔒 **Secure Logout Functionality**

---

## 🌐 Live Preview

🔗 **App URL:** [https://highway-delite-assessment-xtnf.vercel.app/login](https://highway-delite-assessment-xtnf.vercel.app/login)  
📁 **Source Code:** [GitHub Repository](https://github.com/Arshlankhann/Highway-Delite-assessment)

---

## ✨ Features

### 🔐 Authentication
- Signup using Email with OTP verification.
- Passwordless login via Email OTP.
- JWT-based session handling.
- Logout functionality to end session.

### 🗒️ Notes App
- Accessible only after successful login.
- Users can:
  - ➕ Add personal notes.
  - 🗑️ Delete existing notes.
- Notes are private and stored securely in MongoDB.

---

## 🛠️ Tech Stack

| Frontend     | Backend        | Database  | Utilities        |
|--------------|----------------|-----------|------------------|
| React.js     | Node.js        | MongoDB   | Nodemailer       |
| Axios        | Express.js     | Mongoose  | JWT (jsonwebtoken) |
| Tailwind CSS | CORS           |           | dotenv           |

---

## ⚙️ Getting Started

### 🧾 Prerequisites

- Node.js & npm
- MongoDB (local or Atlas)
- Git

---

### 📥 Installation

#### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Arshlankhann/Highway-Delite-assessment.git
cd Highway-Delite-assessment
```

#### 2️⃣ Backend Setup

```bash
cd backend
npm install

PORT=5000
MONGO_URL=your_mongodb_connection_string
JWT_SECRET=your_secret_key
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password_or_app_password

npm start

```

#### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
npm start
```

### 🗂️ Folder Structure
```bash
Highway-Delite-assessment/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── helper/
│   ├── .env
│   └── server.js
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
└── README.md

```
🧑‍💻 Author
Arshlan Khan
📧 arshlankhann@gmail.com
🌐 GitHub – @Arshlankhann

📃 License
This project is licensed under the MIT License.
