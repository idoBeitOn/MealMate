import mongoose from "mongoose";

const shoppingListSchema = new mongoose.Schema({

    /*
    Stores the MongoDB _id of the user who owns the list.
    ref: "User" → allows population (.populate("user")) to get full user info.
    required: true → cannot create a shopping list without a user.
    */
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    //items is an array of objects representing individual shopping list items.
    items: [
        {
            name: { type: String, required: true },
            amount: { type: String, default: "" }, 
            purchased: { type: Boolean, default: false },
            source: { type: String, enum: ["meal", "manual"], default: "meal" } 
        }
    ]
}, { timestamps: true });

export default mongoose.model("ShoppingList", shoppingListSchema);
