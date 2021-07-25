const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({

name:{
    type:String,
    required:true
},
email:{
    type:String,
    required:true
},
password:{
    type:String,
    required:true

},
profilepic:{
    type:String,
    default:"https://res.cloudinary.com/jjjkkkbit/image/upload/v1627021694/AKedOLRBu7cto87PlLFt33JOOt4TNX0R-cicsnBAO-EAxQ_s900-c-k-c0x00ffffff-no-rj_qzjhko.jpg"
},
isadmin:{
    type:Boolean,
    default:false
},

allowsharing:[
    {type:ObjectId,ref:"User"}
],

request:[{type:ObjectId,ref:"User"}]

},{timestamps:true});

mongoose.model("User",userSchema);