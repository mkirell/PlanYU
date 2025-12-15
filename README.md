# PlanYU

A Task and Project Management Application

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

PlanYU is a to-do list and project management application designed to help users efficiently organize tasks, projects, and profiles. It provides a clean and intuitive interface, real-time updates, and comprehensive task tracking features. Users can assign tasks to projects, manage multiple projects, and monitor their progress, all in one central platform.

### Challenges

Developing PlanYU involved addressing key challenges:

- **Task and project organization:** Allowing users to efficiently manage multiple tasks across projects.  
- **Real-time updates:** Ensuring changes are reflected immediately for a smooth user experience.  
- **User management:** Supporting profiles and secure handling of multiple users and their projects.  
- **Scalable backend:** Designing an API that efficiently handles database operations and concurrent requests.  

### Solution

PlanYU addresses these challenges through:

- **RESTful API with Express.js:** Provides a structured backend for handling tasks, projects, and users.  
- **MySQL Database:** Efficiently stores and queries user, project, and task information.  
- **React Frontend:** Delivers a responsive and interactive interface with real-time updates.  
- **Flexible Deployment:** Supports both local execution with `make` commands and Docker-based deployment for cross-platform consistency.  

This approach transforms task management into a seamless, user-friendly experience with real-time project tracking.

---

## Installation

### Local Installation

1. Clone this repository or download the `.zip` archive and extract it.  
2. Create a `.env` file in the project root containing all required environment variables (database credentials, API keys, etc.).  
3. Open a terminal in the project folder.  
4. Run the following command to set up the environment: make env  

This will create a virtual environment and install all required dependencies for both backend and frontend.

### Docker Installation

1. Clone this repository or download the `.zip` archive and extract it.  
2. Ensure **Docker** and **Docker Compose** are installed.  
3. Create a `.env` file in the project root with the required environment variables.  
4. Open a terminal in the project folder.  
5. Run the following command to build the container: docker-compose build  

---

## Technologies Used

- **Backend:** Node.js, Express.js  
- **Database:** MySQL  
- **Frontend:** React, Redux  
- **Deployment:** Docker, Docker Compose  

Both local and Docker approaches use the same codebase and dependencies.

---

## Execution

### Local Execution

1. Start the application: make start  
2. Open your web browser and go to <http://localhost:5173>  
3. Stop the application: make stop  

> Notes:  
>
> - Requires **Node.js**, **npm**, and **MySQL**.  
> - Environment variables in `.env` must be correctly set for database and API configurations.  

### Docker Execution

1. Make sure **Docker Desktop** is running.  
2. Start the containers: docker-compose up  
3. Open your web browser and go to <http://localhost:5173>  
4. Stop the containers: docker-compose down  

> Notes:  
>
> - Docker ensures a consistent environment across all platforms.  
> - `.env` file must be present in the project root before building the containers.  

---

## License

This project is under the Apache License, see the `LICENSE` file for details.
