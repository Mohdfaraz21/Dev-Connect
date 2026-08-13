const express = require("express");
const chatRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const Message = require("../models/message");

chatRouter.post(
  "/chat/send",
  userAuth,
  async (req, res) => {
    try {
      const { receiverId, message } = req.body;
      const senderId = req.user._id;

      if (!receiverId || !message || message.trim().length === 0) {
        return res.status(400).json({ message: "Receiver and message are required" });
      }

      const newMessage = new Message({
        senderId,
        receiverId,
        message: message.trim(),
      });

      const data = await newMessage.save();
      res.json({ message: "Message sent successfully", data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

chatRouter.get(
  "/chat/messages/:userId",
  userAuth,
  async (req, res) => {
    try {
      const { userId } = req.params;
      const currentUserId = req.user._id;

      const messages = await Message.find({
        $or: [
          { senderId: currentUserId, receiverId: userId },
          { senderId: userId, receiverId: currentUserId },
        ],
      })
        .sort({ createdAt: 1 })
        .limit(100);

      res.json({ message: "Messages fetched", data: messages });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

chatRouter.get(
  "/chat/conversations",
  userAuth,
  async (req, res) => {
    try {
      const currentUserId = req.user._id;

      const conversations = await Message.aggregate([
        {
          $match: {
            $or: [
              { senderId: currentUserId },
              { receiverId: currentUserId },
            ],
          },
        },
        {
          $sort: { createdAt: -1 },
        },
        {
          $group: {
            _id: {
              $cond: [
                { $eq: ["$senderId", currentUserId] },
                "$receiverId",
                "$senderId",
              ],
            },
            lastMessage: { $first: "$message" },
            lastMessageAt: { $first: "$createdAt" },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "_id",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $unwind: "$user",
        },
        {
          $project: {
            _id: 1,
            lastMessage: 1,
            lastMessageAt: 1,
            "user.firstName": 1,
            "user.lastName": 1,
            "user.photoUrl": 1,
          },
        },
      ]);

      res.json({ message: "Conversations fetched", data: conversations });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = chatRouter;
