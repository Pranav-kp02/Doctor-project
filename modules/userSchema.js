const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullName: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    require: true,
  },
  email: {
    type: String,
    require: true,
    unique: [true, "email already exist"],
  },
  password: {
    type: String,
    require: true,
  },
  image: {
    type: String,
    default: "",
  },
  gender: {
    type: String,
    default: "",
  },
  dob: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    default: "",
  },
  role: {
    type: String,
    default: "user",
  },
  active: {
    type: String,
    default: "Active",
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
