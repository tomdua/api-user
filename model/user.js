const mongoose = require("mongoose")
const bcrypt = require("bcryptjs");

const User = new mongoose.Schema({
    username: {type: String, unique: true, required: true },
    firstname: String,
    lastname: String,
    password: {type: String, required: true},
    age: Number,
    date: {
      type: Date,
      default: Date.now
    },
})

User.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12);
    next();
  });
  
  

module.exports = mongoose.model("user",User)

