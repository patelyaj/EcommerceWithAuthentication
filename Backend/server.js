import express from 'express';
import cors from 'cors';
import { configDotenv } from 'dotenv';
import connectDb from './config/configDb.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import productRoutes from './routes/productRoutes.js';

configDotenv();
connectDb();

const app = express();
app.use(express.json());

app.use(cookieParser());
// app.use(cors({
//     origin : 'http://localhost:5173',
//     credentials : true
// }))
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
// app.use(express.urlencoded(true));

app.use('/users',authRoutes);
app.use('/products',productRoutes);

app.get('/checkbackend',(req,res)=>{
    // console.log('hel');
    // res.send('hello');
    try {
        res.json('okk');
    } catch (error) {
        res.json(res.status('404'),error)
    }
});

app.listen(process.env.PORT,()=>{
    console.log(`runnning on http://localhost:${process.env.PORT}`);
});