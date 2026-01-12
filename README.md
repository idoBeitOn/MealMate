# 🍽️ MealMate — Smart Meal Planning & Shopping List Backend

A clean and scalable **Node.js + Express + MongoDB** backend for managing recipes, meals, users, comments, favorites, and automatically generated shopping lists.  
Built with a **layered architecture** (controllers → models) and production-style API design.

---

## 🚀 Features

### 👤 User Management
- JWT-based authentication  
- Secure password hashing  
- Login & registration APIs  

### 📚 Recipe System
- Create / update / delete recipes  
- Each recipe contains ingredients, steps, metadata  
- Like & unlike recipes  
- Save favorites  
- Search recipes  
- Fetch all recipes or by user  

### 🍽️ Meal Planning
- Assign recipes to meals throughout the week  
- Manage weekly meal schedules  
- Fetch all meals for a user  
- Update or delete meals  

### 🛒 Smart Shopping Lists (Auto-Generated)
- Generates a complete shopping list based on the user’s meals  
- **Deduplicates ingredients** across all recipes  
- Supports manual item additions  
- Toggle “purchased” state  
- Remove items  
- Shopping list auto-synchronizes when meals update  

---



## 🧪 Tech Stack

- **Node.js**  
- **Express.js**  
- **MongoDB + Mongoose**  
- **JWT Authentication**  
- **Bcrypt**  
- **REST API Design**  

---

## 📄 API Highlights

### 🔑 Authentication
- `POST /auth/register`
- `POST /auth/login`

### 🥘 Recipes
- `POST /recipes` — Create recipe  
- `GET /recipes` — Get all recipes  
- `POST /recipes/:id/like` — Like/unlike  
- `POST /recipes/:id/favorite` — Add to favorites  
- `GET /recipes/search` — Search  

### 🍽️ Meals
- `POST /meals` — Create meal  
- `GET /meals/:userId` — Get all user meals  
- `PUT /meals/:mealId` — Update meal  
- `DELETE /meals/:mealId` — Delete meal  

### 🛒 Shopping List
- `GET /shopping-list/:userId` — Auto-generate list  
- `POST /shopping-list/:userId/items` — Add manual item  
- `DELETE /shopping-list/:userId/items/:itemId` — Delete item  
- `PUT /shopping-list/:userId/items/:itemId/toggle` — Toggle purchased  


<<<<<<< Updated upstream
=======
**Note:** 🔒 indicates endpoints that require JWT authentication token in `Authorization: Bearer <token>` header.

---

## 📚 API Documentation

### Postman Collection
A complete Postman collection is included: `MealMate_API.postman_collection.json`

**To use:**
1. Import the collection into Postman
2. Run Register or Login request (token saves automatically)
3. Test all endpoints with pre-configured requests

See `POSTMAN_SETUP.md` for detailed setup instructions.

### Example Request

**Register User:**
```bash
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Create Recipe (Authenticated):**
```bash
POST http://localhost:8080/api/recipes
Authorization: Bearer <your-jwt-token>
Content-Type: application/json

{
  "title": "Chicken Curry",
  "description": "Delicious spicy chicken curry",
  "ingredients": [
    { "name": "Chicken", "amount": "500g" },
    { "name": "Curry Powder", "amount": "2 tbsp" }
  ],
  "steps": ["Heat oil", "Add chicken", "Add spices"],
  "cookTime": 30,
  "difficulty": "medium",
  "isPublic": true
}
```

---

## 🏗️ Project Structure

```
MealMate/
├── Server/
│   ├── controllers/       # Request handlers
│   │   ├── authController.js
│   │   ├── recipeController.js
│   │   ├── mealController.js
│   │   ├── commentController.js
│   │   └── shoppingListController.js
│   ├── models/            # MongoDB schemas
│   │   ├── UserModel.js
│   │   ├── RecipeModel.js
│   │   ├── MealModel.js
│   │   ├── CommentModel.js
│   │   └── shoppingListModel.js
│   ├── routes/            # API routes
│   │   ├── authRoutes.js
│   │   ├── recipeRoutes.js
│   │   ├── mealRoutes.js
│   │   ├── commentRoutes.js
│   │   └── shoppingListRoutes.js
│   ├── middleware/        # Custom middleware
│   │   ├── authMiddleware.js
│   │   ├── validation.js
│   │   └── errorHandler.js
│   ├── config/            # Configuration
│   │   └── envValidation.js
│   └── server.js          # Entry point
├── Client/                # React frontend (optional)
├── MealMate_API.postman_collection.json
├── POSTMAN_SETUP.md
└── README.md
```

---

## 🔒 Security Features

- ✅ JWT authentication on all protected routes
- ✅ Password hashing with bcrypt
- ✅ Input validation middleware
- ✅ User ownership validation (users can only modify their own resources)
- ✅ Environment variable validation
- ✅ Standardized error handling (no sensitive data leakage)
- ✅ CORS enabled for frontend integration

---

## 🧪 Testing

The API can be tested using:
- **Postman Collection** (recommended) - Import `MealMate_API.postman_collection.json`
- **cURL** commands
- **Thunder Client** (VS Code extension)
- Any HTTP client

---

## 📝 Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port | No | 8080 |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `JWT_SECRET` | Secret key for JWT tokens | Yes | - |

---

## 🎯 Key Improvements Made

- ✅ **Security**: All routes properly protected with authentication middleware
- ✅ **Validation**: Input validation for auth endpoints
- ✅ **Error Handling**: Standardized error responses across all endpoints
- ✅ **Documentation**: Complete Postman collection with examples
- ✅ **Production Ready**: Environment validation, health checks, proper error handling
- ✅ **Code Quality**: Clean architecture, consistent patterns

---

## 🚧 Future Enhancements (Optional)

- [ ] Integration tests with Jest + Supertest
- [ ] Rate limiting
- [ ] Password reset functionality
- [ ] Image upload for recipes
- [ ] Pagination for recipe feeds
- [ ] Recipe categories management
- [ ] User profiles

---

## 📄 License

This project is part of a portfolio demonstration.

---

## 👤 Author

Built as a portfolio project demonstrating:
- RESTful API design
- Authentication & authorization
- Database modeling with MongoDB
- Production-ready backend practices
- API documentation

---

**Note:** This is a backend-focused project. The frontend (React) is minimal and optional. The API is fully functional and can be tested independently using the provided Postman collection.
>>>>>>> Stashed changes
