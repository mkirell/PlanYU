# PlanYU

A Collaborative Platform for Efficient Project Management

---

## Table of Contents

- [Project Overview](#project-overview)
- [Installation](#installation)
  - [Local Installation](#local-installation)
  - [Docker Installation](#docker-installation)
- [Technologies Used](#technologies-used)
- [Execution](#execution)
  - [Local Execution](#local-execution)
  - [Docker Execution](#docker-execution)
- [License](#license)

---

## Project Overview

### Concept

PlanYU is a collaborative project board for organizing projects, tasks, and team members in a single workspace. It delivers a focused Kanban-style interface with project stages, task priorities, and due dates, backed by secure authentication. Users can create projects, manage members, and track work across multiple projects with offline-ready support.

### Challenges

Developing PlanYU involved addressing key challenges:

- **Multi-project workflows:** Supporting Kanban-style task flow with priorities, due dates, and role-aware actions.
- **Offline-first usage:** Keeping data usable without connectivity and syncing safely when back online.
- **Secure access control:** Handling authentication, refresh sessions, and project membership permissions.
- **Consistent data handling:** Validating inputs and keeping client and server state aligned.

### Solution

PlanYU addresses these challenges through:

- **Express API with auth:** JWT-based access, refresh cookies, and role checks for project and task routes.
- **MySQL + Sequelize:** Structured models and migrations for users, profiles, projects, and tasks.
- **React + Redux Toolkit:** Kanban UI, drag-and-drop flow, and synced state management.
- **Offline/PWA support:** IndexedDB caching, queued mutations, and service-worker caching.

This approach transforms task management into a seamless, user-friendly experience with dependable collaboration.

---

## Installation

### Local Installation

1. Clone this repository or download the `.zip` archive and extract it.
2. Copy `.env.example` to `.env` in the project root and fill in the required values.
3. Open a terminal in the project folder.
4. Run the following command to set up the environment: make env

This will create a virtual environment and install all required dependencies for both backend and frontend.

### Docker Installation

1. Clone this repository or download the `.zip` archive and extract it.
2. Ensure **Docker** and **Docker Compose** are installed.
3. Copy `.env.example` to `.env` in the project root and fill in the required values.
4. Open a terminal in the project folder.
5. Run the following command to build the container: docker-compose build

---

## Technologies Used

- **Backend:** Node.js, Express.js, Sequelize, JWT, Zod, bcrypt, Helmet, rate limiting
- **Database:** MySQL (mysql2), Sequelize ORM, Sequelize CLI (migrations & seeders)
- **Frontend:** React, Redux Toolkit, React Router, Axios, Vite, PWA (service worker + IndexedDB)
- **Deployment:** Docker, Docker Compose

Both local and Docker approaches use the same codebase and dependencies.

---

## Execution

### Local Execution

1. Start the application: make start
2. Open your web browser and go to <http://localhost:3000>
3. Check the server at <http://localhost:5000/health> or use Postman to call <http://localhost:5000/api/*>
4. Connect to the database: mysql -h localhost -P 3306 -u <DATABASE_USER> -p -D <DATABASE_NAME>
5. Stop the application: make stop

> Notes:
>
> - Requires **Node.js**, **npm**, and **MySQL**.
> - Environment variables in `.env` must be correctly set for database and API configurations.

### Docker Execution

1. Make sure **Docker Desktop** is running.
2. Start the containers: docker-compose up
3. Open your web browser and go to <http://localhost:3006>
4. Check the server at <http://localhost:5006/health> or use Postman to call <http://localhost:5006/api/*>
5. Connect to the database: mysql -h localhost -P 8006 -u <DATABASE_USER> -p -D <DATABASE_NAME>
6. Stop the containers: docker-compose down

> Notes:
>
> - Docker ensures a consistent environment across all platforms.
> - `.env` file must be present in the project root before building the containers.

---

## License

This project is under the Apache License, see the `LICENSE` file for details.
