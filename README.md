# CipherSQLStudio

A browser-based SQL learning platform where students can practice SQL queries against pre-configured assignments with real-time execution and intelligent AI hints.

## Technology Choices
- **Frontend**: React.js with Vite for high performance and fast development loops.
- **Styling**: Vanilla SCSS (BEM naming, mobile-first design) to achieve a modern, responsive interface from scratch without relying on component libraries.
- **Code Editor**: Monaco Editor (vs-dark theme) for an authentic SQL typing experience.
- **Backend Framework**: Node.js & Express.js.
- **Authentication**: JWT & bcryptjs for secure user registration and login.
- **Persistence DB**: MongoDB & Mongoose schemas used to store User profiles, Assignment details, and user query Attempts.
- **Sandbox DB**: PostgreSQL running locally via Docker to securely execute student SQL queries. Input validation restricts queries to `SELECT` and blocks critical operations.
- **LLM Integration**: Google Gemini API to generate contextual, helpful hints for students based on their query errors and assignment schema without revealing the direct answer.

## Prerequisites
- Node.js (v18+)
- Docker & Docker Compose
- MongoDB (Local or Atlas URI)
- Google Gemini API Key

## Setup & Installation

### 1. PostgreSQL Sandbox Setup
Ensure Docker Desktop is installed and currently running on your machine.
In macOS, older versions use `docker-compose` while newer installations use `docker compose`.
```bash
cd cipher.assignment
docker compose up -d
# If that fails, try: docker-compose up -d
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create `.env` based on `.env.example`:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/ciphersqlstudio
JWT_SECRET=super_secret_jwt_key
GEMINI_API_KEY=your_gemini_api_key
SANDBOX_DB_USER=postgres
SANDBOX_DB_PASSWORD=postgres
SANDBOX_DB_NAME=sandbox
SANDBOX_DB_HOST=localhost
SANDBOX_DB_PORT=5432
```
Seed assignments to the database:
```bash
node seeder.js
```
Start the backend server:
```bash
npm run dev
# or
node server.js
```

### 3. Frontend Setup
```bash
cd frontend
npm install
```
Start the development server:
```bash
npm run dev
```

Visit `http://localhost:5173` to access the application.
