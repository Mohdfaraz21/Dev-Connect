const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const crypto = require("crypto");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);

app.post(
  "/payment/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    try {
      const signature = req.headers["x-razorpay-signature"];
      if (!signature) {
        return res.status(400).json({ message: "Missing signature" });
      }

      const expectedSignature = crypto
        .createHmac("sha256", process.env.RAZORPAY_WEBHOOK_SECRET)
        .update(req.body)
        .digest("hex");

      if (expectedSignature !== signature) {
        return res.status(400).json({ message: "Invalid webhook signature" });
      }

      const event = JSON.parse(req.body);
      const eventType = event.event;
      const payload = event.payload.payment.entity;

      const Payment = require("./models/payment");

      if (eventType === "payment.captured") {
        await Payment.findOneAndUpdate(
          { razorpayOrderId: payload.order_id, status: { $nin: ["completed", "refunded"] } },
          {
            status: "completed",
            razorpayPaymentId: payload.id,
            paymentMethod: payload.method,
          }
        );
      } else if (eventType === "payment.failed") {
        await Payment.findOneAndUpdate(
          { razorpayOrderId: payload.order_id, status: { $nin: ["completed", "refunded"] } },
          { status: "failed" }
        );
      } else if (eventType === "refund.processed" || eventType === "refund.failed") {
        await Payment.findOneAndUpdate(
          { razorpayOrderId: payload.order_id },
          {
            status: eventType === "refund.processed" ? "refunded" : "failed",
            refundId: payload.refund_id,
            refundStatus: eventType === "refund.processed" ? "processed" : "failed",
          }
        );
      }

      res.json({ status: "ok" });
    } catch (err) {
      console.error("Webhook error:", err);
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
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
    console.error(err);
  });
