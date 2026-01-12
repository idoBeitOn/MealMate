import express from 'express';
import { login, register } from '../controllers/authController.js';



//express.Router() creates a mini Express application that only handles routes defined here.

const authRouter = express.Router();

//POST /register → when the client sends registration data, register function handles it.
authRouter.post('/register', register);

//POST /login → when the client sends login data, login function handles it.
authRouter.post('/login', login);



//The router maps HTTP methods + paths to controller functions.
export default authRouter;



/*
1
POST /api/auth/register
Content-Type: application/json

{
  "username": "ido",
  "email": "ido@example.com",
  "password": "123456"
}


2

Express router receives request
The request matches the route /api/auth/register.
Express passes it to the authRouter:
authRouter.post('/register', register);
The register function from authController.js is called.


3

Extracts data from request body.
Checks if any field is missing → if yes, sends 400 Bad Request.
Mongoose query: searches MongoDB users collection for the same email.
If user exists → returns 400 Bad Request.

Uses bcrypt to hash the password (never store plain passwords!).
await pauses this async operation without blocking the Node event loop for other requests.
Creates a new User Mongoose document.
save() stores it in MongoDB.
Node event loop continues handling other requests while waiting.
reates a JWT token for the new user:
Payload: { id: newUser._id }
Secret: from .env
Expires in 5 hours
Token will be sent to the client for authenticated requests.
Sends response JSON back to the client with user info + JWT.


4

User.findOne() → reads from users collection.
newUser.save() → inserts new document in users collection.
MongoDB ensures schema validation (unique email, required fields).


5
Client receives response:
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "652e1a6c9f1d2c3b4a5e6f78",
    "username": "ido",
    "email": "ido@example.com"
  }
}

Frontend stores the JWT (e.g., localStorage or cookies).
JWT is used for authenticated requests (like creating recipes, comments, or meals).


*/