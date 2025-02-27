# **ChatNest - Real-time Chat Application** 🚀

A real-time chat application built with **NestJS, GraphQL, TypeORM, PostgreSQL, WebSockets (Socket.io), and React (Next.js)**. This project allows users to **authenticate, join chat rooms, send messages, and track unread messages in real-time**.

📌 **Live Demo:**
- **Server (GraphQL & WebSockets)**: [https://chatnest-wj2w.onrender.com](https://chatnest-wj2w.onrender.com)
- **Web App (Next.js UI)**: [https://chatnest-webapp.vercel.app](https://chatnest-webapp.vercel.app)

---

## **🚀 Features**
### ✅ **Backend (NestJS)**
- Authentication with **JWT** (Login & Token-based WebSocket authentication)
- **GraphQL API** for fetching chat rooms, messages, and users
- **WebSockets** for real-time chat functionality
- **TypeORM & PostgreSQL** for database management
- **Unread message tracking** per user
- **Message read receipts** (per-user tracking)
- **Automatic reconnection handling** for WebSockets

### ✅ **Frontend (Next.js)**
- **Authentication (JWT-based login)**
- **Chat room selection with unread message count**
- **Real-time messaging via WebSockets**
- **Read receipts & message tracking**
- **Responsive UI similar to modern chat applications**
- **Optimized state management with RxJS & Apollo Client**

---

## **🛠️ Tech Stack**
### **Backend (NestJS)**
- **NestJS** (Framework)
- **GraphQL** (API)
- **TypeORM** (ORM)
- **PostgreSQL** (Database)
- **WebSockets (Socket.io)** (Real-time messaging)
- **JWT Authentication** (Token-based security)

### **Frontend (Next.js)**
- **React (Next.js 14)** (Client-side UI)
- **Apollo Client** (GraphQL state management)
- **Socket.io-client** (WebSocket communication)
- **RxJS** (Reactive state management)
- **Tailwind CSS** (Styling)

---

## **🔧 Installation & Setup**
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/ore-codes/chatnest.git
cd chatnest
```

### **2️⃣ Set Up the Backend (NestJS)**
#### **Environment Variables**
Create a **`.env`** file inside the `server` directory:
```sh
PORT=2457
JWT_SECRET=your-secret-key
DB_HOST=localhost
DB_PORT=5432
DB_USER=your-db-user
DB_PASS=your-db-password
DB_NAME=chatnest
```

---

### **3️⃣ Set Up the Frontend (Next.js)**
#### **Environment Variables**
Create a **`.env.local`** file inside the `webapp` directory:
```sh
NEXT_PUBLIC_SERVER_URL=http://localhost:2457
```

#### **Run the app**
```sh
npm install
npm run dev
```
The server and webapp will run in dev mode simultaneously.
The app will run at **`http://localhost:2456`**.

---

## **🎯 How to Use**
1. **Sign in** with a valid username and password.
2. **Join a chat room** (or create a new one).
3. **Send messages in real-time** (WebSockets).
4. **Unread messages are tracked** per user.
5. **Messages are marked as read** when a user views the chat.
6. **Automatic WebSocket reconnection** ensures seamless chat experience.

---

## **🌍 Deployment**
### **Backend (NestJS)**
- Hosted on **Render**: [https://chatnest-wj2w.onrender.com](https://chatnest-wj2w.onrender.com)
- Database: **PostgreSQL on Render**

### **Frontend (Next.js)**
- Hosted on **Vercel**: [https://chatnest-webapp.vercel.app](https://chatnest-webapp.vercel.app)
