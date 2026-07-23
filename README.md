# Pet Care Assistant 🐾

A full-stack web app for managing pets and getting pet-care advice from **PawDoc AI**, an AI pet health assistant (concept inspired by the Pawdoc AI feature in Petzify). Built as an internship project using the MERN stack.

## Features

- User registration/login with JWT auth
- Add, edit, delete, and view pets (with photo upload via Cloudinary)
- Search pets by name, filter by breed
- **PawDoc AI** — a pet-health-focused chatbot (Google Gemini) that only answers pet-related questions (care, nutrition, grooming, vaccinations, exercise, behaviour, basic health guidance)
- Chat history saved per user
- Dark mode toggle
- Responsive UI (Tailwind CSS)

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite, Tailwind CSS |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| Auth | JWT, bcrypt |
| Image storage | Cloudinary |
| AI | Google Gemini API |

## Project Structure

```
pet-care-app/
├── client/          # React frontend
│   └── src/
│       ├── components/
│       ├── pages/
│       ├── services/
│       ├── context/
│       └── routes/
├── server/          # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── seed.js
└── render.yaml
```

## Getting Started

### 1. Clone / unzip and install dependencies

```bash
cd server
npm install

cd ../client
npm install
```

### 2. Set up environment variables

**server/.env** (copy from `.env.example`):

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=some_long_random_string
JWT_EXPIRES_IN=7d

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

GEMINI_API_KEY=your_gemini_api_key

CLIENT_URL=http://localhost:5173
```

**client/.env** (copy from `.env.example`):

```
VITE_API_URL=http://localhost:5000/api
```

Where to get these:
- **MongoDB**: create a free cluster at [mongodb.com/atlas](https://mongodb.com/atlas), get the connection string.
- **Cloudinary**: sign up at [cloudinary.com](https://cloudinary.com), grab cloud name/API key/secret from the dashboard.
- **Gemini API key**: get one from [Google AI Studio](https://aistudio.google.com/apikey).

### 3. (Optional) Load sample data

```bash
cd server
node seed.js
```

This creates a demo account: `demo@petcare.com` / `demo1234`, with two sample pets.

### 4. Run the app locally

In one terminal:
```bash
cd server
npm run dev
```

In another terminal:
```bash
cd client
npm run dev
```

Frontend runs at `http://localhost:5173`, backend at `http://localhost:5000`.

## API Endpoints

**Auth**
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `POST /api/auth/logout`

**Pets** (all require `Authorization: Bearer <token>`)
- `GET /api/pets` — supports `?search=` and `?breed=` query params
- `POST /api/pets` — multipart form data, field name `image` for the photo
- `GET /api/pets/:id`
- `PUT /api/pets/:id`
- `DELETE /api/pets/:id`

**Chat (PawDoc AI)**
- `POST /api/chat` — body: `{ "message": "..." }`
- `GET /api/chat` — chat history

## Deployment

### Backend → Render

1. Push this repo to GitHub.
2. On Render, create a new **Web Service**, point it at the repo.
3. Set root directory to `server`.
4. Build command: `npm install`, start command: `npm start`.
5. Add all the env vars from `server/.env` in Render's dashboard.
6. (There's a `render.yaml` in the root if you'd rather use Render's Blueprint feature.)

### Frontend → Vercel

1. Import the repo into Vercel.
2. Set root directory to `client`.
3. Framework preset: Vite.
4. Add env var `VITE_API_URL` pointing to your deployed Render backend URL (e.g. `https://your-app.onrender.com/api`).
5. Deploy.

Don't forget to update `CLIENT_URL` in the backend's env vars to match your deployed Vercel URL, so CORS doesn't block requests.

## Notes

- Passwords are hashed with bcrypt before being stored — never stored in plain text.
- JWT tokens are stored in `localStorage` on the client and attached to every request via an axios interceptor.
- PawDoc AI uses a system prompt to restrict Gemini to pet-related topics only (care, nutrition, grooming, vaccinations, exercise, behaviour, and basic health guidance), and politely declines anything else. It's not a replacement for a licensed vet — the UI reminds users of that.
- Image uploads go straight to Cloudinary via `multer-storage-cloudinary`; only the resulting URL is stored in MongoDB.
