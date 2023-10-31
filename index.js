require('dotenv').config()
const express = require('express')
const index = express()
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const userRoutes = require("./api/routes/user.route")

const port = process.env.PORT || 6000;
index.listen(port, () => {
  console.log(`API listening on PORT ${port} `)
})

mongoose.connect("mongodb+srv://hadidbilla449:01749804707hb@cluster0.9xogebn.mongodb.net/?retryWrites=true&w=majority",{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: true
})

mongoose.Promise = global.Promise;
index.use(bodyParser.json());


index.use((req, res, next) => {
  console.log("called")
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

//root route
index.get("/", (req, res) => {
  res.send("Hello World");
});

index.use("/user", userRoutes)


index.use((req, res, next) => {
  const error = new Error("Not found");
  error.status = 404;
  next(error);
});

index.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});
module.exports = index;