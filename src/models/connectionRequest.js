const { request } = require("express");
const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      required:true
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      request:true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["interested", "ignored", "accepted", "rejected"],
        message: `{VALUE} is not valid type`,
      },
    },
  },
  {
    timestamps: true,
  }
);


connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

//@anytime when you call the save before run
connectionRequestSchema.pre("save", async function () {
  if (this.fromUserId.equals(this.toUserId)) {
    throw new Error("Cannot send connection request to yourself!");
  }
});

const connectionRequestModel = new mongoose.model(
  "ConnectionRequest",
  connectionRequestSchema
);

module.exports = connectionRequestModel;
