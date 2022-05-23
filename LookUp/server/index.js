import exrpess from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import authRouter from '../server/routes/authRouter.js'
import userRouter from '../server/routes/userRouter.js'
import listingRouter from '../server/routes/listingRouter.js'

dotenv.config();
const app = exrpess();

app.use(exrpess.json());
app.use(exrpess.urlencoded());
app.use(cookieParser());
app.use(cors());

// Default route for application
app.use('/api', authRouter);
app.use('/api', userRouter);
app.use('/api', listingRouter);


const CONNECTION_URL = process.env.MONGODB_URL;
const PORT = process.env.PORT || 5000;

// Params makes sure to avoid warnings or errors in console
mongoose.connect(CONNECTION_URL, {
    useNewUrlParser: true, 
    useUnifiedTopology: true})
        .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
        .catch((error) => console.log(error.message));