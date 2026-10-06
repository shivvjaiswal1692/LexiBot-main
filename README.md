# LexiBot ⚖️

### Full-Stack AI-Powered Legal Assistant Chatbot

LexiBot is a full-stack AI-powered legal assistant chatbot designed to help users understand legal concepts, explore common legal questions, and receive structured explanations in a conversational interface.

It combines a modern React frontend, Node.js/Express backend, MongoDB persistence, JWT authentication, Server-Sent Events (SSE) streaming, and Hugging Face's OpenAI-compatible inference API.

> **Disclaimer:** LexiBot is an educational legal-information tool. Its responses are not a substitute for professional legal advice from a qualified lawyer or legal professional.

---

## ✨ Features

### 🤖 AI Legal Assistant
- Conversational AI interface for legal questions
- Structured and easy-to-understand legal explanations
- Legal topic and context-aware responses
- Powered by Hugging Face inference using an OpenAI-compatible API

### 💬 Real-Time Streaming
- AI responses are streamed to the frontend using **Server-Sent Events (SSE)**
- Responses appear progressively instead of waiting for the complete answer
- Robust SSE event buffering handles events split across network chunks
- Error events are handled and displayed appropriately

### 🔐 Authentication & Security
- User registration and login
- JWT-based authentication
- Configurable JWT expiration
- Password hashing with `bcryptjs`
- Protected API routes
- Input validation and sanitization
- Prompt-injection protection
- API rate limiting
- Strict CORS configuration
- HTTP security headers using Helmet
- Environment-based secret management

### 💾 Chat Persistence
- MongoDB database integration using Mongoose
- User accounts stored securely
- Chat sessions persisted in MongoDB
- Previous conversations can be accessed through the application

### 🎨 Modern Frontend
- React + TypeScript
- Vite development and production build system
- Tailwind CSS
- Responsive conversational interface
- Authentication pages
- Chat sidebar and session management
- Structured message rendering

---

## 🏗️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express.js
- Mongoose
- JWT
- bcryptjs
- Express Validator
- Express Rate Limit
- Helmet
- CORS

### AI
- Hugging Face Router
- OpenAI-compatible API
- Model: `moonshotai/Kimi-K2-Instruct-0905`

### Database
- MongoDB
- MongoDB Atlas compatible

### Development
- npm
- Git
- GitHub

---

## 🧩 Architecture

```text
┌──────────────────────────────┐
│          React UI            │
│       TypeScript + Vite      │
└──────────────┬───────────────┘
               │
               │ HTTP / SSE
               ▼
┌──────────────────────────────┐
│       Express Backend        │
│                              │
│  Authentication & JWT        │
│  Validation & Sanitization   │
│  Rate Limiting               │
│  CORS + Helmet               │
│  Chat API                    │
└───────┬───────────────┬──────┘
        │               │
        │               │ OpenAI-compatible API
        │               ▼
        │      ┌──────────────────────┐
        │      │ Hugging Face Router  │
        │      │ Kimi-K2-Instruct     │
        │      └──────────────────────┘
        │
        ▼
┌──────────────────────────────┐
│          MongoDB             │
│  Users + Chat Sessions       │
└──────────────────────────────┘
```

---

## 📁 Project Structure

```text
LexiBot-main/
│
├── backend/
│   ├── config/
│   │   └── openai.js
│   │
│   ├── middleware/
│   │   ├── auth.js
│   │   └── validation.js
│   │
│   ├── models/
│   │   ├── ChatSession.js
│   │   └── User.js
│   │
│   ├── routes/
│   │   ├── auth.js
│   │   └── chat.js
│   │
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── types/
│   │   ├── App.tsx
│   │   ├── index.css
│   │   └── main.tsx
│   │
│   ├── .env.example
│   ├── package.json
│   └── vite.config.ts
│
├── .env
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

---

## ⚙️ Prerequisites

Make sure the following are installed:

- Node.js 18+ 
- npm
- MongoDB Atlas account or a local MongoDB instance
- Hugging Face account/API token

Check Node.js and npm:

```bash
node --version
npm --version
```

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd LexiBot-main
```

### 2. Install dependencies

Install root dependencies:

```bash
npm install
```

Install backend and frontend dependencies:

```bash
npm run install:all
```

If the `install:all` script is unavailable, install them manually:

```bash
cd backend
npm install

cd ../frontend
npm install

cd ..
```

---

## 🔑 Environment Variables

**Never commit real API keys, database credentials, or JWT secrets to GitHub.**

The repository provides environment templates for configuration.

### Backend

Create:

```text
backend/.env
```

Example:

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-host>/lexibot

JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRES_IN=7d

