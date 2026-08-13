const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const crypto = require("crypto");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const { sendEmail } = require("./utils/email");
const User = require("./models/user");
const Message = require("./models/message");
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
      const User = require("./models/user");

      if (eventType === "payment.captured") {
        const updatedPayment = await Payment.findOneAndUpdate(
          { razorpayOrderId: payload.order_id, status: { $nin: ["completed", "refunded"] } },
          {
            status: "completed",
            razorpayPaymentId: payload.id,
            paymentMethod: payload.method,
          },
          { new: true }
        );

        if (updatedPayment) {
          const user = await User.findById(updatedPayment.userId);
          if (user) {
            const receiptHtml = `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
                <h2 style="color: #6366f1;">Payment Receipt - DevConnect</h2>
                <p>Hi ${user.firstName},</p>
                <p>Thank you for your payment! Here are your transaction details:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                  <tr style="background: #f3f4f6;">
                    <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Plan</strong></td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">${updatedPayment.planName || "Premium"}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Amount</strong></td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">₹${updatedPayment.amount}</td>
                  </tr>
                  <tr style="background: #f3f4f6;">
                    <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Transaction ID</strong></td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">${updatedPayment.razorpayPaymentId}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Payment Method</strong></td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">${updatedPayment.paymentMethod || "Online"}</td>
                  </tr>
                  <tr style="background: #f3f4f6;">
                    <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Date</strong></td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;">${new Date(updatedPayment.createdAt).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #e5e7eb;"><strong>Status</strong></td>
                    <td style="padding: 10px; border: 1px solid #e5e7eb; color: #16a34a; font-weight: bold;">Completed</td>
                  </tr>
                </table>
                <p>Your premium features are now active!</p>
                <p style="color: #666; font-size: 14px;">If you have any questions, reply to this email.</p>
              </div>
            `;

            sendEmail({
              to: user.emailId,
              subject: "DevConnect - Payment Receipt",
              html: receiptHtml,
            }).catch((err) => console.error("Payment receipt email failed:", err));
          }
        }
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
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const paymentRouter = require("./routes/payment");
const chatRouter = require("./routes/chat");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter);
app.use("/", chatRouter);

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

    const httpServer = createServer(app);
    const io = new Server(httpServer, {
      cors: {
        origin: "http://localhost:5173",
        credentials: true,
      },
    });

    const onlineUsers = new Map();

    io.use(async (socket, next) => {
      try {
        const token = socket.handshake.auth.token;
        if (!token) {
          return next(new Error("Authentication error"));
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded._id);
        if (!user) {
          return next(new Error("Authentication error"));
        }
        socket.user = user;
        next();
      } catch (err) {
        next(new Error("Authentication error"));
      }
    });

    io.on("connection", (socket) => {
      const userId = socket.user._id.toString();
      onlineUsers.set(userId, socket.id);
      socket.join(userId);

      io.emit("onlineUsers", Array.from(onlineUsers.keys()));

      socket.on("sendMessage", async (data) => {
        try {
          const { receiverId, message } = data;
          if (!receiverId || !message || message.trim().length === 0) {
            return;
          }

          const newMessage = new Message({
            senderId: socket.user._id,
            receiverId,
            message: message.trim(),
          });
          await newMessage.save();

          const messagePayload = {
            _id: newMessage._id,
            senderId: socket.user._id,
            receiverId,
            message: newMessage.message,
            createdAt: newMessage.createdAt,
          };

          socket.to(receiverId).emit("receiveMessage", messagePayload);
          socket.emit("receiveMessage", messagePayload);
        } catch (err) {
          console.error("Socket sendMessage error:", err);
        }
      });

      socket.on("typing", (receiverId) => {
        socket.to(receiverId).emit("typing", { userId: socket.user._id.toString() });
      });

      socket.on("stopTyping", (receiverId) => {
        socket.to(receiverId).emit("stopTyping", { userId: socket.user._id.toString() });
      });

      socket.on("markAsRead", async (data) => {
        try {
          const { senderId } = data;
          await Message.updateMany(
            {
              senderId,
              receiverId: socket.user._id,
              readBy: { $ne: socket.user._id.toString() },
            },
            {
              $addToSet: { readBy: socket.user._id.toString() },
              $set: { readAt: new Date() },
            }
          );

          const messages = await Message.find({
            senderId,
            receiverId: socket.user._id,
          }).select("_id readBy readAt");

          io.to(senderId).emit("messagesRead", {
            readerId: socket.user._id.toString(),
            messages,
          });
        } catch (err) {
          console.error("Socket markAsRead error:", err);
        }
      });

      socket.on("disconnect", () => {
        onlineUsers.delete(userId);
        io.emit("onlineUsers", Array.from(onlineUsers.keys()));
      });
    });

    httpServer.listen(3000, () => {
      console.log("Server is successfully listening on port 3000!!..");
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!!...");
    console.error(err);
  });
