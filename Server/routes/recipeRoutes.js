import express from 'express';
import { createRecipe, getAllRecipes, toggleLikeRecipe, searchRecipes } from '../controllers/recipeController.js';
import { updateRecipe, deleteRecipe } from '../controllers/recipeController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import {addFavorite, removeFavorite} from '../controllers/recipeController.js';

const recipesRouter = express.Router();


recipesRouter.post('/', authMiddleware, createRecipe);
recipesRouter.post('/:id/like', authMiddleware, toggleLikeRecipe);
recipesRouter.get('/', getAllRecipes);
recipesRouter.get('/search', authMiddleware, searchRecipes);
recipesRouter.put('/:id', authMiddleware, updateRecipe); 
recipesRouter.delete('/:id', authMiddleware, deleteRecipe);

router.post("/:id/favorite", addFavorite);
router.delete("/:id/favorite", removeFavorite);
router.get("/favorites/:userId", getFavoritesForUser);



export default recipesRouter;