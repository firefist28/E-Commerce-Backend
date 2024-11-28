# E-Commerce-Backend
Backend App developed using NodeJs and Mongo DB for E-Commerce Web App. Project includes:

- Frontend: Built with React, styled using Bootstrap, and Redux for role-based access control (RBAC). Features include user authentication, product search, pagination, cart management, and order placement.
- Backend: Express.js APIs with middleware for token validation and role authorization. Incorporates session expiry management and robust error handling.
- Database: MongoDB with models for users, products, cart, and orders.

Key Features:
- User authentication with JWT.
- Role-based access control for admin and user functionalities.
- Axios interceptors for secure API calls.
- Toast notifications for alerts.
- Pagination for product listing.
- Protected routes for authorized access.

This scalable and responsive platform provides a strong foundation for further enhancements.

Getting Started
Follow these steps to set up and run the project locally:

Prerequisites
Make sure to have Node.js, MongoDB and npm installed.

Steps
1. Clone the Repositories
   Clone the frontend repository:
   https://github.com/firefist28/E-Commerce-Frontend

   Clone the backend repository:
   git clone https://github.com/firefist28/E-Commerce-Backend
2. Setup Mongo Db - e-commerce
3. Make necessary changes in .env file as per your need.
4. Install Dependencies
   run -> npm install
5. Run the Application
   run -> nodemon
6. Access APIs
   http://localhost:5000/<endpoints>
   

