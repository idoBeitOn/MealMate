
/*
A JWT (JSON Web Token) is a compact, secure string that represents information
 (claims) about a user.
It is commonly used for authentication and authorization.
A JWT has three parts, separated by dots:
header.payload.signature
Header – Contains metadata about the token, e.g., the algorithm used (HS256).
Payload – The actual data you want to store, e.g., { id: "1234", username: "ido" }.
Signature – A cryptographic signature that proves the token was issued by your server and hasn’t been tampered with.
When a user logs in or registers, your backend creates a JWT containing the user’s ID.
The frontend stores this token and sends it in requests to protected endpoints.
authMiddleware verifies the token and lets the user access the requested resource.
*/


/*
bcrypt is a password-hashing function. It takes a plain-text password and converts it into a secure hash
that can be safely stored in a database.
Why it’s needed:
Never store plain-text passwords in your database.
bcrypt makes it computationally hard for attackers to recover passwords even if they steal the database.
How it works:
Hashing: Convert plain password → hashed string with randomness (salt).
Verification: Compare plain password to hash when user logs in.
*/

import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';



export const register = async (req, res) => {
    try {
        // Extract user details from request body
        //Extracts username, email, and password from req.body in a single line
        const { username, email, password } = req.body;
        /*
        Checks if any field is missing.
        !username is a falsy check: undefined, null, or empty string will all fail.

        undefined -> A variable that has been declared but not assigned a value.
        Indicates that something does not exist yet.
        JavaScript automatically assigns undefined to uninitialized variables.
        Also appears when trying to access a property that doesn’t exist.

        null ->A variable that is intentionally empty.
        It’s a way for a programmer to explicitly say “no value”.

        Empty string "" -> A string with zero length.
        Indicates text exists but is empty.

        */
        if(!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }






        /*
        const - > Immutable binding: You cannot reassign the variable to a new value.
        the value itself is not frozen. If it’s an object, you can still change its properties.
        Block-scoped: Only exists inside the { ... } block it’s declared in.
        Common use: Usually for values that shouldn’t be reassigned, like configuration, constants, or function references.

        let ->Can be reassigned. Block-scoped like const.
        Common for loop counters, temporary variables, or values that change.

        User.findOne({ email }) queries MongoDB to see if a user with the same email exists.
        await pauses the execution until the database responds.
        User.findOne({ email }):
        Returns a Promise. A Promise represents a value that may not be available yet.
        Without await, you would get the Promise object itself, not the user document.

        */
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'This user is already registered' });
        }


        const hashedPassword = await bcrypt.hash(password, 10);

        // creates a new MongoDB document using your User model.
        const newUser = new User({ username, email, password: hashedPassword });

        // writes the document to the database.
        await newUser.save();


        /*
        jwt.sign(payload, secret, options) generates a JSON Web Token.
        payload: The data you want to include in the token. Here, it’s the user ID.
        secret: A string used to sign the token, ensuring its integrity. It should be kept secret on the server.
        options: Additional settings for the token. { expiresIn: '5h' } means the token will expire in 5 hours.
        */
        const token  = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '5h' });


        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

};





export const login = async (req, res) => {
    try {
        const {email, password} = req.body;
        if(!email || !password) {
            return res.status(400).json({message: 'All fields are required'});
        }

        const user = await User.findOne({ email });
        if(!user) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({message: 'Invalid email or password'});
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '5h' });
        res.status(200).json({
             token,
             user: {
                id: user._id,
                username: user.username,
                email: user.email
                }
             });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });      
    }
}

