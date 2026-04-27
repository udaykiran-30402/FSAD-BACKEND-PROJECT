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
