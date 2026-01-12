import Comment from "../models/CommentModel.js";
import mongoose from "mongoose";




/*
async marks a function as asynchronous. 
This allows the use of await within the function, enabling asynchronous operations to be handled more easily.
It automatically returns a Promise, even if you don’t return one explicitly.
Makes asynchronous code look synchronous, improving readability.
Only blocks the current async function, not the whole program (non-blocking).
Works with Promises, so any asynchronous operation can be used with await.
await pauses only the async function, not the rest of the program.
This is what makes JavaScript non-blocking and allows it to handle thousands of requests concurrently

async function fetchUser() {
    console.log("Start fetching user");
    const user = await User.findOne({ email: "test@example.com" });
    console.log("User fetched:", user);
}

console.log("Before calling fetchUser");
fetchUser();
console.log("After calling fetchUser");

Step-by-step execution
"Before calling fetchUser" → printed immediately.
fetchUser() is called:
"Start fetching user" → printed immediately.
await User.findOne(...) → Promise is pending → function pauses here.
"After calling fetchUser" → printed immediately.
Meanwhile, the database query is happening in the background.
Once the Promise resolves, the event loop resumes execution inside fetchUser and prints "User fetched: ...".
*/

export const addComment = async (req, res) => {
    try {
        const { recipeId, text } = req.body;


        //Checks if recipeId is a valid MongoDB ObjectId.
        //Protects against invalid database queries.
        if (!mongoose.Types.ObjectId.isValid(recipeId)) {
            return res.status(400).json({ message: "Invalid recipe ID" });
        }
        
        //Ensures the comment text is not empty (falsy check + trimming whitespace).
        // == - > Compares values, but performs type coercion if the types are different.
        // === -> Compares both value and type without type coercion.
        if (!text || text.trim() === "") {
            return res.status(400).json({ message: "Comment text is required" });
        }

        const comment = new Comment({
            recipe: recipeId,
            user: req.user.id, 
            text
        });


        /*
        Saves the new comment to the database.
        Mongoose method that writes the document to the MongoDB database.
        Returns a Promise because saving is asynchronous.
        Pauses execution of the addComment function until the document is saved.
        Database operations take time → you don’t want the server to respond before the operation is done.
        Using await makes the code look synchronous, but it’s still non-blocking for the main thread.
        */
        await comment.save();


        /*
        Purpose: Fetch the comment from the database by its _id.
        Even though you just saved it with comment.save(), Mongoose allows you to query it again.
        Why? Because the next step is populate, which can only be done on a query.
        Returns a Promise, which resolves to a comment document.
        */
        const populatedComment = await Comment.findById(comment._id)
        //Populate replaces the user field (which currently holds just the user’s ID) with the actual user document.
        //This makes the response richer and more useful for the frontend, without sending unnecessary fields like passwords.
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



        //Returns all comments that have a recipe field equal to the recipe ID.
        //Replaces "user" field (ObjectId) with the actual user document containing only username and email.
        const comments = await Comment.find({ recipe: recipeId })
            .populate("user", "username email")
            //Sorts comments by createdAt field in descending order (newest first).
            .sort({ createdAt: -1 });

        res.status(200).json(comments);

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};



/*
It deletes a comment only if the logged-in user is the owner of that comment.

*/
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

        
        //Checks if the user trying to delete the comment is the one who created it.
        //This prevents users from deleting comments they don't own.
        //String() is needed because comment.user is an ObjectId.
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
