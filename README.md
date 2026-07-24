# 🐾 Pet Care Web Application

A full-stack MERN web application that allows users to manage their pets and interact with **PawDoc AI**, an AI-powered pet care assistant. Developed as part of a Software Developer Internship at **Petzify Pvt. Ltd.**

---

## 🚀 Live Demo

- **Frontend (Vercel):** https://petcare-web-application.vercel.app
- **Backend (Render):** https://petcare-web-application.onrender.com

---

## 📌 Features

### 🔐 User Authentication
- User Registration
- User Login
- JWT-based Authentication
- Protected Routes
- Logout

### 🐶 Pet Management
- Add a New Pet
- View All Pets
- Edit Pet Details
- Delete Pet
- Upload Pet Images using Cloudinary

Each pet contains:
- Pet Image
- Pet Name
- Breed
- Age
- Gender
- Additional Notes

### 🤖 PawDoc AI Assistant

Google Gemini powered chatbot that provides guidance on:

- Pet Care
- Nutrition
- Grooming
- Vaccination Awareness
- Exercise
- Behaviour
- Basic Health Tips

The chatbot only answers pet-related questions and politely refuses unrelated topics through prompt engineering.

### 💬 Chat History
- Saves previous conversations
- Displays chat history for each user

### 🌙 Additional Features
- Dark Mode
- Responsive UI
- Search Pets by Name
- Filter Pets by Breed

---

# 🛠 Tech Stack

| Layer | Technology |
|--------|------------|
| Frontend | React.js, Vite, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas |
| Authentication | JWT, bcrypt |
| Image Storage | Cloudinary |
| AI Integration | Google Gemini API |
| Deployment | Vercel, Render |

---

# 📂 Project Structure

```
pet-care-app
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── routes
│   │   └── services
│
├── server
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── seed.js
│
└── render.yaml
```

---

# ⚙️ Environment Variables

### Server (.env)

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173
```

### Client (.env)

```env
VITE_API_URL=http://localhost:5000/api
```

---

# 💻 Local Setup

### Clone Repository

```bash
git clone <repository-url>
cd pet-care-app
```

### Install Dependencies

Backend

```bash
cd server
npm install
```

Frontend

```bash
cd client
npm install
```

### Run Backend

```bash
cd server
npm run dev
```

### Run Frontend

```bash
cd client
npm run dev
```

Frontend:
```
http://localhost:5173
```

Backend:
```
http://localhost:5000
```

---

# 📡 API Endpoints

## Authentication

| Method | Endpoint |
|---------|----------|
| POST | /api/auth/register |
| POST | /api/auth/login |
| GET | /api/auth/me |
| POST | /api/auth/logout |

---

## Pets

| Method | Endpoint |
|---------|----------|
| GET | /api/pets |
| POST | /api/pets |
| GET | /api/pets/:id |
| PUT | /api/pets/:id |
| DELETE | /api/pets/:id |

Supports:
- Search
- Breed Filter
- Image Upload

---

## PawDoc AI

| Method | Endpoint |
|---------|----------|
| POST | /api/chat |
| GET | /api/chat |

---

# ☁️ Deployment

## Frontend

- Vercel

## Backend

- Render

## Database

- MongoDB Atlas

## Image Storage

- Cloudinary

---

# 🔒 Security

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- Input Validation
- Error Handling
- Secure Cloudinary Uploads

---

# 📷 Screenshots

You can add screenshots here:

- Login Page
- Dashboard
- Add Pet
- Pet List
- PawDoc AI Chat
- Dark Mode

---

# 🎯 Future Improvements

- Email Verification
- Password Reset
- Appointment Booking
- Pet Vaccination Reminders
- Multi-language Support
- Admin Dashboard

---

# 👩‍💻 Developed By

**Fathima Rumaiza**

Software Developer Intern

Petzify Pvt. Ltd.

---

## 📄 License

This project was developed for educational and internship evaluation purposes.