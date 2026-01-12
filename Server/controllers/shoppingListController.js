import ShoppingList from "../models/ShoppingListModel.js";
import Meal from "../models/MealModel.js";

// --- Generate shopping list from meals ---
export const generateShoppingList = async (req, res) => {
    try {
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        /*
        Meal.find({ userId }) → gets all meals for this user
        .populate("recipeId", "ingredients") → for each meal, replaces the recipeId reference with the actual recipe object,
        but only including ingredients.
        */
        const meals = await Meal.find({ userId }).populate("recipeId", "ingredients");

        /*
        itemsMap is a plain JavaScript object used to deduplicate ingredients.
        all ingredients are collected once, even if multiple meals contain the same ingredient.
        */
        const itemsMap = {};
        meals.forEach(meal => {
            if (meal.recipeId && meal.recipeId.ingredients) {
                meal.recipeId.ingredients.forEach(ing => {
                    const key = ing.name.toLowerCase();
                    if (!itemsMap[key]) {
                        itemsMap[key] = { name: ing.name, amount: ing.amount || "", source: "meal" };
                    }
                });
            }
        });

       /*
       findOneAndUpdate:
       Finds existing shopping list for the user
       Updates items with the collected ingredients
       */
        const shoppingList = await ShoppingList.findOneAndUpdate(
            { user: userId },
            { items: Object.values(itemsMap) },//converts the map into an array for MongoDB Options
            { new: true, upsert: true }//new: true → return the updated document instead of the old one
                                       //upsert: true → create a new document if none exists
        );

        res.status(200).json(shoppingList);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// --- Add manual item ---
export const addManualItem = async (req, res) => {
    try {
        const userId = req.user?.id;
        const { name, amount } = req.body;

        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        if (!name) return res.status(400).json({ message: "Item name is required" });

        const list = await ShoppingList.findOneAndUpdate(
            { user: userId },
            { $push: { items: { name, amount: amount || "", source: "manual" } } },
            { new: true, upsert: true }
        );

        res.status(201).json(list);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// --- Delete item ---
export const deleteItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const list = await ShoppingList.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        );

        res.status(200).json(list);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

// --- Toggle purchased status ---
export const togglePurchased = async (req, res) => {
    try {
        const { itemId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Authentication required" });
        }

        const list = await ShoppingList.findOne({ user: userId });
        if (!list) return res.status(404).json({ message: "Shopping list not found" });

        const item = list.items.id(itemId);
        if (!item) return res.status(404).json({ message: "Item not found" });

        item.purchased = !item.purchased;

        await list.save();
        res.status(200).json(list);

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
