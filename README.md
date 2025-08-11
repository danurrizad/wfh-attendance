# WFH Attendance System

## Overview
A full-stack web application for Work-From-Home Employee Attendances.

## Features
**[1]:** Login auth using username and password with JWT token.
<br>
**[2]:** CRUD Master Data for Roles and Users.
<br>
**[3]:** Role-based user page access.
<br>
**[4]:** Employee clock-in and clock-out attendance with image capture and timestamp.
<br>
**[5]:** HR management control view for employee attendances.


## Tech Stack
**Frontend**: React.js and TailwindCSS 
<br>
**Backend**: Node.js and Express.js
<br>
**Database**: OracleDB

## Installation
### 1. Clone Repository
```bash
git clone https://github.com/danurrizad/wfh-attendance
```

### 2. Backend Setup

#### a. Navigate to the `backend` directory and install dependencies.
```bash
cd backend
npm install
```

#### b. .env File Configuration
In the `backend` directory, create a `.env` file. This file will store the Oracle Database connection details and other sensitive information.
```bash
# .env file in the backend directory
DB_USER=[Oracle_DB_User]
DB_PASSWORD=[ORACLE_DB_Password]
DB_CONNECTION_STRING=[Your_Oracle_DB_Connection_String]
PORT=5000 or any port
ACCESS_TOKEN_SECRET=[ACCESS_TOKEN_SECRET_STRING]
REFRESH_TOKEN_SECRET=[REFRESH_TOKEN_SECRET_STRING]
```

#### c. Start the Backend
From the `backend` directory, run the server.
```bash
npm run dev
```
The server will start on the port specified in the `.env` file. The server url will be the `THE_BACKEND_URL` in the .env file for the Frontend directory.

### 3. Frontend Setup

#### a. Navigate to `frontend` directory and install dependencies.
```bash
cd frontend
npm install
```

#### b. .env File Configuration
In the `frontend` directory, create a `.env` file.
```bash
VITE_BACKEND_URL=[THE_BACKEND_URL]
```

#### c. Start the Frontend
In a new terminal, navigate to the `frontend` directory and start the React application.
```bash
cd frontend
npm start
```
The application will open in your browser at `http://localhost:3000` or in the any port that served.

