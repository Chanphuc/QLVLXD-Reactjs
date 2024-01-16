import cors from 'cors';
import express from "express";
import mongoose from "mongoose";
import authRoute from './routes/Auth.js';
import categoryRoute from './routes/Category.js';
import productRoute from './routes/Product.js';
import userRoute from './routes/User.js';

// Connect to MongoDB
mongoose.connect('mongodb+srv://trinhchanphuc2805:tcp2805@cluster0.majdvqp.mongodb.net/?retryWrites=true&w=majority', () => {
    console.log('Connected to MongoDB');
});

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);
app.use('/api/category', categoryRoute);
app.use('/api/product', productRoute);

// Start server
app.listen(7000, () => {
    console.log('Server started on PORT 7000');
});

