import express from "express";
import {
    generateShoppingList,
    addManualItem,
    deleteItem,
    togglePurchased
} from "../controllers/shoppingListController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const shoppingListrouter = express.Router();

// Generate shopping list from user's meals
shoppingListrouter.get("/:userId", authMiddleware, generateShoppingList);

// Add manual item
shoppingListrouter.post("/:userId/items", authMiddleware, addManualItem);

// Delete item
shoppingListrouter.delete("/:userId/items/:itemId", authMiddleware, deleteItem);

// Toggle purchased
shoppingListrouter.put("/:userId/items/:itemId/toggle", authMiddleware, togglePurchased);

export default shoppingListrouter;
