
/*
Middleware to authenticate requests using JWT.
Checks for a valid token in the Authorization header.

It protects routes by verifying that a request includes a valid JWT token.
If valid → user info is attached to req and the request continues
If invalid → request is rejected with 401 Unauthorized

jsonwebtoken is a Node.js library to create and verify JWTs.
JWT = JSON Web Token, used for authentication.
*/



import jwt from 'jsonwebtoken';

export const authMiddleware = (req, res, next) => {


    /*
    req.header('Authorization') - > Gets the value of the Authorization header
    Example: "Bearer abc123.jwt.token"
    ?.split(' ')[1] - > Optional chaining to avoid errors if header is missing.
    Splits the string by space and takes the second part (the token itself).
    .split(' ') splits "Bearer abc123.jwt.token" into ["Bearer", "abc123.jwt.token"]
    [1] grabs the actual token "abc123.jwt.token"
    */
    const token = req.header('Authorization')?.split(' ')[1];


    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });






    /*
    Checks the token signature → ensures it was signed with your secret
    If valid → decoded payload is returned (e.g., user ID)
    Adds a user object to req so later route handlers know which user made the request
    */
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = { id: decoded.id }; 
        next();// Passes control to the next middleware or the route handler
               // Without calling next(), the request would hang
    } catch (err) {
        res.status(401).json({ message: 'Token is not valid' });
    }
};
