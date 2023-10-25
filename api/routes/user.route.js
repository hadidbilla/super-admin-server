const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const User = require("../models/user.model")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

router.post('/signin', (req,res,next)=>{
  const {email, password} = req.body
  User.find({email})
    .exec()
    .then((user)=>{
      if (user.length < 1){
        return res.status(401).json({
          message: "Auth Failed"
        })
      }

      bcrypt.compare(password, user[0].password, (err, result)=>{
        if(err){
          return res.status(401).json({
            message:"Auth fail"
          })
        }

        console.log("result",result)

        if (result){

         const token = jwt.sign({
            email: user[0]?.email,
            userId: user[0]?._id
          }, 'secret',{
            expiresIn: "1h"
          })

         return  res.status(200).json({
            message: "Auth Successful",
           token: token
          })
        }

        return  res.status(401).json({
          message:"Auth Fail"
        })
      })

    })
    .catch((e)=>{
      console.log(e);
      res.status(500).json({
        message: e
      })
    })
})

router.post('/signup', (req, res, next) => {
  console.log("res.body", req.body)
  const {password, lastName, firstName, email} = req.body
  bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({
        error: err
      });
    } else {
      const user = new User({
        _id: new mongoose.Types.ObjectId(), // Corrected _id and ObjectId usage
        email, // Changed 'res' to 'req'
        firstName,
        lastName,
        password: hash
      });

      user.save()
        .then(result => {
          res.status(201).json({
            message: "User Created"
          });
        })
        .catch((err) => {
          res.status(500).json({
            error: err
          });
        });
    }
  })

})

module.exports = router;