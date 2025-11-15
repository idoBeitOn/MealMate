import express from 'express';
import { createRecipe, getAllRecipes, toggleLikeRecipe } from '../controllers/recipeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const recipesRouter = express.Router();


recipesRouter.post('/', authMiddleware, createRecipe);
recipesRouter.post('/:id/like', authMiddleware, toggleLikeRecipe);
recipesRouter.get('/', getAllRecipes);

export default recipesRouter;