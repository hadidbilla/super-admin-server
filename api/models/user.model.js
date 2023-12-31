const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  email: {type: String, require: true, unique:true},
  firstName: {type: String},
  lastName: {type: String, require: true},
  password: {type: String, require: true}
})

module.exports = mongoose.model("User", userSchema)