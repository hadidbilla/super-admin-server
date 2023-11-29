const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signin", (req, res, next) => {
  const { email, password } = req.body.body;
  console.log("req.body", req.body.body);
  User.find({ email })
    .exec()
    .then((user) => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth Failed",
        });
      }

      bcrypt.compare(password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth fail",
          });
        }

        console.log("result", result);

        if (result) {
          const token = jwt.sign(
            {
              email: user[0]?.email,
              userId: user[0]?._id,
            },
            "secret",
            {
              expiresIn: "1h",
            }
          );

          return res.status(200).json({
            message: "Auth Successful",
            token: token,
          });
        }

        return res.status(401).json({
          message: "Auth Fail",
        });
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json({
        message: e,
      });
    });
});

router.post("/signup", async (req, res) => {
  try {
    const { password, lastName, firstName, email } = req.body;

    // Check if required fields are missing
    if (!password || !lastName || !firstName || !email) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Check if the email already exists in the database
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user instance
    const newUser = new User({
      _id: new mongoose.Types.ObjectId(),
      email,
      firstName,
      lastName,
      password: hashedPassword,
    });

    // Save the user to the database
    await newUser.save();

    res.status(201).json({ message: "User Created" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/", (req, res) => {
  User.find()
    .exec()
    .then((users) => {
      res.status(200).json({
        users,
      });
    })
    .catch((e) => {
      res.status(500).json({
        message: e,
      });
    });
});

router.get("/:userId", (req, res) => {
  const id = req.params.userId;
  User.findById(id)
    .exec()
    .then((user) => {
      //delete user.password;
      let { firstName, lastName, email, ...rest } = user._doc;
      res.status(200).json({
        user: {
          firstName,
          lastName,
          email,
        },
      });
    })
    .catch((e) => {
      res.status(500).json({
        message: e,
      });
    });
});

//update user
router.patch("/:userId", async (req, res) => {
  const id = req.params.userId;
  const updateFields = req.body;
  console.log("updateFields", updateFields);

  try {
    // Check if the provided ID is valid
    if (!id || !updateFields) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    // Check if the user with the provided ID exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }
    // Update the user
    await User.findByIdAndUpdate(id, { $set: updateFields }, { new: true });

    // Fetch and return the updated user
    const updatedUser = await User.findById(id);
    res.status(200).json({ user: updatedUser });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//delete user
router.delete("/:userId", async (req, res) => {
  const id = req.params.userId;

  try {
    if (!id) {
      return res.status(400).json({ message: "Invalid data provided" });
    }

    const existingUser = await User.findById(id);
    if (!existingUser) {
      return res.status(404).json({ message: "User not found" });
    }

    const deleteUser = await User.findByIdAndDelete(id);

    if (deleteUser) {
      return res.status(200).json({ message: "User deleted successfully" });
    } else {
      return res.status(500).json({ message: "Failed to delete user" });
    }
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
