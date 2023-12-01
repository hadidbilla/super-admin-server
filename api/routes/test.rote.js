const express = require("express");
const router = express.Router();
const mongoose = require("mongoose")
const Test = require("../models/test.model")

router.get('/', async (req, res, next) => {
  try{

    const tests = await Test.find({})
    res.status(200).json({
      tests
    })
  } catch (e) {
    console.log(e)
    res.status(500).json({
      message: e
    })
  }
    
})