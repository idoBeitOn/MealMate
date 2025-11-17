import Meal from "../models/MealModel.js";

// --- Create a meal ---
export const createMeal = async (req, res) => {
    try {
        const { userId, dayOfWeek, timeSlot, recipeId, customName, notes } = req.body;

        if (!userId || dayOfWeek === undefined || timeSlot === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const meal = await Meal.create({
            userId,
            dayOfWeek,
            timeSlot,
            recipeId: recipeId || null,
            customName: customName || null,
            notes: notes || ""
        });

        res.status(201).json({ message: "Meal created successfully", meal });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Meal slot already taken (day + timeSlot must be unique)"
            });
        }

        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// --- Get all meals for a user ---
export const getMealsForUser = async (req, res) => {
    try {
        const { userId } = req.params;

        const meals = await Meal.find({ userId })
            .populate("recipeId", "title images cookTime");

        res.status(200).json(meals);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// --- Update a meal ---
export const updateMeal = async (req, res) => {
    try {
        const { mealId } = req.params;
        const updateData = req.body;

        const updated = await Meal.findByIdAndUpdate(mealId, updateData, {
            new: true
        });

        if (!updated) {
            return res.status(404).json({ message: "Meal not found" });
        }

        res.status(200).json({ message: "Meal updated", meal: updated });

    } catch (error) {
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Cannot update meal: duplicate time slot"
            });
        }

        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// --- Delete a meal ---
export const deleteMeal = async (req, res) => {
    try {
        const { mealId } = req.params;

        const deleted = await Meal.findByIdAndDelete(mealId);

        if (!deleted) {
            return res.status(404).json({ message: "Meal not found" });
        }

        res.status(200).json({ message: "Meal deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
