const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');

router.get('/',(req,res) => {
    res.send("User Routes");
})


//update user

router.put('/:id',async (req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        if(req.body.password){
            try{
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password,salt);
            }catch(err){
                res.status(500).json(err);
            }
        }
        try{
            const user = await User.findByIdAndUpdate(req.params.id,{$set:req.body});
            res.status(200).json("Account has been updated");
        }catch(err){
            res.status(404).json("Error",err);
        }

    }else{
        res.status(401).json("You can update only your account got it ? ")
    }
})

//delete user
router.delete('/:id',async (req,res) => {
    if(req.body.userId === req.params.id || req.body.isAdmin){
        try{
            await User.findByIdAndDelete(req.params.id);
            res.status(200).json("Account has been deleted");
        }catch(err){
            res.status(404).json("Error",err);
        }

    }else{
        res.status(401).json("You can delete only your account got it ? ")
    }
})

//get user  
router.get('/:id',async (req,res)=>{
    if(req.params.id || req.body.isAdmin){
        try{
            const user = await User.findById(req.params.id);
            const {password,updatedAt,...others} = user._doc;
            res.status(200).json(others);
        }catch(err){
            res.status(404).json("Error",err);
        }

    }else{
        res.status(401).json("You can get only your account got it ? ")
    }
})

//follow user
router.put('/:id/follow',async(req,res)=>{
    if(req.params.id != req.body.id){
        try{
            const user = await User.findById(req.params.id); 
            const curUser = await User.findById(req.body.userId);
            
            if(!user.followers.includes(req.body.userId)){
                await user.updateOne({$push:{followingPeople:req.body.userId}});
                await curUser.updateOne({$push:{followers:req.params.id}});
                res.status(200).json("User has been followed");
            }else{
                res.status(403).json("Damn You already follow this user")
            }

        }catch(err){
            res.send(err);
        }
    }else{
        res.status(403).json("You cannot follow yourself");
    }
})

//unfollow user 

router.put('/:id/unfollow',async(req,res)=>{
    if(req.params.id != req.body.id){
        try{
            const user = await User.findById(req.params.id); 
            const curUser = await User.findById(req.body.userId);
            
            if(user.followers.includes(req.body.userId)){
                await user.updateOne({$pull:{followers:req.body.userId}});
                await curUser.updateOne({$pull:{followingPeople:req.params.id}});
                res.status(200).json("User has been unfollowed");
            }else{
                res.status(403).json("Damn You do not follow this user")
            }

        }catch(err){
            res.send(err);
        }
    }else{
        res.status(403).json("You cannot unfollow yourself");
    }
})


module.exports = router;