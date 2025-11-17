import mongoose from "mongoose";

const shoppingListSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
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
