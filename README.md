# Task Manager API

A full-stack task management application with a Python Flask REST API backend, completely dockerized with a React JS frontend and MySQL database.

## Features
* **Authentication**: Secure JWT-based user login and registration.
* **Database**: MySQL integration for reliable persistence.
* **REST API**: Create, Read, Update, and Delete tasks.
* **Pagination**: View tasks across multiple pages.
* **Input Validation**: Server-side error handling to ensure data integrity.
* **Docker Support**: Containerized environment for instant setup.

## Prerequisites
* [Docker](https://www.docker.com/products/docker-desktop) & [Docker Compose](https://docs.docker.com/compose/install/) OR
* Python 3.10+ and Node.js 18+ (for local development)

---

## 🚀 Quick Start (Docker)
The easiest way to run the entire project is using Docker Compose.

1. Ensure Docker is running on your machine.
2. Open a terminal in the root directory (`task_api`).
3. Build and start the containers:
   ```bash
   docker-compose up --build
   ```
4. **Access the Application**:
   - Frontend React App: `http://localhost:3000`
   - Backend Flask API: `http://localhost:5000`
   - Database: Running on port `3307`

*(To shut down the servers, simply press `Ctrl+C` in the terminal and run `docker-compose down`).*

---

## 💻 Manual Local Setup
If you prefer not to use Docker, follow these steps to run the servers locally.

### 1. Database Setup
Ensure you have MySQL installed.
* Execute the commands in `init.sql` to create the `task_db` database and the required tables (`users`, `tasks`).

### 2. Backend (Python/Flask) Setup
Open a new terminal in the `backend/` directory:
1. Create a virtual environment:
   ```bash
   python -m venv venv
   ```
2. Activate the virtual environment:
   * **Windows**: `venv\Scripts\activate`
   * **Mac/Linux**: `source venv/bin/activate`
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Configure environment variables in `backend/.env`:
   Make sure `MYSQL_HOST` is set to `localhost`.
5. Run the server:
   ```bash
   python app.py
   ```
   *(Running on http://localhost:5000)*

### 3. Frontend (Node.js/React) Setup
Open a new terminal in the `frontend/` directory:
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm start
   ```
   *(Running on http://localhost:3000)*

---

## 📡 Testing the API
You can test the API using the provided **Postman Collection** or **Terminal cURL Commands**:
* Import `postman_collection.json` into Postman.
* Refer to `curl_commands.md` for manual terminal testing.

**First Steps:**
Register a user (`POST /register`) and Login (`POST /login`). Copy the `token` from the login response. For all `/tasks` requests, provide the token in the `Authorization` header as a `Bearer` token.
### Output
![image](https://github.com/sashruthi/Digitivity_task/blob/d1b269aa0a9e72e1c6ce005e088473b659231e40/Screenshot%202026-03-29%20145023.png)
![image](https://github.com/sashruthi/Digitivity_task/blob/d1b269aa0a9e72e1c6ce005e088473b659231e40/Screenshot%202026-03-29%20144718.png)

