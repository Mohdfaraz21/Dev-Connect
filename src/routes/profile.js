const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const { validateEditProfileData } = require("../utils/validation");
const user = require("../models/user");
const bcrypt = require("bcrypt");
const upload = require("../middlewares/upload");

//@profile API
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.json({ data: user.toJSON() });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//@profileEdit API
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    console.log("BODY:", req.body);
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid request.");
    }
    const loggedInUser = req.user;
    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({
      message: `${loggedInUser.firstName}, your profile updated successfully`,
      data: loggedInUser.toJSON(),
    });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

//@Change Password API
profileRouter.patch("/profile/changePassword", userAuth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const loggedInUser = req.user;

    if (!oldPassword || !newPassword) {
      throw new Error("Credentials must be required");
    }

    const isValid = await loggedInUser.comparePassword(oldPassword);

    if (!isValid) {
      throw new Error("Invalid credentials");
    }
    if (newPassword.length < 8) {
      throw new Error("Password must be at least 8 characters long");
    }

    loggedInUser.password = await bcrypt.hash(newPassword, 10);
    await loggedInUser.save();
    res.send("Password updated successfully.");
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

profileRouter.post(
  "/profile/upload-photo",
  userAuth,
  upload.single("photo"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const photoUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

      const loggedInUser = req.user;
      loggedInUser.photoUrl = photoUrl;
      await loggedInUser.save();

      res.json({
        message: "Photo uploaded successfully",
        data: loggedInUser.toJSON(),
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = profileRouter;
