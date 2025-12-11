const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");

app.use(express.json());

app.post("/signup", async (req, res) => {
  // creating a new instance of the user model
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User Added Successfully!!");
  } catch (err) {
    res.status(400).send("error while saving the user:" + err.message);
  }
});

/* @get user by Email */
app.get("/user", async (req, res) => {

  try {
  const user = await User.findOne({emailId: userEmail});
  if(!user) {
    res.status(404).send("User not found");
  } else {
    res.send(user);
  }
  
  /* const userEmail = req.body.emailId;
  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found!!");
    } else {
      res.send(users);
    } */
  } catch (err) {
    res.status(400).send("Something went wrong!!");
  } 
});

/* @Feed api  - GET all the users from the database */
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong!!");
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established....");
    app.listen(3000, () => {
      console.log("Server is successfully listening on port 3000!!..");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!!...");
  });
