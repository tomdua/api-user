const jwt = require('jsonwebtoken');
const mongoose = require("mongoose");
const User = require('../model/user');

module.exports  = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token, process.env.JWT_KEY);
    await User.findOne({ username: decoded.username }).then((user) => {
      console.log(`Logged in user found, username: ${user.username} `);
      req.user = user
    }).then(() => {
      next()
    })
    
  } catch (error) {
    return res.status(401).json({
      message: 'Auth failed',
      reason: error.message,
    });
  }
};

