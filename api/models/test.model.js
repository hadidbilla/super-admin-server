const mongoose = require("mongoose");

//medical test
const testSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: {type: String, require: true, unique:true},
  description: {type: String},
  price: {type: Number, require: true},
  type: {type: String, require: true},
  image: {type: String, require: true}
})

module.exports = mongoose.model("Test", testSchema)