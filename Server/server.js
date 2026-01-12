import express from 'express';// web framework for Node.js, handles routing, middleware, HTTP requests/responses.
import cors from 'cors';//enables Cross-Origin Resource Sharing, so your frontend (React) can call the backend.
import mongoose from 'mongoose';//MongoDB ODM, defines schemas/models and handles DB queries.
import dotenv from 'dotenv';//loads environment variables from a .env file.
import authRouter from './routes/authRoutes.js';
import recipesRouter from './routes/recipeRoutes.js';
import commentRoutes from "./routes/commentRoutes.js";
import mealRouter from "./routes/mealRoutes.js";
import shoppingListrouter from "./routes/shoppingListroutes.js"
import { errorHandler } from './middleware/errorHandler.js';
import { validateEnv } from './config/envValidation.js';

dotenv.config(); // Load environment variables from .env file
//reads variables like PORT or MONGO_URI from .env

// Validate required environment variables
try {
  validateEnv();
} catch (error) {
  console.error('Environment validation failed:', error.message);
  process.exit(1);
}


const app = express();// Create an Express application - the actual server

app.use(cors()); // Enable CORS for all routes, allows your frontend to make requests from a different origin

app.use(express.json()); // Middleware to parse JSON bodies -
                        // Allows the server to understand JSON payloads in requests (POST, PUT, etc.)



const PORT = process.env.PORT || 8080; //The port which the server listens to,
                                      // Use the PORT from environment variables or default to 8080






// Use the auth routes for any requests to /api/auth
app.use('/api/auth', authRouter);

// Use the recipe routes for any requests to /api/recipes
app.use('/api/recipes', recipesRouter);

app.use("/api/comments", commentRoutes);

app.use("/api/meals", mealRouter);

app.use("/api/shopping-list", shoppingListrouter);

app.get("/", (req, res) => { //
  res.send("MealMate backend is running!");
});

// Health check endpoint
app.get("/health", (req, res) => {
  const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime()
  });
});

// Error handling middleware (must be after all routes)
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


// Connect to MongoDB using Mongoose
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log(" MongoDB connected"))
.catch((err) => console.log(" MongoDB connection error:", err));







/*
[React Frontend / Postman]
           |
           |  HTTP Request (e.g., POST /api/auth/register)
           v
   -----------------------
   |     Node.js         |  <-- Node executes server.js, event loop handles incoming requests
   -----------------------
           |
           v
   -----------------------
   |     Express         |  <-- Express handles routing & middleware
   -----------------------
           |
           |-- Middleware
           |   - CORS: allows cross-origin requests
           |   - express.json(): parses JSON body
           |   - authMiddleware (if route is protected)
           |
           v
   -----------------------
   |       Router         |  <-- Routes defined in authRoutes, recipeRoutes, etc.
   -----------------------
           |
           v
   -----------------------
   |     Controller       |  <-- Controller logic for request
   | (e.g., authController.register) 
   | - Validate input
   | - Hash password (bcrypt)
   | - Generate JWT
   | - Call Mongoose model
   -----------------------
           |
           v
   -----------------------
   |      Mongoose        |  <-- ODM layer
   -----------------------
           |
           |-- Connects to MongoDB
           |-- Queries DB: find, save, update
           |-- Returns data to controller
           v
   -----------------------
   |     MongoDB          |  <-- Stores collections (users, recipes, meals)
   -----------------------
           |
           v
   -----------------------
   |    Controller        |  <-- Receives DB result
   | - Builds response JSON
   | - Sends response to Express
   -----------------------
           |
           v
   -----------------------
   |     Express          |  <-- Sends HTTP response back to client
   -----------------------
           |
           v
[React Frontend / Postman]
   - Receives response JSON
   - Updates UI accordingly





   Key Points

Node: runs your backend server, handles requests asynchronously using the event loop.
Express: routes requests to the correct controller and handles middleware.
Middleware: can process requests before they reach the controller (CORS, JSON parsing, authentication).
Controller: contains the business logic, validates input, calls Mongoose for DB access.
Mongoose: communicates with MongoDB using schemas and models.
MongoDB: stores and retrieves your data collections.
Response: flows back through controller → Express → client.
*/

