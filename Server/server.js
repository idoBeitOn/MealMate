import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRouter from './routes/authRoutes.js';

dotenv.config(); // Load environment variables from .env file

const app = express();// Create an Express application - the actual server
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Middleware to parse JSON bodies - Allows the server to understand JSON in requests (POST, PUT, etc.)

const PORT = process.env.PORT || 8080; //The port which the server listens to,
                                      // Use the PORT from environment variables or default to 8080

app.get("/", (req, res) => { //
  res.send("MealMate backend is running!");
});

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


// Use the auth routes for any requests to /api/auth
app.use('/api/auth', authRouter);