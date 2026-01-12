

/*
Mongoose is an ODM (Object Data Modeling) library for MongoDB.
It allows you to define schemas, create models, and interact with MongoDB in an object-oriented way.
*/
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
    //a JavaScript object, where each key is a field name
    //and the value is an object defining the field's type and constraints.
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});



/*
Creates a Mongoose model named "User"
Internally connects to the MongoDB collection users (Mongoose pluralizes the model name)
Provides methods like:
User.findOne()
User.findById()
User.create()
User.updateOne()
export default → allows importing the model in other files:
*/
export default mongoose.model('User', userSchema);


