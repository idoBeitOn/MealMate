import Comment from "../models/CommentModel.js";
import mongoose from "mongoose";


export const addComment = async (req, res) => {
    try {
        const { recipeId, text } = req.body;

        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: "Invalid recipe ID" });
        }

        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const comment = new Comment({
            recipe: recipeId,
            user: req.user.id, 
            text
        });

        await comment.save();
        const populatedComment = await Comment.findById(comment._id)
            .populate("user", "username email");

        res.status(201).json({
            message: "Comment added successfully",
            comment: populatedComment
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const getCommentsByRecipe = async (req, res) => {
    try {
        const recipeId = req.params.recipeId;

        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: "Invalid recipe ID" });
        }

        const comments = await Comment.find({ recipe: recipeId })
            .populate("user", "username email")
            .sort({ createdAt: -1 });

        res.status(200).json(comments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};


export const deleteComment = async (req, res) => {
    try {
        const commentId = req.params.commentId;

        if (!mongoose.Types.ObjectId.isValid(commentId)) {
            return res.status(400).json({ message: "Invalid comment ID" });
        }

        const comment = await Comment.findById(commentId);

        if (!comment) {
            return res.status(404).json({ message: "Comment not found" });
        }

        
        if (String(comment.user) !== req.user.id) {
            return res.status(403).json({ message: "Not allowed to delete this comment" });
        }

        await comment.deleteOne();
        res.status(200).json({ message: "Comment deleted successfully" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
