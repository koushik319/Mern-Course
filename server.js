import 'express-async-errors'
import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import morgan from 'morgan'
import {nanoid} from 'nanoid';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import cloudinary from 'cloudinary'; 
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize'



// Routes 

import jobRouter from './routes/jobRouter.js'
import authRouter from './routes/authRouter.js'
import userRouter from './routes/userRouter.js'

// Public 

import {dirname} from 'path'
import { fileURLToPath } from 'url';
import path from 'path';

//Middleware 

import  errorHandlerMiddleware from './middleware/errorHandlerMiddleware.js';
import {authenticateUser} from './middleware/authMiddleware.js'



dotenv.config();
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
  });


const __dirname = dirname(fileURLToPath(import.meta.url))


const app = express();
app.use(express.json());
// To use the Cookie Parser 
app.use(cookieParser());
app.use(helmet());
app.use(mongoSanitize());

// 
app.use(express.static(path.resolve(__dirname,'./client/dist')))



if(process.env.NODE_ENV ==='development')
{
    app.use(morgan('dev'));

}

// app.get('/',(req,res)=>{
//     res.send("Hello World");
// });

app.post('/',(req,res)=>{
    console.log(req);
    res.json({message:"data received",data : req.body});
})


// app.post('/api/v1/test',validateTest,(req,res)=>{
//    const {name} = req.body;
//     res.json({message:`Hello ${name}`});
// })
app.use('/api/v1/test',(req,res)=>{
    res.json({msg:'test route'})
})

app.use('/api/v1/jobs',authenticateUser,jobRouter)
app.use('/api/v1/auth',authRouter)
app.use('/api/v1/users',authenticateUser,userRouter)


app.get('*',(req,res)=>{
    res.sendFile(path.resolve(__dirname,'./client/dist','index.html'))
})
// // GET ALL JOBS 

// app.get('/api/v1/jobs',)

// // CREATE A JOB 

// app.post('/api/v1/jobs',)


// // GET SINGLE JOB 

// app.get('/api/v1/jobs/:id',)

// //EDIT JOB 

// app.patch('/api/v1/jobs/:id',)


// //DELETE JOB 

// app.delete('/api/v1/jobs/:id',)


// Middleware for Not Found 

app.use('*',(req,res)=>{
    res.status(404).json({msg:"Not Found"})
})

app.use(errorHandlerMiddleware);


const port = process.env.PORT || 5100 ;

try {
    await mongoose.connect(process.env.MONGO_URL);
    app.listen(port, () => {
      console.log(`server running on PORT ${port}....`);
    });
  } catch (error) {
   console.log(error);
   process.exit(1);
  }



