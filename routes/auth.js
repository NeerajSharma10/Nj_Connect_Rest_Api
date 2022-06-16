const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

//Register
router.post('/register',async (req,res) => {

    //Creating new User 
    try{
        //Creating new Hashed Password with the help of bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password,salt);
        const newUser = new User({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        })
        //Saving user 
        const nUser = await newUser.save();
        //Sending Status and responding 
        res.status(200).json(nUser);
    }catch(err){
        res.send("error" + err);
    }
})

//Login

router.post('/login',async (req,res) => {
    try{
        const user = await User.findOne({email:req.body.email});
        if(!user){
            res.status(404).json("user not found");
        }
        const validPassword = await bcrypt.compare(req.body.password,user.password);
        !validPassword && res.status(400).json("Password is incorrect ");
        res.status(200).json(user);
    }catch(err){
        res.send("error" + err);
    }
})



module.exports = router;