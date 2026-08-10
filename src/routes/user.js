const express = require("express");
const { userAuth } = require("../middlewares/auth");
const userRouter = express.Router();

const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

//@Get all the  pending connection request of the loggedIN user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests,
    });
  } catch (err) {
    req.statusCode(400).send("ERROR: " + err.message);
  }
});

userRouter.get("/user/connections", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser._id, status: "accepted" },
        { fromUserId: loggedInUser._id, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

userRouter.get("/feed", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const page = parseInt(req.query.page) || 1;
    let limit = parseInt(req.query.limit) || 10;
    limit = limit > 50 ? 50 : limit;
    const skip = (page - 1) * limit;

    const rawSkills = req.query.skill || req.query.skills || "";
    const requestedSkills = rawSkills
      .toString()
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean);

    const connectionRequests = await ConnectionRequest.find({
      $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const feedFilters = [
      { _id: { $nin: Array.from(hideUsersFromFeed) } },
      { _id: { $ne: loggedInUser._id } },
    ];

    if (requestedSkills.length) {
      const safePattern = requestedSkills
        .map((skill) => escapeRegExp(skill))
        .join("|");
      feedFilters.push({
        skills: {
          $elemMatch: { $regex: new RegExp(`^(${safePattern})$`, "i") },
        },
      });
    }

    const users = await User.find({
      $and: feedFilters,
    })
      .select(USER_SAFE_DATA)
      .skip(skip)
      .limit(limit);

    res.json({ data: users });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = userRouter;
