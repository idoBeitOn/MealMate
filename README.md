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


