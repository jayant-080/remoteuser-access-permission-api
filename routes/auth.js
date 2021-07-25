const express= require('express');
const mongoose = require('mongoose');
const router = express.Router();
const User = mongoose.model('User');
const Feed = mongoose.model('Feed');
const bcrypt = require('bcryptjs');
const { json } = require('express');
const {JWT_SECRET} = require('../keys');
const jwt = require('jsonwebtoken');
const requirelogin = require('../middlewears/requirelogin');



//registration of user
router.post('/register',(req,res)=>{
 
    const {name , email ,password,isadmin} = req.body;
    if(!name || !email || !password){
        res.status(200).json({
            success:false,
            message:"please fill all the fields"
        });
    }else{
        User.findOne({email:email}).then((user)=>{
            if(user){
               res.status(200).json({
                   success:false,
                   message:"email already exists"
               });
            }else{
               bcrypt.hash(password,12).then((hashpassword)=>{
                 const user = new User({
                     name,
                     email,
                     password:hashpassword,
                     isadmin
                 });
   
                 user.save().then(user=>{
                    res.status(200).json({
                        success:true,
                        message:"user succefully registered",
                        user:user
            
                    });
                 }).catch(error=>{
                     console.log(error);
                 })
               }).catch(error=>{
                   console.log(error);
               });
            }
       }).catch(error=>{
            console.log(error);
       });
    }
    

});


//signin of user 

router.post('/signin',(req,res)=>{

    const {email , password}= req.body;
    if(!email || !password){
        res.status(200).json({
           success:false,
           message:"please fill all the fields"
        });
    }else{
        User.findOne({email:email}).then(user=>{
            if(!user){
                res.status(200).json({
                    success:false,
                    message:"invalid email or password"
                });
            }else{
            
                bcrypt.compare(password,user.password).then(domatch=>{
                  if(!domatch){
                    res.status(200).json({
                        success:false,
                        message:"invalid email or password"
                    });
                  }else{


                    const token = jwt.sign({_id:user._id},JWT_SECRET);

                      res.json({
                          success:true,
                          message:"user signed in succesfully",
                          token:token
                          
                      });
                  }

                }).catch(error=>{
                    console.log(error);
                });
             

            }
        }).catch(error=>{
           console.log(error);
        });

    }

});



//pushing user id for allowsharing data

router.put('/allowsharing/:userId',requirelogin,(req,res)=>{
    User.findOne({_id:req.params.userId}).populate("allowsharing", "name profilepic isadmin allowsharing email").then(user=>{
        User.findByIdAndUpdate({_id:req.user._id},{
            $push:{allowsharing:user}},{new:true
            }
        ).populate("allowsharing", "name profilepic isadmin allowsharing email").exec((err,result)=>{
          if(err){
                res.status(422).json({
                    success:false,
                    message:err
                });
            }else{
                User.findByIdAndUpdate({_id:req.user._id},{
                  $pull:{request:req.params.userId}
              },{new:true}).populate("allowsharing", "name profilepic isadmin allowsharing email").exec((err,result)=>{

                   res.status(200).json({
                success:true,
                message:"user added ",
                result:result
           });

           });
       
    
            }
        });
    }).catch(err=>{
        console.log(err);
    });
   
    
});


//removing user id for allowsharing data

router.put('/stopsharing/:userId',requirelogin,(req,res)=>{
    User.findOne({_id:userId}).then(user=>{
        User.findByIdAndUpdate({_id:req.user._id},{
            $pull:{allowsharing:user}},{new:true
            }
        ).exec((err,result)=>{
    
            if(err){
                res.status(422).json({
                    success:false,
                    message:err
                });
            }else{
               
    
    
              User.findByIdAndUpdate({_id:req.user._id},{
                  $pull:{request:req.params.userId}
              },{new:true}).exec((err,result)=>{
     res.status(200).json({
                    success:true,
                    message:"user added ",
                    result:result
                });
              });
    
            }
        });
    }).catch(err=>{
        console.log(err);
    });
   
    
});






//user requesting to admin for allowing him to see his/her data

router.put('/request/:adminId',requirelogin,(req,res)=>{
    User.findOne({_id:req.user._id}).populate("request", "name").then(user=>{
        User.findByIdAndUpdate(req.params.adminId,{
            $push:{request:user}},{new:true
         }).populate("request", "name profilepic isadmin allowsharing email").exec((err,result)=>{
             if(err){
                 res.status(422).json({
                     success:false,
                     message:err
                 });
             }else{
                 res.status(200).json({
                  success:true,
                  message:"request sent",
                  result:result
                 });
             }
         });
    }).catch(err=>{
        console.log(err);
    });
  

});


//get my admin profile

router.get('/myprofile',requirelogin,(req,res)=>{

    User.findById({_id:req.user._id}).populate("allowsharing", "name profilepic isadmin allowsharing email").populate("request", "name profilepic isadmin allowsharing email").then(user=>{
        if(user){
            res.status(200).json({
              success:true,
              message:"found",
              user:user
            });
        } 
  
    }).catch(err=>{
        console.log(err);
    });
   
});



//searching for admin user 

router.post('/search',requirelogin,(req,res)=>{
 let userpattern = RegExp("^"+req.body.query);
 User.find({name:{$regex:userpattern}}).then(user=>{
      if(user){
          res.status(200).json({
            success:true,
            message:"user found",
            user:user
          });

      }else{
          res.status(200).json({
              success:false,
              message:"user not found"
          });
      }
 }).catch(err=>{
 console.log(err);
 });

});

//getting all user 

router.get('/allusers',requirelogin,(req,res)=>{
  User.find().sort('-createdAt').then(user=>{
      if(user){

        res.status(200).json({

         success:true,
         message:"found",
         user:user
        });
      }

  }).catch(err=>{
    console.log(err);
  });
    
});



module.exports= router;