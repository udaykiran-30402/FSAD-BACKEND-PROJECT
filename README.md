<<<<<<< HEAD
# TribalCraft Connect - Vite + React Frontend

A complete frontend project for **TribalCraft Connect - Promote Value-Added Handicrafts** built with:

- Vite + React
- React Router DOM
- Tailwind CSS
- Mock role-based authentication via localStorage

## Run the project

```bash
npm install
npm run dev
```

## Role-based test login

On `/login`, pick one role:

- `admin`
- `artisan`
- `customer`
- `consultant` (Cultural Consultant)

User session is stored in `localStorage` key: `tribalcraft_user`.

## Project structure

```text
src/
  components/
  pages/
  layouts/
  routes/
  data/
  context/
  App.jsx
```
=======
# Tribal Connect Backend

Backend folder: `backend`
Base package: `com.tribalconnect`

## Stack
- Spring Boot
- Java 17
- Maven
- MySQL
- Spring Data JPA
- Lombok
- REST API

## Run
```bash
cd backend
mvn spring-boot:run
```

## Database
- Host: `localhost:3306`
- Database: `tribal_connect`
- Username: `root`
- Password: `uday1234,.`

## Endpoints
- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/products`
- `GET /api/products/{id}`
- `POST /api/products`
- `PUT /api/products/{id}`
- `DELETE /api/products/{id}`
- `POST /api/orders`
- `GET /api/orders`
- `GET /api/orders/user/{id}`
- `POST /api/reviews`
- `GET /api/reviews/product/{id}`
>>>>>>> 2737033a05bc0354aba5684078f62b70d5169dc0
