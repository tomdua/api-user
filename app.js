const express = require('express')
const app = express();
app.use(express.json())
const morgan = require('morgan');
const mongoose = require('mongoose');
require("dotenv/config" );
app.use(morgan('dev'));



const userRoutes = require('./routes/user');

const coonectDB = async() => {
 await mongoose.connect(process.env.DB_CONNECTION_STRING, 
  { useUnifiedTopology: true,useNewUrlParser: true,useFindAndModify: false, useCreateIndex: true  })
  .then(client => {
    console.log('Connected to Database')
  })
  .catch(error => console.error(error))
}
coonectDB()


  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    if (req.method === 'OPTIONS') {
      res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
      return res.status(200).json({});
    }
    next();
  });

  app.use("/user", userRoutes);


  app.listen(process.env.PORT, () => {
    console.log(`Server listen on port ${process.env.PORT}`);
  });
  
  app.use((req, res, next) => {
    const error = new Error(`Not found | Invalid url path: ${req.headers.host}${req.url}`);
    error.status = 404;
    next(error);
  });

  module.exports = app;
