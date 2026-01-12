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


//Creates a MongoDB text index, Enables full-text search on title, description, and ingredient names
//Useful for search APIs ($text: { $search: "chicken" })
//recipeSchema.index() is a Mongoose method
//It creates an index in MongoDB for the schema.
//The argument is a JavaScript object
//Keys (title, description, 'ingredients.name') → the fields you want to index.
//it will search across all indexed fields (title, description, ingredient names).
//Text indexes can be used for searching strings efficiently.
recipeSchema.index({ title: 'text', description: 'text', 'ingredients.name': 'text' }); // Text index for search functionality




/*
defines a virtual (computed) property on documents.
Argument 'summary' → the name of the virtual property.
get(function() { ... }) → defines a getter function for this virtual field.
Every time you access recipe.summary, this function runs and returns a value.
It does not store the value in MongoDB. It’s computed on the fly.
*/
recipeSchema.virtual('summary').get(function() {
  // Returns a short summary string combining title and first 100 chars of description

    return `${this.title} - ${this.description ? this.description.substring(0, 100) + '...' : ' '}`;
});

export default mongoose.model('Recipe', recipeSchema);


/*
A database index is like a table of contents or a sorted map for your database.
Instead of scanning every document in a collection to find what you want, the database can look it up using the index.
Think of it like a book:
Without an index → you read every page to find the word “chicken”
With an index → you go straight to the pages listed in the index

Single field index
Example: { title: 1 } → sorts and indexes by title
Compound index
Example: { category: 1, cookTime: -1 } → index considers multiple fields
Text index (like in your Recipe model)



Faster queries → the database doesn’t need to scan all documents
Efficient sorting → can sort using the index
Supports text search → MongoDB text index allows keyword searching



Indexes take extra storage
Slows write operations a bit (insert/update/delete) because index must be updated
Need to carefully choose which fields to index
*/