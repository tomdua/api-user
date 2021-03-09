const mongoose = require("mongoose")
const User = require("../model/user")
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

exports.allUser = async(req, res, next) => {
    try{
    const filter = {};
    const allUsers = await User.find(filter);
    res.send(allUsers);
    }catch(err){
        res.send({message:err});
    }
  };

  exports.regsiter =  async(req, res, next) => {
    if (!req.body.password || !req.body.username){
      return res.status(409).json({
        message: "username or password missing"
      })
    }
    else{
      User.find({username:req.body.username}).exec()
        .then(user => {
        if (user.length >= 1) {
            return res.status(409).json({
            message: "username already exists"
          });
        } else {
          // console.log(user)
          let newUser = new User(req.body);
          newUser.save()
          .then(result=>{
            res.status(201).json({
              message:"user created"
            });
          })
        }
  });
  
}
}



exports.login = (req,res, next)=>{
   User.find({username:req.body.username }).exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "The username or password is incorrect"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "The username or password is incorrect"
          });
        }
        if (result) {
          // req.session.username = user[0].username;
          // req.session.save();
          const token = jwt.sign(
            {
            username: user[0].username,
            },
            process.env.JWT_KEY,
            {
              expiresIn: `${process.env.TOKEN_EXP_TIME}h`
            }
          );
          return res.status(200).json({
            token: token
          });
        }
    });
    });
  }

  exports.updateName = async (req, res, next) => {
    await User.find({username: req.user.username}).exec()
      .then(user => {
        let newvalues = { $set: { firstname:req.body.firstname } };
        User.updateOne( { "_id": user[0]._id},newvalues).exec()
        res.status(200).json({
        message: "User updated"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };



  exports.userDelete = async (req, res, next) => {
    await User.find({username: req.user.username}).exec()
      .then(user => {
        User.deleteOne({username: user[0].username}).exec()
        res.status(200).json({
          message: "User deleted"
        });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({
          error: err
        });
      });
  };

