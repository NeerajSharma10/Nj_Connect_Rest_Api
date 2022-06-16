const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');

const app = express();

const userRouter = require('./routes/users');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/posts');

dotenv.config();     //for important keys and passwords 
const port = 4000;

// mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true},()=>{
//     console.log("Mongodb connected")
// });

mongoose
    .connect(process.env.MONGO_URL)
    .then(function(db) {
        // console.log(db);
        console.log("mongo db connected");
    })
    .catch(function(err) {
        console.log(err);
    });
//MiddleWares 


app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

//Routes

app.use('/api/users',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/posts',postRouter);






app.listen(port,()=>{
    console.log(`Server is running at the port number : ${port} `);
})