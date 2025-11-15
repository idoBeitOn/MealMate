import User from '../models/Server/models/UserModel.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';



export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if(!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'This user is already registered' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });
        await newUser.save();
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


app.use('/api/auth', authRouter);