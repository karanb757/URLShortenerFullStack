import express from 'express';
import dotenv from 'dotenv'
import connectDB from './src/config/mongo.config.js';
import short_url from './src/routes/shortUrl.route.js'
import { redirectFromShortUrl } from './src/controllers/short_url.controller.js';
dotenv.config()


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))

//CREATE SHORT URL ON BACKEND
app.use('/api/create',short_url)

app.get("/:id",redirectFromShortUrl)

app.listen(3000,()=>{
    connectDB();
    console.log('server is running on : http://localhost:3000');
});

//GET -> REDIRECTION -> USER GET ROUTE SE ID PE AAYEGA (BACKEND PE)
//POST -> CREATE SHORT URL ✅ 