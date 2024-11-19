const express = require("express");
const app = express();
const mongoose = require("mongoose");
app.use(express.json());
const cors = require("cors");
app.use(cors());
const bcrypt = require("bcryptjs");
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));


const jwt = require("jsonwebtoken");
var nodemailer = require("nodemailer");

const JWT_SECRET =
  "hvdvay6ert72839289()aiyg8t87qt72393293883uhefiuh78ttq3ifi78272jbkj?[]]pou89ywe";
 

  mongoose.connect('mongodb+srv://girishNB:Qwe123%2B-%40@cluster0.8kdub.mongodb.net/test?retryWrites=true&w=majority', {
    useNewUrlParser: true,
    useUnifiedTopology: true
   })
  .then(() => {
    console.log("Connected to database");
  })
  .catch((e) => console.log(e));

require("./userDetails");
 

const User = mongoose.model("UserInfo");
 
app.post("/register", async (req, res) => {
  const { fname, lname, email, password, userType} = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  console.log(req.body); // Log the request body

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
      // Ensure firm is included
    });

    res.send({ status: "ok" });
  } catch (error) {
    console.error("Error creating user:", error);
    res.send({ status: "error" });
  }
});

app.post("/login-user", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: "User Not found" });
  }

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ email: user.email }, JWT_SECRET, {
      expiresIn: "15m",
    });

    return res.json({
      status: "ok",
      data: token, // Send firm data in the response
      userType: user.userType,
    });
  }

  res.json({ status: "error", error: "Invalid Password" });
});


app.post("/userData", async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, JWT_SECRET, (err, res) => {
      if (err) {
        return "token expired";
      }
      return res;
    });
    console.log(user);
    if (user == "token expired") {
      return res.send({ status: "error", data: "token expired" });
    }

    const useremail = user.email;
    User.findOne({ email: useremail })
      .then((data) => {
        res.send({ status: "ok", data: data });
      })
      .catch((error) => {
        res.send({ status: "error", data: error });
      });
  } catch (error) {}
});

app.listen(5000, () => {
  console.log("Server Started");
});

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
        user: "adarsh438tcsckandivali@gmail.com",
        pass: "rmdklolcsmswvyfw",
      },
    });

    var mailOptions = {
      from: "youremail@gmail.com",
      to: "thedebugarena@gmail.com",
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
  } catch (error) {}
});

app.get("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  console.log(req.params);
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
      {
        _id: id,
      },
      {
        $set: {
          password: encryptedPassword,
        },
      }
    );

    res.render("index", { email: verify.email, status: "verified" });
  } catch (error) {
    console.log(error);
    res.json({ status: "Something Went Wrong" });
  }
});

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

app.post("/deleteUser", async (req, res) => {
  const { userid } = req.body;
  try {
    User.deleteOne({ _id: userid }, function (err, res) {
      console.log(err);
    });
    res.send({ status: "Ok", data: "Deleted" });
  } catch (error) {
    console.log(error);
  }
});

 

 

app.get("/paginatedUsers", async (req, res) => {
  const allUser = await User.find({});
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);

  const startIndex = (page - 1) * limit;
  const lastIndex = page * limit;

  const results = {};
  results.totalUser = allUser.length;
  results.pageCount = Math.ceil(allUser.length / limit);

  if (lastIndex < allUser.length) {
    results.next = {
      page: page + 1,
    };
  }
  if (startIndex > 0) {
    results.prev = {
      page: page - 1,
    };
  }
  results.result = allUser.slice(startIndex, lastIndex);
  res.json(results);
});

require("./transit");
const Transit = require("./transit");



app.post('/create-transit', async (req, res) => {
  const { date,invoice, lotNo, vehicleNo, ewayNo, factory, center, to, udNo, lrNo, bales } = req.body;

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
          bales
      });

      await newTransit.save();
      res.status(201).json({ message: 'Transit data saved successfully' });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});

app.get("/getAllTransits", async (req, res) => {
  try {
    const { centerQuery = "", fromDate, toDate, page = 1 } = req.query;
    const recordsPerPage = 8;

    // Build filters
    const filters = {};

    // Update filter to search based on center instead of "to" address
    if (centerQuery) filters.center = { $regex: centerQuery, $options: "i" }; // Case-insensitive search for center

    if (fromDate || toDate) {
      filters.date = {};
      if (fromDate) filters.date.$gte = new Date(fromDate);  // From date filter
      if (toDate) filters.date.$lte = new Date(toDate);  // To date filter
    }

    // Aggregate total bales for the filtered center
    const totalBales = await Transit.aggregate([
      { $match: filters },
      { $group: { _id: null, totalBales: { $sum: { $toDouble: "$bales" } } } }, // Sum total bales
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
      message: "An error occurred while fetching transits.",
    });
  }
});




app.post('/deleteTransits', async (req, res) => {
  const { id } = req.body; // Assuming the ID is passed in the request body

  if (!id) {
      return res.status(400).json({ message: "Transit ID is required" });
  }

  try {
      const deletedTransit = await Transit.findByIdAndDelete(id);

      if (deletedTransit) {
          res.json({ message: "Transit record deleted successfully" });
      } else {
          res.status(404).json({ message: "Transit record not found" });
      }
  } catch (error) {
      console.error("Error deleting transit record:", error);
      res.status(500).json({ message: "Server error" });
  }
});


const outward = require("./outward");

app.post('/create-outWard', async (req, res) => {
  const { date, lotNo, bales ,center} = req.body;

  try {
      const newOutward = new outward({
          date,
          lotNo,
          bales, 
          center
           
          
      });

      await newOutward.save();
      res.status(201).json({ message: 'Transit data saved successfully' });
  } catch (error) {
      res.status(400).json({ message: error.message });
  }
});
 
const Lot = require("./outward"); // Import the Lot model
 
// API to get all lots (with optional search query)
app.get("/getAllLots", async (req, res) => {
  try {
    const searchQuery = req.query.search || "";
    const filter = searchQuery
      ? { lotNo: { $regex: searchQuery, $options: "i" } }
      : {}; // Case insensitive search by LotNo

    const lots = await Lot.find(filter);
    res.json({ data: lots });
  } catch (error) {
    res.status(500).json({ message: "Error fetching lots", error });
  }
});

// API to delete a lot by ID
app.post("/deleteLot", async (req, res) => {
  const { lotId } = req.body;
  try {
    const deletedLot = await Lot.findByIdAndDelete(lotId);

    if (deletedLot) {
      res.json({ message: "Lot deleted successfully" });
    } else {
      res.status(404).json({ message: "Lot not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting lot", error });
  }
});

 
