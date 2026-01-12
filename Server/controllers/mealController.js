import Meal from "../models/MealModel.js";

// --- Create a meal ---
export const createMeal = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { dayOfWeek, timeSlot, recipeId, customName, notes } = req.body;

        // userId comes from JWT; dayOfWeek and timeSlot must be provided
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
        /*
        MongoDB duplicate key error → Happens when a unique index is violated.  
        A user cannot have two meals on the same day and time slot.
        */
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Meal slot already taken (day + timeSlot must be unique)"
            });
        }

        res.status(500).json({ message: "Server error", error: error.message });
    }
};



// --- Get all meals for a user ---

/*
populate() tells Mongoose:
“Instead of giving me just the ID reference stored in the document, go fetch the actual related document
 from the other collection.”
A way to automatically fetch related documents
✔ Equivalent to a JOIN in SQL
✔ Replaces ObjectId references with full objects
✔ Lets you pick only specific fields
*/
export const getMealsForUser = async (req, res) => {
    try {
        const userId = req.user?.id;

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
        const updateData = { ...req.body };
        const userId = req.user?.id;

        // Never allow changing ownership
        delete updateData.userId;

        const updated = await Meal.findOneAndUpdate(
            { _id: mealId, userId },
            updateData,
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ message: "Meal not found or not owned by user" });
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
        const userId = req.user?.id;

        const deleted = await Meal.findOneAndDelete({ _id: mealId, userId });

        if (!deleted) {
            return res.status(404).json({ message: "Meal not found or not owned by user" });
        }

        res.status(200).json({ message: "Meal deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
