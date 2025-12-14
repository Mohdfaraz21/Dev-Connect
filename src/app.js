const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");

app.use(express.json());
app.use(cookieParser());

//@SignUp API
app.post("/signup", async (req, res) => {
  try {
    /* @Validate sign up data */
    validateSignUpData(req);

    /* @Encrypt password */
    const { firstName, lastName, emailId, password } = req.body;

    const HashedPassword = await bcrypt.hash(password, 10);
    console.log(HashedPassword);

    // creating a new instance of the user model
    const user = new User({
      firstName,
      lastName,
      emailId,
      password: HashedPassword,
    });

    await user.save();
    res.send("User Added Successfully!!");
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//@Login API
app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials.");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      // create a jwt token
      const token = await jwt.sign({ _id: user._id }, "Dev-Connect@22");

      // Add the token to the cookie and send the response back to the user
      res.cookie("token", token);
      res.send("Login Successfull!!");
    } else {
      throw new Error("Invalid Credentials.");
    }
  } catch (err) {
    res.status(400).send("ERROR : " + err.message);
  }
});

//@profile API
app.get("/profile", async (req, res) => {

  try {
    const cookies = req.cookies;
    
    const { token } = cookies;
    
      if(!token) {
        throw new Error("Invalid credentials!")
      }

    // Validate my token
    const messageDecoded = await jwt.verify(token, "Dev-Connect@22");
    const { _id } = messageDecoded;
    console.log("Logged In user id: " + _id);
    
    const user = await User.findById(_id);
    if(!user) {
      throw new Error("User does not exist.")
    }
    
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

/* @get user by Email */
app.get("/user", async (req, res) => {
  try {
    const user = await User.findOne({ emailId: userEmail });
    if (!user) {
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

/* @delete api */
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);

    res.send("User deleted Successfully...");
  } catch (err) {
    res.status(400).send("Something went wrong!!");
  }
});

/* @update data of the user */
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "photoUrl",
      "about",
      "gender",
      "age",
      "skills",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );
    if (!isUpdateAllowed) {
      throw new Error("Update not allowed!!.");
    }
    if (data?.skills.length > 10) {
      throw new Error("Skills cannot be more than 10");
    }
    await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    res.send("User updated successfully...");
  } catch (err) {
    res.status(400).send("Failed to Update:" + err.message);
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
