<h1 align="center"> QuickCourt </h1>
<p align="center"> Your Express Lane to Sports Venue Bookings and Management </p>

<p align="center">
  <img alt="Build" src="https://img.shields.io/badge/Build-Passing-brightgreen?style=for-the-badge">
  <img alt="Issues" src="https://img.shields.io/badge/Issues-0%20Open-blue?style=for-the-badge">
  <img alt="Contributions" src="https://img.shields.io/badge/Contributions-Welcome-orange?style=for-the-badge">
  <img alt="License" src="https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge">
</p>
<!-- 
  **Note:** These are static placeholder badges. Replace them with your project's actual badges.
  You can generate your own at https://shields.io
-->

## 📖 Table of Contents

- [⭐ Overview](#-overview)
- [✨ Key Features](#-key-features)
- [🛠️ Tech Stack & Architecture](#️-tech-stack--architecture)
- [🚀 Getting Started](#-getting-started)
- [🔧 Usage](#-usage)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)

## ⭐ Overview

QuickCourt is a modern, full-stack platform designed to revolutionize sports venue discovery, booking, and management for enthusiasts and facility owners alike.

> In today's fast-paced world, finding and reserving a suitable sports venue can often be a frustrating, time-consuming process involving phone calls, scattered information, and uncertain availability. Venue owners, on the other hand, struggle with manual booking systems, inefficient scheduling, and a lack of tools to reach their audience and optimize their operations.

QuickCourt provides an elegant, intuitive solution to these challenges. It offers a seamless user experience for customers to browse, filter, and book courts in real-time, while empowering venue owners with powerful tools for managing their facilities, schedules, and customer interactions. From real-time availability and secure payments to comprehensive dashboards and detailed analytics, QuickCourt brings efficiency and convenience to the sports booking ecosystem.

This project is built with a clear separation of concerns, featuring a **React-based frontend application** for a dynamic user interface and a **robust Node.js Express backend API** powered by TypeScript for scalable and secure operations. The two components communicate via RESTful API calls, ensuring modularity and maintainability.

## ✨ Key Features

QuickCourt is engineered with a rich set of features to cater to both users looking to book a court and owners managing their venues:

*   **🚀 Seamless User Authentication & Authorization:** Secure user registration (`Register.tsx`), login (`Login.tsx`), and role-based access control ensuring personalized experiences for customers, venue owners, and administrators (`ProtectedRoute.tsx`, `auth.ts` middleware, `authController.ts`).
*   **🔍 Intuitive Venue Discovery & Search:** Users can effortlessly search (`SearchResults.tsx`) for sports venues, view detailed information (`VenueDetail.tsx`), and browse popular (`PopularSports.tsx`) or trending (`TrendingVenues.tsx`) options via a user-friendly interface (`SportCard.tsx`, `VenueCard.tsx`, `HeroSection.tsx`, `VenueShowcase.tsx`).
*   **🗓️ Real-time Booking & Scheduling:** Facilitates instant booking of courts (`Booking.ts`, `TimeSlot.ts`) with real-time availability checks, making reservations quick and reliable (`bookingController.ts`).
*   **💳 Secure Payment Integration:** Incorporates a dedicated payment service (`paymentService.ts`) to handle secure transactions for bookings.
*   **📧 Automated Notifications & Communication:** Leverages an email service (`emailService.ts`) for sending booking confirmations, updates, and other important communications to users and owners.
*   **📊 Comprehensive Dashboards:** Provides tailored dashboards for different user roles – a `CustomerProfile.tsx` for users to manage their bookings, an `OwnerDashboard.tsx` for venue operators to oversee their facilities, and an `AdminDashboard.tsx` for system administrators.
*   **🏢 Venue & Court Management:** Owners can register and manage their venues (`Venue.ts`, `VenueEnhanced.ts`), define courts (`Court.ts`, `CourtEnhanced.ts`), set up time slots (`TimeSlot.ts`), and view analytics (`VenueAnalytics.ts`) directly from their dashboard (`ownerController.ts`).
*   **⭐ Review and Rating System:** Allows users to leave reviews (`Review.ts`) and ratings for venues, fostering community engagement and providing valuable feedback for owners.
*   **🖼️ Media Uploads:** Supports image and file uploads (`uploadService.ts`, `multer`) for venues and user profiles, enriching content and presentation.
*   **📄 Robust API Documentation:** Automatically generated and interactive API documentation (`swagger-ui-express`, `swagger-jsdoc`) for easy understanding and integration.

## 🛠️ Tech Stack & Architecture

QuickCourt employs a modern and robust technology stack, designed for performance, scalability, and maintainability.

| Technology                  | Purpose                                        | Why it was Chosen                                                            |
| :-------------------------- | :--------------------------------------------- | :--------------------------------------------------------------------------- |
| **Frontend:**               |                                                |                                                                              |
| React                       | User Interface Library                         | Declarative, component-based approach for building interactive and complex UIs. |
| TypeScript                  | Language (Frontend & Backend)                  | Enhances code quality, maintainability, and developer productivity with static typing. |
| Vite                        | Next-Gen Frontend Tooling                      | Blazing fast development server, optimized builds, and excellent developer experience. |
| Tailwind CSS & PostCSS      | Utility-First CSS Framework & Preprocessor     | Rapid UI development with highly customizable utility classes and efficient styling. |
| **Backend:**                |                                                |                                                                              |
| Node.js                     | JavaScript Runtime                             | High performance, non-blocking I/O model suitable for scalable API services. |
| Express.js                  | Web Application Framework                      | Minimalist, flexible, and robust framework for building RESTful APIs with ease. |
| MySQL (via `mysql2`)        | Relational Database System                     | Robust, widely adopted, and reliable for structured data storage and complex queries. |
| Sequelize                   | Object-Relational Mapper (ORM)                 | Simplifies database interactions, migrations, and model definitions for MySQL. |
| JSON Web Tokens (`jsonwebtoken`) | Authentication & Authorization             | Secure, stateless token-based authentication for protecting API routes.      |
| `bcryptjs`                  | Password Hashing                               | Robust and secure hashing algorithm for storing user passwords safely.       |
| `express-validator`         | Request Validation Middleware                  | Streamlines and standardizes API input validation, improving data integrity. |
| `multer`                    | Middleware for Handling `multipart/form-data`  | Facilitates file uploads (e.g., venue images, profile pictures) to the server. |
| `nodemailer`                | Email Sending Module                           | Flexible and easy-to-use module for sending emails (e.g., booking confirmations, password resets). |
| `dotenv`                    | Environment Variable Management                | Loads environment variables from a `.env` file, enhancing configuration security and flexibility. |
| `helmet`, `cors`, `express-rate-limit`, `compression` | Security & Performance Enhancements    | Provides essential security headers, enables cross-origin resource sharing, prevents abuse, and optimizes data transfer. |
| `swagger-ui-express`, `swagger-jsdoc` | API Documentation Generation & UI      | Automates API documentation, making it easy for consumers to understand and interact with the API endpoints. |
| `morgan`                    | HTTP Request Logger Middleware                 | For logging HTTP requests, aiding in debugging and monitoring the API.        |
| **Development Tools:**      |                                                |                                                                              |
| Nodemon                     | Hot-Reloading Development Server               | Automatically restarts the Node.js application upon file changes during development. |
| `ts-node`                   | TypeScript Execution Environment               | Allows direct execution of TypeScript files without prior compilation during development. |
| Jest                        | Testing Framework                              | Robust and widely adopted framework for unit and integration testing of the backend. |

## 🚀 Getting Started

To get QuickCourt up and running on your local machine, follow these instructions.

### Prerequisites

Before you begin, ensure you have the following installed:

*   **Node.js**: `v18.x` or higher (includes npm)
*   **npm**: `v9.x` or higher (usually comes with Node.js)
*   **MySQL**: A running MySQL database instance.

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Darsh-8-Team-Cupertino-QuickCourt-44d4c5c/quickcourt.git
    cd quickcourt
    ```

2.  **Backend Setup:**

    Navigate into the `backend` directory and install its dependencies.

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the `backend` directory by copying `.env.example` and filling in your database credentials and other necessary configurations.

    ```bash
    cp .env.example .env
    # Open .env and configure your MySQL connection string, JWT secret, etc.
    ```

    Set up the database schema and seed initial data:

    ```bash
    npm run setup-db
    npm run seed # Optional: Populates the database with sample data
    ```

    Then, navigate back to the project root:

    ```bash
    cd ..
    ```

3.  **Frontend Setup:**

    Install the frontend dependencies from the project root directory:

    ```bash
    npm install
    ```

## 🔧 Usage

Follow these steps to run the QuickCourt application locally.

1.  **Start the Backend Server:**

    Open your first terminal, navigate to the `backend` directory, and start the development server:

    ```bash
    cd backend
    npm run dev
    ```
    The backend API will typically be available at `http://localhost:3000` (or the port specified in your `.env` file). The API documentation will be accessible at `/api-docs`.

2.  **Start the Frontend Application:**

    Open a second terminal, navigate to the project root directory, and start the frontend development server:

    ```bash
    cd .. # Ensure you are in the project root
    npm run dev
    ```
    The frontend application will typically be available at `http://localhost:5173` (or the port specified by Vite).

3.  **Explore the Application:**

    Open your web browser and navigate to the frontend URL (e.g., `http://localhost:5173`). You can now register, log in, browse venues, and make bookings.

    **Example API Request (using `curl`):**

    You can test the backend directly using `curl`. For instance, to fetch a list of venues:

    ```bash
    curl -X GET http://localhost:3000/api/v1/venues
    ```
    (Note: The exact endpoint might vary based on your API versioning and routing).

## 🤝 Contributing

We welcome contributions to QuickCourt! If you're interested in improving the project, please follow these guidelines:

1.  **Fork** the repository.
2.  **Create a new branch** for your feature or bug fix: `git checkout -b feature/your-feature-name`.
3.  **Make your changes** and ensure they adhere to the existing code style.
4.  **Write clear, concise commit messages.**
5.  **Push your branch** to your forked repository.
6.  **Open a Pull Request** to the `main` branch of the original QuickCourt repository, describing your changes in detail.

## 📝 License

QuickCourt is distributed under the MIT License. See the `LICENSE` file in the `backend` directory for more information.
