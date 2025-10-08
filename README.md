# Multi-Service PERN Stack Project

## Project Overview

This is a **college-level web application** built using the **PERN stack** (PostgreSQL, Express.js, React, Node.js). The project demonstrates a **microservice-based architecture** with separate services for authentication and user management, along with a React frontend.

### Features

* **Microservices architecture**: Each service is modular and can run independently.
* **Authentication & Security**: Passwords are hashed and authentication is handled via **JWT tokens**.
* **Database**: PostgreSQL is used for storing user and service data.
* **Frontend**: React application communicates with backend services via REST APIs.
* **Environment management**: Environment variables are handled using **dotenv**.

---

## Folder Structure

```plaintext
college-library-management/
├── frontend/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   ├── .gitignore
│   ├── package.json
│   ├── package-lock.json
│   └── README.md
└── services/
    ├── auth-service/
    │   └── index.js
    ├── book-service/
    │   └── index.js
    ├── inventory-service/
    │   └── index.js
    └── user-service/
    │   └── index.js
    ├── package.json
    ├── package-lock.json
    ├── .gitignore
└── README.md

```

---

## Technologies Used

* **Backend:** Node.js, Express.js, PostgreSQL
* **Frontend:** React.js
* **Libraries:** bcryptjs, jsonwebtoken, cors, dotenv, pg

---

## Setup Instructions

### Backend Setup

1. Navigate to the `services` folder:

```bash
cd services
```

2. Install backend dependencies:

```bash
npm install
```

3. Set up environment variables for each service (e.g., `auth-service/.env`):

```env
PORT=5000
DATABASE_URL=postgres://user:password@localhost:5432/dbname
JWT_SECRET=your_secret_key
```

4. Start backend services using npm scripts defined in `services/package.json`:

```bash
npm run start:auth
npm run start:user
```

### Frontend Setup

1. Navigate to the frontend folder:

```bash
cd frontend
```

2. Install frontend dependencies:

```bash
npm install
```

3. Start the React app:

```bash
npm start
```

4. The app runs at [http://localhost:3000](http://localhost:3000) by default.

---

## Usage

* **Authentication Service (`auth-service`)**: Handles signup, login, and JWT token generation.
* **User Service (`user-service`)**: Handles user data operations, protected by authentication.
* **Frontend (`frontend`)**: React app for user interactions with backend APIs.

---

## Project Maintainers & Collaborators

| [Nandakumar](https://github.com/nandakum4r)              | [Laila R](https://github.com/lailar2004)              | [Jayaprakash](https://github.com/Jayaprakash-18)              | [Suresh Appu](https://github.com/Sureshappu152)              | [Shanmugharini](https://github.com/Shanmugharini)              | [VKMir](https://github.com/VKMir)              |
| -------------------------------------------------------- | ----------------------------------------------------- | ------------------------------------------------------------- | ------------------------------------------------------------ | -------------------------------------------------------------- | ---------------------------------------------- |
| ![Nandakumar](https://github.com/nandakum4r.png?size=40) | ![Laila R](https://github.com/lailar2004.png?size=40) | ![Jayaprakash](https://github.com/Jayaprakash-18.png?size=40) | ![Suresh Appu](https://github.com/Sureshappu152.png?size=40) | ![Shanmugharini](https://github.com/Shanmugharini.png?size=40) | ![VKMir](https://github.com/VKMir.png?size=40) |

* Clicking on the avatars will take you to the respective GitHub profiles.

-- 

## License

This project is **for educational purposes only**. You may use it internally for learning and assignments.

---
