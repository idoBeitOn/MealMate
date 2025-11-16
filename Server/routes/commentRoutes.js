import express from "express";
import {
    addComment,
    getCommentsByRecipe,
    deleteComment
} from "../controllers/commentController.js";

import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/", authMiddleware, addComment);
router.get("/:recipeId", getCommentsByRecipe);
router.delete("/:commentId", authMiddleware, deleteComment);

export default router;
