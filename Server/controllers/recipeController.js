import Recipe from "../models/RecipeModel.js";


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



