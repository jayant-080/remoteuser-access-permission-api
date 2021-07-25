const {JWT_SECRET} = require('../keys');
const mongoose = require('mongoose');
const User = mongoose.model('User');
const jwt = require('jsonwebtoken');


module.exports = (req,res,next)=>{

    const {authorization} = req.headers;
    if(!authorization){
        res.status(401).json({
            success:false,
            message:"unauthorized"
        });
    }else{

        const token = authorization.replace("Bearer ","");
        jwt.verify(token,JWT_SECRET,(error,payload)=>{
          if(error){
              res.status(401).json({
                  success:false,
                  message:"unauthorized"
              });
          }else{
              const {_id} = payload;
              User.findById(_id).then(user=>{
                    req.user = user;
                    next();
              }).catch(error=>{
                    console.log(error);
              });
          }

        });
      

    }

   


}
