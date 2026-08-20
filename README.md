# Online Judge (oj-project)

A full-stack online judge platform that allows users to write, compile, and execute code for algorithmic problems. It features a modern interface, secure code execution, AI assistance, and problem management.

**🎥 [Watch the Project Demo on Loom](https://www.loom.com/share/8e959327b52a4e49a0d0065d1a12b724)**

## 🏗️ Architecture & Tech Stack

This project is a monorepo consisting of three main microservices:

### 1. Frontend (`/frontend`)
The user interface built with speed and modern aesthetics in mind.
- **Framework:** React + Vite
- **Styling:** TailwindCSS
- **Code Editor:** Monaco Editor (`@monaco-editor/react`)
- **Routing:** React Router v7
- **Utilities:** React Markdown, Axios, React Hot Toast

### 2. Backend (`/backend`)
The core API that handles user data, problem sets, and external AI integrations.
- **Framework:** Node.js + Express
- **Database:** MongoDB (via Mongoose)
- **Security & Auth:** JSON Web Tokens (JWT), bcryptjs, Helmet, CORS
- **AI Integration:** Google Generative AI (`@google/generative-ai`) for smart hints and code explanations.

### 3. Compiler Service (`/compiler-service`)
A dedicated microservice responsible for safely compiling and executing submitted code.
- **Framework:** Node.js + Express
- **Supported Languages:** C++, Python, and Java
- **Execution Strategy:** File-based execution using child processes (`executors/`). It securely manages temporary files (`temp/`, `inputs/`, `outputs/`) generated during execution.

---

## 🚀 Getting Started

Follow these steps to run the application locally.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local instance or MongoDB Atlas cluster)
- GCC/G++ compiler (for C++ execution)
- Python 3.x (for Python execution)
- Java JDK (for Java execution)

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables. Create a `.env` file based on `.env.example` and add your configurations (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`, `GEMINI_API_KEY`, and `COMPILER_API_URL`).
4. Start the server:
   ```bash
   npm run start
   ```

### 2. Compiler Service Setup

1. Navigate to the compiler-service directory:
   ```bash
   cd compiler-service
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the compiler service (Ensure it runs on the port specified in your backend's `COMPILER_API_URL`):
   ```bash
   npm run start
   ```

### 3. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
4. Open the application in your browser at `http://localhost:5173/`.

---

## ✨ Key Features

- **Multi-Language Execution:** Users can solve problems using C++, Python, or Java.
- **Rich Code Editor:** Integrated Monaco Editor for an IDE-like experience (syntax highlighting, formatting).
- **AI Powered:** Leverages Google Gemini to provide intelligent debugging and hints.
- **Scalable Architecture:** Separation of the backend logic from the code execution environment.
- **Authentication system:** Secure login and registration.

