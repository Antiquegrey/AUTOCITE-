# AutoCite ⚖️

AutoCite is an AI-powered legal document search, RAG-based summarization, and citation synthesis engine. It enables users to upload legal case files or PDFs, interact with them via a secure chatbot, extract standard citations (such as SCC, AIR, IPC, CrPC), and dynamically map references directly to verified repositories like Indian Kanoon and LII databases.

---

## 📁 Repository Structure

The project is split into two directories:

* **`frontend/`**: Single Page React Application built with Vite, TypeScript, and Material UI.
* **`backend/`**: Node.js + Express API server built with TypeScript, Mongoose/MongoDB, and integrated with the Google Gemini API.

---

## 🚀 Local Setup & Installation

To run both services locally, follow these steps:

### 1. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file inside the `backend` folder and populate it with your credentials:
   ```env
   PORT=2000
   MONGODB_URL=mongodb_connection_string
   JWT_SECRET=your_jwt_secret
   COOKIE_SECRET=your_cookie_secret
   GEMINI_API_KEY=your_gemini_api_key
   FRONTEND_URL=http://localhost:5173
   ```
4. Start the backend developer server:
   ```bash
   npm run dev
   ```
   *The backend will compile TypeScript files and run on `http://localhost:2000`.*

### 2. Frontend Setup
1. Open a new terminal and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. (Optional) Create a `.env` file inside the `frontend` folder for production URL endpoints:
   ```env
   VITE_API_URL=http://localhost:2000/api/v1
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The React app will launch on `http://localhost:5173`.*

---

## ☁️ Deployment Configurations

### Backend (Render)
* **Root Directory**: `backend`
* **Build Command**: `npm install && npm run build`
* **Start Command**: `npm start`
* **Environment Variables**: Make sure to set `MONGODB_URL`, `JWT_SECRET`, `COOKIE_SECRET`, `GEMINI_API_KEY`, and `FRONTEND_URL` (set to your live Vercel frontend URL).

### Frontend (Vercel)
* **Root Directory**: `frontend`
* **Framework Preset**: `Vite`
* **Build Command**: `npm run build`
* **Output Directory**: `dist`
* **Environment Variables**: Add `VITE_API_URL` pointing to your live backend Render URL (e.g., `https://your-backend.onrender.com/api/v1`).

---

## 📜 Disclaimer
AutoCite is an AI assistant designed to accelerate legal research. Chat summaries and citation links are generated using automated models and do not constitute formal legal representation or advice.
