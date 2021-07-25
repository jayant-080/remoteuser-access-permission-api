const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const requirelogin = require('../middlewears/requirelogin');
const Feed = mongoose.model('Feed');
const User = mongoose.model('User');
const cloudinary = require('cloudinary').v2;


cloudinary.config({
  cloud_name: 'metasploit',
  api_key: '774397471934829',
  api_secret: 'WCZme84t5cwTc4D9X39K52s8Wn8'
});

//uploading feeds with title description and image
router.post('/feed', requirelogin, (req, res) => {

  const isadmin = req.user.isadmin
  if (isadmin) {
    const { title, description } = req.body;
    const file = req.files.picture;
    if (!title || !description || !file) {
      res.status(200).json({
        success: false,
        message: "fill all the required fields"
      });
    } else {

      cloudinary.uploader.upload(file.tempFilePath, (error, result) => {
        if (error) {
          res.status(422).json({
            success: false,
            message: "something went wrong" + error
          });
        } else {
          const feed = new Feed({
            title,
            description,
            picture: result.url,
            postedBy: req.user
          });
          feed.save().then(feed => {
            res.status(200).json({
              success: true,
              message: "feed uploaded succesfully",
              feed: feed
            });
          }).catch(error => {
            console.log(error)
          })

        }

      }).catch(error => {
        console.log(error);
      })

    }

  } else {

    res.status(200).json({
      success: false,
      message: "you are not admin"

    });

  }


});


//see all feeds of admin
router.get('/feed/:adminId',requirelogin,(req,res)=>{
 

  User.findById({_id:req.params.adminId}).then(user=>{


         const listofallallowsharing = user.allowsharing;
       
         if(listofallallowsharing.includes(req.user._id)){
     Feed.find({postedBy:req.params.adminId}).populate("postedBy","name _id email").sort('-createdAt').then(feed=>{
      if(feed){

        res.status(200).json({
          success:true,
          message:"dekh le bhai je li tu v",
          feed:feed
        })
      }
    });
         }else{
           res.status(200).json({
             success:false,
             message:"you are not allowed"
           })
         }
         
  });

  

  
    
 
});

//updating profile pic of user 

router.put('/updateprofilepic',requirelogin,(req,res)=>{

  const file = req.files.picture;
  if(!file){
    res.status(200).json({
      success:false,
      message:"choose image first"
    });
  }else{

    cloudinary.uploader.upload(file.tempFilePath,(error,result)=>{
      if(error){
        res.status(200).json({
          success:false,
          message:error
        });
      }else{

        User.findByIdAndUpdate(req.user._id,{$set:{profilepic:result.url}},{new:true},(error,result)=>{
          if(error){
            res.status(200).json({
              success:false,
              message:error
            });
          }else{

            res.status(200).json({
              success:true,
              message:"profile pic updated",
              result:result
            });
          }

        });
      }
    });
  }

});



module.exports = router;