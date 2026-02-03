const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://faraz:Faraz22@dev-connect.pajlzum.mongodb.net/Dev-connect");
};

module.exports = connectDB;

