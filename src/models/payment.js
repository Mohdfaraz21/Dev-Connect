const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
      uppercase: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "refunded"],
      default: "pending",
      index: true,
    },
    paymentGateway: {
      type: String,
      required: true,
      enum: ["razorpay", "stripe"],
      lowercase: true,
      trim: true,
    },
    razorpayOrderId: {
      type: String,
      index: true,
    },
    razorpayPaymentId: {
      type: String,
      index: true,
    },
    razorpaySignature: {
      type: String,
    },
    planId: {
      type: String,
    },
    planName: {
      type: String,
    },
    paymentMethod: {
      type: String,
    },
    transactionId: {
      type: String,
    },
    receipt: {
      type: String,
    },
    refundId: {
      type: String,
    },
    refundStatus: {
      type: String,
    },
  },
  { timestamps: true }
);

paymentSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Payment", paymentSchema);
