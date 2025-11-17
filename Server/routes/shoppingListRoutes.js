import express from "express";
import {
    generateShoppingList,
    addManualItem,
    deleteItem,
    togglePurchased
} from "../controllers/shoppingListController.js";

const shoppingListrouter = express.Router();

// Generate shopping list from user's meals
shoppingListrouter.get("/:userId", generateShoppingList);

// Add manual item
shoppingListrouter.post("/:userId/items", addManualItem);

// Delete item
shoppingListrouter.delete("/:userId/items/:itemId", deleteItem);

// Toggle purchased
shoppingListrouter.put("/:userId/items/:itemId/toggle", togglePurchased);

export default shoppingListrouter;
