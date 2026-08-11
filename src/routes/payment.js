const express = require("express");
const crypto = require("crypto");
const paymentRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const Payment = require("../models/payment");
const razorpay = require("../utils/razorpay");

paymentRouter.post(
  "/payment/create",
  userAuth,
  async (req, res) => {
    try {
      const { amount, currency, paymentGateway, planId, planName, receipt } = req.body;
      const userId = req.user._id;

      if (!amount || !paymentGateway) {
        return res.status(400).json({ message: "Amount and payment gateway are required" });
      }

      if (paymentGateway !== "razorpay") {
        return res.status(400).json({ message: "Unsupported payment gateway" });
      }

      const allowedPlans = [
        { id: "silver", amount: 299 },
        { id: "gold", amount: 499 },
      ];

      const plan = allowedPlans.find((p) => p.id === planId);
      if (!plan) {
        return res.status(400).json({ message: "Invalid plan" });
      }

      if (Number(amount) !== plan.amount) {
        return res.status(400).json({ message: "Amount does not match selected plan" });
      }

      const options = {
        amount: Number(amount) * 100,
        currency: currency || "INR",
        receipt: receipt || `receipt_order_${Date.now()}`,
        payment_capture: 1,
      };

      const order = await razorpay.orders.create(options);

      const payment = new Payment({
        userId,
        amount: Number(amount),
        currency: options.currency,
        paymentGateway,
        razorpayOrderId: order.id,
        status: "pending",
        planId,
        planName,
        receipt: options.receipt,
      });

      const data = await payment.save();
      res.json({
        message: "Payment order created",
        order,
        payment: data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

paymentRouter.post(
  "/payment/verify",
  userAuth,
  async (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, paymentId } = req.body;

      const body = razorpay_order_id + "|" + razorpay_payment_id;
      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
        .update(body)
        .digest("hex");

      if (expectedSignature !== razorpay_signature) {
        return res.status(400).json({ message: "Invalid payment signature" });
      }

      const payment = paymentId
        ? await Payment.findById(paymentId)
        : await Payment.findOne({ razorpayOrderId: razorpay_order_id });

      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }

      if (payment.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (payment.razorpayOrderId && payment.razorpayOrderId !== razorpay_order_id) {
        return res.status(400).json({ message: "Order ID mismatch" });
      }

      payment.status = "completed";
      payment.razorpayPaymentId = razorpay_payment_id;
      payment.razorpaySignature = razorpay_signature;

      const data = await payment.save();
      res.json({ message: "Payment verified successfully", data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

paymentRouter.get(
  "/payment/history",
  userAuth,
  async (req, res) => {
    try {
      const userId = req.user._id;
      const payments = await Payment.find({ userId }).sort({ createdAt: -1 });
      res.json({ message: "Payment history", data: payments });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

paymentRouter.get(
  "/payment/plans",
  async (req, res) => {
    try {
      const plans = [
        {
          id: "silver",
          name: "Silver",
          amount: 299,
          currency: "INR",
          duration: "month",
          requests: "100/day",
          features: [
            "100 requests per day",
            "Premium content access",
            "Advanced search filters",
            "Ad-free experience",
            "Profile boost",
          ],
        },
        {
          id: "gold",
          name: "Gold",
          amount: 499,
          currency: "INR",
          duration: "month",
          requests: "Unlimited",
          features: [
            "Unlimited requests per day",
            "Full premium access",
            "Priority search ranking",
            "Exclusive feed access",
            "Priority support",
          ],
        },
      ];
      res.json({ message: "Available plans", data: plans });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

paymentRouter.get(
  "/payment/:id",
  userAuth,
  async (req, res) => {
    try {
      const { id } = req.params;
      const payment = await Payment.findById(id);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      if (payment.userId.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      res.json({ message: "Payment details", data: payment });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = paymentRouter;
