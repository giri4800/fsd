const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Middleware
const app = express();
app.use(express.json());
app.use(cors());
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

// MongoDB Connection String
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://girishNB:Qwe123%2B-%40@cluster0.8kdub.mongodb.net/test?retryWrites=true&w=majority";

// MongoDB Connection Function
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGODB_URI, {
      ssl: true,
      sslValidate: true,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);
    process.exit(1); // Exit if unable to connect
  }
};

// Connect to MongoDB
connectDB();

// Error handling for after initial connection
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

// Start server only after DB connection
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server Started on port ${PORT}`);
});

// Import Models
require("./userDetails");
require("./transit");
require("./outward");

const User = mongoose.model("UserInfo");
const Transit = mongoose.model("Transit");
const Lot = mongoose.model("Outward");

const JWT_SECRET = process.env.JWT_SECRET || "secretkey";

// User Registration Route
app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.json({ error: "User Exists" });
    }

    await User.create({
      fname,
      lname,
      email,
      password: encryptedPassword,
      userType,
    });

    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.send({ status: "error" });
  }
});

// User Login Route
app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, { expiresIn: "15m" });

    return res.json({
      status: "ok",
      data: token,
      userType: user.userType,
    });
  }

  res.json({ status: "error", error: "Invalid Password" });
});

// Forgot Password Route
app.post("/forgot-password", async (req, res) => {
  const { email } = req.body;
  try {
    const oldUser = await User.findOne({ email });
    if (!oldUser) {
      return res.json({ status: "User Not Exists!!" });
    }

    const secret = JWT_SECRET + oldUser.password;
    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, secret, {
      expiresIn: "5m",
    });
    const link = `http://localhost:5000/reset-password/${oldUser._id}/${token}`;

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    var mailOptions = {
      from: process.env.EMAIL_USER,
      to: oldUser.email,
      subject: "Password Reset",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (error) {
    console.error("Error in forgot password:", error);
  }
});

// Reset Password Route
app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }

  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    res.render("index", { email: verify.email, status: "Not Verified" });
  } catch (error) {
    console.log(error);
    res.send("Not Verified");
  }
});

app.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  const oldUser = await User.findOne({ _id: id });
  if (!oldUser) {
    return res.json({ status: "User Not Exists!!" });
  }

  const secret = JWT_SECRET + oldUser.password;
  try {
    const verify = jwt.verify(token, secret);
    const encryptedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      { _id: id },
      { $set: { password: encryptedPassword } }
    );
    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

// Get All Users Route with Search
app.get("/getAllUser", async (req, res) => {
  let query = {};
  const searchData = req.query.search;
  if (searchData) {
    query = {
      $or: [
        { fname: { $regex: searchData, $options: "i" } },
        { email: { $regex: searchData, $options: "i" } },
      ],
    };
  }

  try {
    const allUser = await User.find(query);
    res.send({ status: "ok", data: allUser });
  } catch (error) {
    console.log(error);
  }
});

// Delete User Route
app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    await User.deleteOne({ _id: userid });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

// Create Transit Route
app.post("/create-transit", async (req, res) => {
  const { date, invoice, lotNo, vehicleNo, ewayNo, factory, center, to, udNo, lrNo, bales } = req.body;

  try {
    const newTransit = new Transit({
      date,
      invoice,
      lotNo,
      vehicleNo,
      ewayNo,
      factory,
      center,
      to,
      udNo,
      lrNo,
      bales,
    });

    await newTransit.save();
    res.status(201).json({ message: "Transit data saved successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get All Transits Route with Filters
app.get("/getAllTransits", async (req, res) => {
  try {
    const { centerQuery = "", fromDate, toDate, page = 1 } = req.query;
    const recordsPerPage = 8;

    // Build filters
    const filters = {};

    if (centerQuery) filters.center = { $regex: centerQuery, $options: "i" }; // Case-insensitive search for center
    if (fromDate || toDate) {
      filters.date = {};
      if (fromDate) filters.date.$gte = new Date(fromDate);  // From date filter
      if (toDate) filters.date.$lte = new Date(toDate);  // To date filter
    }

    // Aggregate total bales for the filtered center
    const totalBales = await Transit.aggregate([
      { $match: filters },
      { $group: { _id: null, totalBales: { $sum: { $toDouble: "$bales" } } } },
    ]);

    // Fetch paginated records
    const totalRecords = await Transit.countDocuments(filters);
    const data = await Transit.find(filters)
      .skip((page - 1) * recordsPerPage)
      .limit(recordsPerPage);

    res.status(200).json({
      success: true,
      data,
      totalBales: totalBales[0]?.totalBales || 0,
      totalRecords,
      recordsPerPage,
    });
  } catch (error) {
    console.error("Error in /getAllTransits:", error.message);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});
