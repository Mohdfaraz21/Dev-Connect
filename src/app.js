const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });
const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    // methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    /* allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200 */
  }),
);

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

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
