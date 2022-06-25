const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User');
//create a post

router.post('/create',async(req,res)=>{
    console.log("hello");
    const newPost = new Post(req.body);
    try{
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    }catch(err){
        res.status(500).json(err);
    }
})

//update a post


router.put('/:id',async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await Post.updateOne({$set:req.body});
            res.status(200).json("Post Updated Successfully");
        }else{
            res.status(403).json("You can update only your post only");
        }
    }
    catch(err){
        res.json(err);
    }
    const post = Post.findById(req.params.id);

})

//delete a post

router.delete('/:id',async(req,res)=>{
    try{
        const post = await Post.findById(req.params.id);
        if(post.userId === req.body.userId){
            await Post.deleteOne({$set:req.body});
            res.status(200).json("Post Deleted Successfully");
        }else{
            res.status(403).json("You can delete only your post only");
        }
    }
    catch(err){
        res.json(err);
    }
    const post = Post.findById(req.params.id);

})
//like and dislike a post

router.put('/:id/like',async(req,res)=>{
    try{
        
        const post = await Post.findById(req.params.id);

        if(!post.likes.includes(req.body.userId)){
            await Post.updateOne({$push:{likes:req.body.userId}});
            res.status(200).json("The Post has been liked ");
        }else{
            await Post.updateOne({$pull:{likes:req.body.userId}});
            res.status(200).json("The Post has been disliked ");
        }
    }catch(err){
       
        res.status(500).json(err);
    }
})

//get a post

router.get('/:id',async(req,res)=>{
    try{
        
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    }catch(err){
       
        res.status(500).json(err);
    }
})

//get timeline posts

router.get('/timeline/:userId',async(req,res) => {
    
    try{
        const curUser = await User.findById(req.params.userId);
        const userPosts = await Post.find({userId:curUser._id});
        
        const friendPosts = await Promise.all(
            curUser.followingPeople.map((friendId) => {
                return Post.find({userId : friendId});
            })
        );
         
        res.status(200).json(userPosts.concat(...friendPosts))

    }catch(err){
        res.status(510).json("Error");
    }
})

//get user's all post 

router.get('/profile/:username',async(req,res) => {
    
    try{
        const user = await User.findOne({username:req.params.username});
        const posts = await Post.find({userId : user._id});
         
        res.status(200).json(posts); 

    }catch(err){
        res.status(510).json("Error");
    }
})




module.exports = router;