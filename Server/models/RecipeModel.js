import mongoose  from "mongoose";


//subdocument schema for ingredients
const ingredientSchema = new mongoose.Schema({
    name: {type: String, required: true, trim: true},
    amount: {type: String}}
    ,{ _id : false }); // Prevent creation of _id for subdocuments)


const nutritionSchema = new mongoose.Schema({
    calories: {type: Number, default: 0},
    fat: {type: Number, default: 0},
    carbohydrates: {type: Number, default: 0},
    protein: {type: Number, default: 0}
}, {_id : false}); // Prevent creation of _id for subdocuments  


const recipeSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },          
  description: { type: String },                                
  ingredients: [ingredientSchema],                              
  steps: [{ type: String }],                                    
  nutrition: nutritionSchema,                                   
  cookTime: { type: Number, default: 0 },                       
  difficulty: { type: String, enum: ['easy','medium','hard'], default: 'easy' }, 
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },           
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, 
  images: [{ type: String }],                                  
  isPublic: { type: Boolean, default: true },                   
  likesCount: { type: Number, default: 0 },
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User', default: []  }],
  favoritedBy: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User" }
]
                   
}, {
  timestamps: true // Automatically manage createdAt and updatedAt fields
});

recipeSchema.index({ title: 'text', description: 'text', 'ingredients.name': 'text' }); // Text index for search functionality

recipeSchema.virtual('summary').get(function() {
    return `${this.title} - ${this.description ? this.description.substring(0, 100) + '...' : ' '}`;
});

export default mongoose.model('Recipe', recipeSchema);
