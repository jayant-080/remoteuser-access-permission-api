const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const feedSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    picture:{
        type:String,
        required:true
    },postedBy:{
        type:ObjectId,
        ref:"User"
    }


},{
    timestamps:true
});


mongoose.model("Feed",feedSchema);