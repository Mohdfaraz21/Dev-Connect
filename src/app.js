const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

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
app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);


  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
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
