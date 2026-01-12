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
            //If the user explicitly sends true or false, use it; otherwise, default to true.
            //ternary operator combined with JavaScript type checking.
            /*
            typeof returns the type of a value.
            typeof 10        // "number"
            typeof "hello"   // "string"
            typeof true      // "boolean"
            typeof null      // "object"
            typeof undefined // "undefined"

            */
            isPublic: typeof isPublic === 'boolean' ? isPublic : true,
            author: req.user.id// The logged-in user's ID
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




/*
retrieves all recipes from the database,
enriches them with referenced data (author & category), sorts them by newest first, and returns them.

*/
export const getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find()//without filters → returns ALL recipes
                                           //await means the function pauses while MongoDB runs the query
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
        const userId = req.user.id;//req.user.id comes from your auth middleware (JWT).
        const recipeId = req.params.id;//recipe ID from URL parameter.

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



/*
Supports:
Full-text search
Category filter
Difficulty filter
Max cook time filter
Filter by author
Filter by model type
Sorting (likes, date, trending)
Population of referenced fields
*/

export const searchRecipes = async (req, res) => {
    try {
        
        const {
            //Query parameters from the URL
            q,                  
            category,           
            difficulty,         
            maxCookTime,        
            sortBy,             
            author,             
            model               
        } = req.query;

        //Build a filter object dynamically
        let filter = {};

        if (q) {
            /*
            In MongoDB, any key that starts with $ is not a normal field — it is a MongoDB operator.
            | Operator  | What it does                    |
            | --------- | ------------------------------- |
            | `$text`   | full-text search                |
            | `$search` | the text you want to search for |
            | `$gte`    | greater than or equal           |
            | `$lte`    | less than or equal              |
            | `$or`     | logical OR                      |
            | `$in`     | matches any value in an array   |
            | `$set`    | update field                    |
            | `$push`   | push into array                 |
            Search for documents that match the text ‘text’ in any fields that have a full-text index
            If the user typed something in ?q=... → perform text search
            */
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



/*
This endpoint updates an existing recipe only if:
The recipe ID is valid
The recipe exists
The logged-in user is the author of the recipe
Only allowed fields are updated.



*/

export const updateRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: "Invalid recipe ID" });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        /*
        recipe.author is an ObjectId -> we convert it to string to compare with req.user.id (string).
        req.user.id comes from the JWT middleware.
        Only the author of the recipe can update it.
        */
        if (recipe.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to update this recipe" });
        }

        //This prevents users from updating fields they should not touch
       //(like _id, author, likesCount, likedBy, timestamps, etc.) 
     
        const allowedFields = [
            "title", "description", "ingredients", "steps",
            "nutrition", "cookTime", "difficulty",
            "category", "images", "isPublic"
        ];

    
       /*
       Loop through each allowed field. If the user included it in the request body,
       update that field on the recipe.
       empty string " " or 0 or false might be valid values
       and shouldn’t be ignored.
       */  
        allowedFields.forEach(field => {
            if (req.body[field] !== undefined) {
                recipe[field] = req.body[field];
            }
        });

        await recipe.save();

        const updatedRecipe = await Recipe.findById(recipeId)
            .populate("author", "username email")
            .populate("category", "name");

        res.status(200).json({ message: "Recipe updated successfully", recipe: updatedRecipe });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



export const deleteRecipe = async (req, res) => {
    try {
        const recipeId = req.params.id;
        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: "Invalid recipe ID" });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) {
            return res.status(404).json({ message: "Recipe not found" });
        }

        if (recipe.author.toString() !== req.user.id) {
            return res.status(403).json({ message: "You are not authorized to delete this recipe" });
        }

        await Recipe.findByIdAndDelete(recipeId);
        res.status(200).json({ message: "Recipe deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





// Allows a user to “favorite” a recipe once, preventing duplicates.
export const addFavorite = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Not authorized" });
        }

        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        // Prevent duplicates
        //favoritedBy is an array inside the recipe document.
        if (recipe.favoritedBy.includes(userId)) {
            return res.status(400).json({ message: "Already favorited" });
        }

        recipe.favoritedBy.push(userId);
        await recipe.save();

        res.status(200).json({ message: "Recipe favorited", recipe });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


// --- Remove recipe from favorites ---
export const removeFavorite = async (req, res) => {
    try {
        const { recipeId } = req.params;
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Not authorized" });
        }


        //A Mongoose query that returns a Promise.
        const recipe = await Recipe.findById(recipeId);
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });

        /*
        filter() creates a new array by keeping only elements that pass a condition.
        Here, we keep only those user IDs that are NOT equal to the given userId.
        This effectively removes the userId from the favoritedBy array.
        For each element in the array:
        - If the element's string representation is NOT equal to userId, it is kept.
        */
        recipe.favoritedBy = recipe.favoritedBy.filter(
            (id) => id.toString() !== userId
        );

        await recipe.save();

        res.status(200).json({ message: "Recipe removed from favorites", recipe });

    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


