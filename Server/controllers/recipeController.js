import Recipe from "../models/RecipeModel.js";
import CategoryModel from "../models/CategoryModel.js";
import mongoose from "mongoose";

export const createRecipe = async (req, res) => {
    try {
        const {
            title,
            description,
            ingredients,
            steps,
            nutrition,
            cookTime,
            difficulty,
            category,
            images,
            isPublic
        } = req.body;

        if (!title || !description || !ingredients || !Array.isArray(ingredients)) {
            return res.status(400).json({ 
                message: 'Title, description and ingredients array are required'
            });
        }

        const newRecipe = new Recipe({
            title,
            description,
            ingredients,
            steps: steps || [],
            nutrition: nutrition || {
                calories: 0,
                fat: 0,
                carbohydrates: 0,
                protein: 0
            },
            cookTime: cookTime || 0,
            difficulty: difficulty || 'easy',
            category: category || null, // NOT "General"
            images: images || [],
            isPublic: typeof isPublic === 'boolean' ? isPublic : true,
            author: req.user.id
        });

        await newRecipe.save();

        res.status(201).json({
            message: 'Recipe created successfully',
            recipe: newRecipe
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find()
            .populate('author', 'username email') 
            .populate('category', 'name')         
            .sort({ createdAt: -1 });             

        res.status(200).json(recipes);

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

export const toggleLikeRecipe = async (req, res) => {
    try {
        const userId = req.user.id;
        const recipeId = req.params.id;

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        if (!recipe.likedBy) recipe.likedBy = [];

        const index = recipe.likedBy.indexOf(userId);

        if (index === -1) {
            recipe.likedBy.push(userId);
        } else {
            recipe.likedBy.splice(index, 1);
        }

        recipe.likesCount = recipe.likedBy.length;

        await recipe.save();
        res.status(200).json({ 
            message: index === -1 ? "Liked" : "Unliked",
            likesCount: recipe.likesCount 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};

export const searchRecipes = async (req, res) => {
    try {
        
        const {
            q,                  
            category,           
            difficulty,         
            maxCookTime,        
            sortBy,             
            author,             
            model               
        } = req.query;

        
        let filter = {};

        if (q) {
            
            filter.$text = { $search: q };
        }

        if (category && mongoose.Types.ObjectId.isValid(category)) {
            filter.category = category;
        }

        if (difficulty) {
            filter.difficulty = difficulty;
        }

        if (maxCookTime) {
            filter.cookTime = { $lte: Number(maxCookTime) };
        }

        if (author && mongoose.Types.ObjectId.isValid(author)) {
            filter.author = author;
        }

        if (model) {
            filter.model = model;
        }

        
        let sort = { createdAt: -1 }; 

        if (sortBy === "likes") {
            sort = { likesCount: -1 }; 
        } else if (sortBy === "createdAt") {
            sort = { createdAt: -1 }; 
        } else if (sortBy === "trending") {
            
            const sevenDaysAgo = new Date();
            sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
            filter.createdAt = { $gte: sevenDaysAgo };
            sort = { likesCount: -1 };
        }

        
        const recipes = await Recipe.find(filter)
            .populate('author', 'username email')   
            .populate('category', 'name')           
            .sort(sort);                             

        
        res.status(200).json(recipes);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
