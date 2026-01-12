import express from "express";
import {
    createMeal,
    getMealsForUser,
    updateMeal,
    deleteMeal
} from "../controllers/mealController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const mealRoutes = express.Router();

// Create a meal slot for the authenticated user
mealRoutes.post("/", authMiddleware, createMeal);

// Get all meals for the authenticated user
mealRoutes.get("/", authMiddleware, getMealsForUser);

// Update a meal owned by the authenticated user
mealRoutes.put("/:mealId", authMiddleware, updateMeal);

// Delete a meal owned by the authenticated user
mealRoutes.delete("/:mealId", authMiddleware, deleteMeal);

export default mealRoutes;
