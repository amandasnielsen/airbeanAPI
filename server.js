import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
// import { setCurrentUser } from './middlewares/authorize.js';
import authRouter from './routes/auth.js';
import menuRouter from './routes/menu.js';
import cartRouter from './routes/cart.js';
import ordersRouter from './routes/orders.js';
import errorHandler from './middlewares/errorhandler.js';

// Config
dotenv.config();
const app = express();
const PORT = process.env.PORT;
mongoose.connect(process.env.CONNECTION_STRING)
const database = mongoose.connection;

global.user = null;

// Middleware
// app.use(setCurrentUser);
app.use(express.json());


// Routes
app.use('/api/auth', authRouter);
app.use('/api/menu', menuRouter);
app.use('/api/cart', cartRouter);
app.use('/api/orders', ordersRouter);


database.on('error', (error) => console.log(error));
database.once('connected', () => {
    console.log('DB Connected');
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
});

app.use(errorHandler);