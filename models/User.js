const mongoose = require("mongoose");
const Schema = mongoose.Schema;
// Create Schema
const UserSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  dateOfBirth: {
    type: Date,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  photo: {
    type: String,
    required: true
  },
  appointmentTime: {
    type: Date,
    required: true,
    default: Date.now,
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    required: true,
    default: "patient"
  }
});
module.exports = User = mongoose.model("users", UserSchema);