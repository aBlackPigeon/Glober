

import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';


const app = express();

app.get('/' , (req,res) =>{
    res.send("API WORKING 123 ");
})

app.listen(ENV.PORT, () => {
    console.log("Server started at port 5001");
    connectDB();
}) 


