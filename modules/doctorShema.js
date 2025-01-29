const mongoose = require("mongoose");

const doctorSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "",
    },
    speciality: {
      type: String,
      required: true,
    },
    degree: {
      type: String,
      required: true,
    },
    experience: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    available: {
      type: Boolean,
      default: true,
    },
    fees: {
      type: Number,
      required: true,
    },
    address: {
      type: Object,
      // required: true,
    },
    date: {
      type: String,
      required: true,
      default: Date.now(),
    },
    slots_booked: {
      type: Object,
      default: {},
    },
    role: {
      type: String,
      default: "doctor apply",
    },
  },
  { minimize: false }
);

const Doctor = mongoose.model("doctors", doctorSchema);
module.exports = Doctor;
