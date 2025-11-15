import mongoose from "mongoose";
import User from "./User";

const likeSchema = new mongoose.Schema({
  id: string,
  userId: string,             
  recipeId: string,           
  createdAt: Date
});

export default mongoose.model('Like', likeSchema);
