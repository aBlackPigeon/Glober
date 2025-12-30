import express from 'express';
import { ENV } from './config/env.js';
import { connectDB } from './config/db.js';
import {clerkMiddleware} from '@clerk/express';
import { inngest } from './config/inngest.js';
import { serve } from "inngest/express";

const app = express();

app.use(express.json()); 
app.use(clerkMiddleware()); //req.auth will be availalbe in req object
app.use("/api/inngest", serve({ client: inngest, functions }));

app.get('/' , (req,res) =>{
    res.send("API WORKING 123 ");
})

const startServer = async() => {
    try{
        await connectDB();
        if(ENV.NODE_ENV !== "production"){
            app.listen(ENV.PORT , () => {
                console.log("Server started on port" ,ENV.PORT);
            });
        }
    }catch(error){
        console.log("Error starting the server ", error);
        process.exit(1);
    }
}

startServer();

export default app;

