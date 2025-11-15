import Recipe from "../models/Recipe";

export const createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, steps, nutrition, cookTime, difficulty, category, images, isPublic } = req.body;
        if (!title || !description || !ingredients)  {
            return res.status(400).json({ message: 'Title, description, ingredients are required' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }   
};

    