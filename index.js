const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const helmet = require('helmet');
const morgan = require('morgan');
const cors = require('cors');
const multer = require('multer');
const path = require('path');

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



app.use('/images',express.static(path.join(__dirname,'public/images')));

//MiddleWares 


app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(morgan("common"));


//multer code 

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'public/images');
    },
    filename:(req,file,cb)=>{
        cb(null,req.body.name);
    }
});

const upload = multer({storage});

app.post('/api/upload',upload.single('file'),(req,res)=>{
    console.log(req.body.name);
    try{
        return res.status(200).json("File Uploaded successfully")
    }catch(err){
        console.log(err);
    }
})



//Routes

app.use('/api/users',userRouter);
app.use('/api/auth',authRouter);
app.use('/api/posts',postRouter);






app.listen(port,()=>{
    console.log(`Server is running at the port number : ${port} `);
})