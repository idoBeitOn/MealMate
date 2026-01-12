import express from "express";
import {
    addComment,
    getCommentsByRecipe,
    deleteComment
} from "../controllers/commentController.js";

//authMiddleware → middleware that checks for a valid JWT; used to protect routes that require authentication.
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();



//Checks JWT token in the Authorization header.
//If valid → req.user is populated and addComment runs.
//If invalid → request is rejected with 401 Unauthorized.
router.post("/", authMiddleware, addComment);

router.get("/:recipeId", getCommentsByRecipe);

router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
