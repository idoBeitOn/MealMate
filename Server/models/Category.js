import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String },
    imageURL: { type: String }
}, {
    timestamps: true // Automatically manage createdAt and updatedAt fields
});

categorySchema.index({ name: 'text', description: 'text' }); // Text index for search functionality

export default mongoose.model('Category', categorySchema);