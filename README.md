
# RDBMS Backend

## Overview

This project is a backend system designed for managing user profiles, products, and bookings. It is built using Express.js and Prisma with a PostgreSQL database. The system includes JWT authentication for secure user management.

## Setup and Installation

To set up and start the project, follow these steps:

1. **Clone the Repository**

   ```bash
   git clone https://github.com/sohamvin/RDBMS-project.git
   cd <repository-folder>
    ```

2. **Install Dependencies**
    Ensure you have ![Node.js](https://nodejs.org/en/download/package-manager) installed. Install the required packages using npm:

    ```bash
    npm install
    ```

3. **Set Up Environment Variables**
    Create a .env file in the root of the project directory with the following content:
    ```bash
    DATABASE_URL="postgresql://<username>:<password>@<host>:<port>/<database>?schema=public"
    DIRECT_URL="postgresql://<username>:<password>@<host>:<port>/<database>"
    JWT_SECRET="your-secret-key"
    PORT=3000
    ```

4. **Run Migrations**
    ```bash
    npm i
    npx prisma migrate dev
    ```

5. **Start the Server**
    ```bash
    npm run dev
    ```


**API Endpoints**
POST /register: Register a new user.
POST /login: Authenticate a user and obtain a JWT token.
GET /users: Retrieve all users.
POST /users: Create a new user profile.
GET /products: Retrieve all products.
POST /products: Create a new product.
GET /bookings: Retrieve all bookings.
POST /bookings: Create a new booking.



**Middleware**
The application uses JWT for authentication. Middleware is applied to protect routes, except for the registration and login routes.

**Database Schema**
The project uses the following database schema:


