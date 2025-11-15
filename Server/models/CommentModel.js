import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
    id: string,
    recipeId: string,
    userId: string,
    text: string,
    createdAt: Date
})

export default mongoose.model('Comment', commentSchema);