HUGGINGFACE_API_KEY=hf_your_token_here
```

### Frontend

If frontend environment configuration is required, create:

```text
frontend/.env
```

based on:

```text
frontend/.env.example
```

> Keep `.env` files private. They are excluded from Git through `.gitignore`.

---

## 🤖 AI Configuration

LexiBot uses the Hugging Face Router through an OpenAI-compatible API.

The backend configures the OpenAI client with:

```text
https://router.huggingface.co/v1
```

The configured model is:

```text
moonshotai/Kimi-K2-Instruct-0905
```

The API key is loaded from:

```env
HUGGINGFACE_API_KEY
```

No API key should be hardcoded into production source code.

---

## 🗄️ MongoDB

LexiBot uses MongoDB through Mongoose.

The database stores information such as:

- User accounts
- Authentication-related user data
- Chat sessions
- Conversation messages

Set your MongoDB connection string in:

```env
MONGODB_URI=your_mongodb_connection_string
```

MongoDB Atlas can be used for cloud-hosted development and deployment.

---

## ▶️ Running the Application

LexiBot consists of two services.

### Start the backend

Open a terminal:

```bash
cd backend
npm start
```

Development mode:

```bash
npm run dev
```

The backend runs by default at:

```text
http://localhost:5000
```

A successful startup displays:

```text
MongoDB connected
🚀 LexiBot API running on http://localhost:5000
```

### Start the frontend

Open another terminal:

```bash
cd frontend
npm run dev
```

The frontend runs by default at:

```text
http://localhost:5173
```

Open the displayed Vite URL in your browser.

---

## 🧪 Production Build

From the project root:

```bash
npm run build
```

This builds the frontend for production.

A successful build produces the frontend `dist` directory.

---

## 🔒 Security

LexiBot includes multiple security controls:

- JWT authentication
- Password hashing with bcrypt
- Request validation
- Input sanitization
- Prompt-injection detection
- Rate limiting
- Strict CORS
- Helmet security headers
- Environment-based secrets
- Configurable JWT expiration
- MongoDB-backed authentication and sessions

### Security recommendations

Before deploying to production:

1. Use a strong randomly generated JWT secret.
2. Use a production MongoDB user with appropriate permissions.
3. Keep all API keys in environment variables.
4. Configure `FRONTEND_URL` for the deployed frontend.
5. Never commit `.env` files.
6. Rotate credentials immediately if a secret is exposed.
7. Use HTTPS in production.

---

## 🔄 Chat Flow

The general request flow is:

```text
User
  │
  ▼
React Chat Interface
  │
  ▼
Authenticated API Request
  │
  ▼
Express Chat Route
  │
  ├── Authentication
  ├── Validation
  ├── Sanitization
  └── Rate Limiting
  │
  ▼
Hugging Face Router
  │
  ▼
AI Model
  │
  ▼
Streaming Response via SSE
  │
  ▼
React Chat Interface
  │
  ▼
MongoDB Chat Session
```

The backend streams generated content to the frontend using Server-Sent Events. The frontend buffers incoming SSE data so events split across network chunks can be processed correctly.

---

## 📡 API Overview

### Authentication

```text
POST /api/auth/register
POST /api/auth/login
```

### Chat

```text
POST /api/chat
GET  /api/chat/sessions
GET  /api/chat/sessions/:id
DELETE /api/chat/sessions/:id
```

### Health Check

```text
GET /api/health
```

Example:

```text
http://localhost:5000/api/health
```

---

## 📜 Available Scripts

### Root

```bash
npm install
npm run install:all
npm run build
```

### Backend

```bash
npm start
npm run dev
```

### Frontend

```bash
npm run dev
npm run build
```

---

## 🛡️ Legal Disclaimer

LexiBot is designed for **educational and informational purposes only**.

The AI-generated responses may contain inaccuracies, omissions, outdated information, or jurisdiction-specific limitations. The application does not create an attorney-client relationship and should not be relied upon as a substitute for professional legal advice.

Users should consult a qualified legal professional for advice regarding their specific circumstances.

---

## 🎯 Project Objectives

LexiBot was developed to explore how modern AI technologies can be combined with full-stack web development to create an accessible conversational legal-information assistant.

The project focuses on:

- Conversational AI
- Full-stack application development
- Secure authentication
- Real-time AI response streaming
- Database-backed chat persistence
- API integration
- Input validation and security
- Modern React development

---

## 🚧 Future Improvements

Potential future enhancements include:

- Retrieval-Augmented Generation (RAG) using verified legal sources
- Jurisdiction-specific legal information
- Legal document analysis
- Citation and source references
- Document upload and extraction
- Improved conversation memory
- Advanced legal-domain evaluation
- Role-based access control
- Production monitoring and analytics
- Automated testing
- Improved deployment infrastructure

---

## 👨‍💻 Development

LexiBot was developed as a full-stack AI project with a focus on combining:

```text
React + TypeScript
        +
Node.js + Express
        +
MongoDB
        +
JWT Authentication
        +
Hugging Face AI
        +
Server-Sent Events
```

---

## 📄 License

This project is intended for educational and portfolio purposes.

Add an appropriate open-source license before distributing the project publicly if required.