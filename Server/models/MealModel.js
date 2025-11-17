import mongoose from "mongoose";

const mealSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    dayOfWeek: {
        type: Number,
        min: 0,
        max: 6,
        required: true
    },

    timeSlot: {
        type: Number,
        min: 0,
        max: 10,  
        required: true
    },

    // Either recipe or manual name
    recipeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Recipe",
        default: null
    },

    customName: {
        type: String,
        default: null
    },

    notes: {
        type: String,
        default: ""
    }

}, {
    timestamps: true
});

// prevents duplicate assignments
mealSchema.index(
    { userId: 1, dayOfWeek: 1, timeSlot: 1 },
    { unique: true }
);

export default mongoose.model("Meal", mealSchema);
