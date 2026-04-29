# 🌍 IntelliTour - AI-Powered Smart Itinerary System

IntelliTour is a full-stack MERN (MongoDB, Express, React, Node.js) application that revolutionizes travel planning. It leverages high-speed Generative AI (Groq/Llama 3) to create personalized, day-by-day itineraries in seconds, presented through a stunning, interactive timeline interface.

---

## ✨ Features

- **AI Itinerary Generation:** Instant, structured travel plans based on destination, duration, and budget.
- **Secure Authentication:** 
  - Manual Signup/Login with **Email OTP Verification**.
  - **Google OAuth 2.0** integration for one-click access.
- **Premium Aesthetics:** Modern "Off-White" design system with glassmorphism, animated background orbs, and a responsive UI.
- **Interactive Dashboard:** Manage your trips, view upcoming adventures, and access detailed itineraries.
- **Downloadable Itineraries:** (Planned) Export your travel plans as PDFs for offline access.

---

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine.

### Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (Local instance or MongoDB Atlas account)
- **Groq API Key** (Get it free at [console.groq.com](https://console.groq.com/))
- **Google Cloud Console Project** (For Google Sign-In)

---

### 1. Installation

Clone the repository and install dependencies for both the backend and frontend.

```bash
# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

---

### 2. Environment Setup

#### Backend Configuration
Navigate to the `backend` directory and create a `.env` file based on the example provided.

```bash
cd backend
cp .env.example .env
```

Open `.env` and fill in the following:
- `MONGO_URI`: Your MongoDB connection string.
- `JWT_SECRET`: A long, random string for token security.
- `GROQ_API_KEY`: Your API key from Groq Console.
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From your Google Cloud project.
- `EMAIL_USER` & `EMAIL_PASS`: Your Gmail address and an **App Password** (not your regular password).

#### Frontend Configuration (Optional)
If you want to point to a different backend port, create a `frontend/.env` file:
```env
VITE_API_URL=http://localhost:5000/api
```

---

### 3. Running the Application

You need to run both the backend and frontend servers simultaneously.

#### Start the Backend (API Server)
```bash
cd backend
npm run dev
```
*Server will start on `http://localhost:5000`*

#### Start the Frontend (Vite Dev Server)
```bash
cd frontend
npm run dev
```
*Application will be available at `http://localhost:5173`*

---

## 📁 Project Structure

```text
Intell_Tour_Project/
├── backend/                # Express & Node.js API
│   ├── config/             # DB and Passport configurations
│   ├── controllers/        # Business logic for routes
│   ├── models/             # Mongoose schemas (User, Trip)
│   ├── routes/             # API endpoint definitions
│   └── services/           # External integrations (Groq, Email)
├── frontend/               # React & Vite application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Navbar, Footer, etc.)
│   │   ├── context/        # Auth and Data contexts
│   │   ├── pages/          # Full page views
│   │   └── api/            # Axios instance and API calls
└── README.md               # You are here
```

---

## 🛡️ Authentication Flow
- **Local:** Register → Receive OTP via Email → Verify OTP → Dashboard Access.
- **Google:** One-click Login → Automatic Verification → Dashboard Access.

---

## 🤝 Contributing
Feel free to fork this project, open issues, and submit pull requests to help make IntelliTour even better!

**Happy Travels! ✈️**
