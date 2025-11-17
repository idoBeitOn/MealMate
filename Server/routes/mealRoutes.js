import express from "express";
import {
    createMeal,
    getMealsForUser,
    updateMeal,
    deleteMeal
} from "../controllers/mealController.js";

const mealRoutes = express.Router();

// Create a meal slot
mealRoutes.post("/", createMeal);

// Get all meals for a user (can pass userId as query or from auth later)
mealRoutes.get("/:userId", getMealsForUser);

// Update a meal
mealRoutes.put("/:mealId", updateMeal);

// Delete a meal
mealRoutes.delete("/:mealId", deleteMeal);

export default mealRoutes;
