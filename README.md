# 🍽️ MealMate — Smart Meal Planning & Shopping List Backend

A production-ready **Node.js + Express + MongoDB** backend API for managing recipes, meals, users, comments, favorites, and automatically generated shopping lists.  
Built with a **layered architecture** (controllers → models) and production-style API design.

---

## ✨ Features

### 👤 User Management
- JWT-based authentication with secure password hashing
- Input validation for registration and login
- Protected routes with middleware
- Login & registration APIs

### 📚 Recipe System
- Create / update / delete recipes (with authorization checks)
- Rich recipe data: ingredients, steps, nutrition info, cook time, difficulty
- Like & unlike recipes
- Save favorites
- Advanced search with filters (difficulty, cook time, category, sorting)
- Fetch all recipes or filter by author
- Full-text search on titles, descriptions, and ingredients

### 💬 Social Features
- Add comments to recipes
- View comments by recipe
- Delete own comments
- Like/unlike recipes
- Favorite/unfavorite recipes

### 🍽️ Meal Planning
- Assign recipes to meals throughout the week
- Manage weekly meal schedules (dayOfWeek: 0-6, timeSlot: 0-10)
- Fetch all meals for authenticated user
- Update or delete meals (with ownership validation)
- Unique meal slots per user (prevents duplicates)

### 🛒 Smart Shopping Lists (Auto-Generated)
- **Automatically generates** shopping list from user's meal plan
- **Deduplicates ingredients** across all recipes
- Supports manual item additions
- Toggle "purchased" state
- Remove items
- Shopping list auto-synchronizes when meals update

### 🛡️ Production Features
- Input validation middleware
- Standardized error handling
- Environment variable validation
- Health check endpoint
- Comprehensive API documentation (Postman collection)
- Secure authentication on all protected routes

---

## 🧪 Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB + Mongoose** - Database & ODM
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing
- **REST API Design** - Clean, RESTful endpoints

---

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd MealMate
```

### 2. Install Dependencies
```bash
cd Server
npm install
```

### 3. Environment Setup
Create a `.env` file in the `Server` directory:
```env
PORT=8080
MONGO_URI=mongodb://localhost:27017/mealmate
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
```

### 4. Start MongoDB
Make sure MongoDB is running on your system, or use MongoDB Atlas connection string.

### 5. Start the Server
```bash
npm start
```

The server will start on `http://localhost:8080` (or your configured PORT).

### 6. Verify Installation
```bash
curl http://localhost:8080/health
```

You should see:
```json
{
  "status": "ok",
  "timestamp": "2024-...",
  "database": "connected",
  "uptime": 1.234
}
```

---

## 📄 API Endpoints

### 🔑 Authentication
- `POST /api/auth/register` - Register new user (requires: username, email, password)
- `POST /api/auth/login` - Login user (requires: email, password)

### 🥘 Recipes
- `POST /api/recipes` - Create recipe (🔒 Auth required)
- `GET /api/recipes` - Get all public recipes
- `GET /api/recipes/search` - Search recipes with filters (🔒 Auth required)
- `PUT /api/recipes/:id` - Update recipe (🔒 Auth required, author only)
- `DELETE /api/recipes/:id` - Delete recipe (🔒 Auth required, author only)
- `POST /api/recipes/:id/like` - Toggle like on recipe (🔒 Auth required)
- `POST /api/recipes/:id/favorite` - Add to favorites (🔒 Auth required)
- `DELETE /api/recipes/:id/favorite` - Remove from favorites (🔒 Auth required)

### 💬 Comments
- `POST /api/comments` - Add comment to recipe (🔒 Auth required)
- `GET /api/comments/:recipeId` - Get all comments for a recipe
- `DELETE /api/comments/:commentId` - Delete comment (🔒 Auth required, author only)

### 🍽️ Meals
- `POST /api/meals` - Create meal slot (🔒 Auth required)
- `GET /api/meals` - Get all meals for authenticated user (🔒 Auth required)
- `PUT /api/meals/:mealId` - Update meal (🔒 Auth required, owner only)
- `DELETE /api/meals/:mealId` - Delete meal (🔒 Auth required, owner only)

### 🛒 Shopping List
- `GET /api/shopping-list` - Generate shopping list from meals (🔒 Auth required)
- `POST /api/shopping-list/items` - Add manual item (🔒 Auth required)
- `DELETE /api/shopping-list/items/:itemId` - Delete item (🔒 Auth required)
- `PUT /api/shopping-list/items/:itemId/toggle` - Toggle purchased status (🔒 Auth required)

### 🏥 Health Check
- `GET /health` - Server health and database status

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

- RESTful API design
- Authentication & authorization
**Note:** This is a backend-focused project. The frontend (React) is minimal and optional. The API is fully functional and can be tested independently using the provided Postman collection.
