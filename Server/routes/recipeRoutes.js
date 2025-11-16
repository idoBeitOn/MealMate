import express from 'express';
import { createRecipe, getAllRecipes, toggleLikeRecipe, searchRecipes } from '../controllers/recipeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const recipesRouter = express.Router();


recipesRouter.post('/', authMiddleware, createRecipe);
recipesRouter.post('/:id/like', authMiddleware, toggleLikeRecipe);
recipesRouter.get('/', getAllRecipes);
recipesRouter.get('/search', authMiddleware, searchRecipes);

export default recipesRouter;