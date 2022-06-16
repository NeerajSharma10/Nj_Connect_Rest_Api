const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type:String,
        require:true,
        min:3,
        max:40,
        unique:true
    },
    email: {
        type:String,
        require:true,
        max:60
    },
    password: {
        type:String,
        require:true,
        min:20
    },
    profilePicture: {
        type:String,
        default:""
    },
    coverPicture: {
        type:String,
        default:""
    },
    followers: {
        type:Array,
        default:[]
    },
    followingPeople:{
        type:Array,
        default:[]
    },
    isAdmin:{
        type:Boolean,
        default:false
    },
    desc:{
        type:String,
        max:50,
        default:"Nothing"
    },
    city:{
        type:String,
        max:50
    },
    from:{
        type:String,
        max:50
    },
    relationship:{
        type:Number,
        enum:[1,2]
    },
},{timestamps:true});

module.exports = mongoose.model('User',userSchema);

