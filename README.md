# MealMate – Backend Service

MealMate is a backend service for managing meals, users, preferences, and personalized meal recommendations.  
The service is built with **Node.js**, **Express**, and **MongoDB**, following a clean and scalable layered architecture.

## 🚀 Features

- User management: registration, login, profile
- Meal management (CRUD operations)
- User dietary preferences & restrictions
- Recommendation engine based on user profile and meal metadata
- Image upload support (Cloudinary or local)
- JWT Authentication & role-based access
- Input validation with Joi
- Centralized error handling & logging
- Environment-based configuration
- Separation into Controllers, Services, and Repositories for clean maintainability


## 📡 API Endpoints (Examples)

### Auth
- `POST /auth/register`
- `POST /auth/login`

### Meals
- `POST /meals`
- `GET /meals`
- `GET /meals/:id`
- `PUT /meals/:id`
- `DELETE /meals/:id`

### Preferences
- `GET /preferences/:userId`
- `PUT /preferences/:userId`

### Recommendations
- `GET /recommendations/:userId`

## 🗄 Technologies

- **Node.js** (Express)
- **MongoDB** with Mongoose
- **JWT Authentication**
- **Cloudinary / Multer** for image uploads
- **Joi** schema validation
- **Dotenv** for environment variables
