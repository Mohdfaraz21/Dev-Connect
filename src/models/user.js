const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    minLength:4,
    maxLength:30,
  },
  lastName: {
    type: String,
  },
  emailId: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    unique: true,
  },
  password: {
    type: String,
    require: true,
  },
  age: {
    type: Number,
    min:18,
  },
  gender: {
    type: String,
    validate(value) {
      if(!["male", "female", "others"].includes(value)){
        throw new Error("Gender data is not valid");
      }
    },
  },
  photoUrl: {
    type: String,
    default:
      "https://www.pngitem.com/middle/ixJxmw_profile-pic-dummy-png-transparent-png/",
  },
  about: {
    type: String,
    default: "This is a default about of the user!",
  },
  skills: {
    type: [String],
  },
}, {
  timestamps:true,
});

module.exports = mongoose.model("User", userSchema);
