import express from 'express';
import { createRecipe, getAllRecipes } from '../controllers/recipesController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const recipesRouter = express.Router();


recipesRouter.post('/', authMiddleware, createRecipe);
recipesRouter.get('/', getAllRecipes);

export default recipesRouter;