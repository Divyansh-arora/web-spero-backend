const express = require("express");
const adminRoutes = require("./routes/adminRoutes");
const mongodb = require("mongoose");
const app = express();
const cookieParser = require("cookie-parser");
const cors = require('cors');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
mongodb
  .connect(
    `mongodb+srv://mernstackchain:mUeEBhB2ct1cGkFR@cluster0.d3656hr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
  )
  .then(() => console.log("MongoDB is connected"))
  .catch((err) => console.log(err));

// app.use(cookieParser());
app.use("/addUser", adminRoutes);
app.use("/loginuser", adminRoutes);
app.use("/getuser", adminRoutes);
app.use("/getAllUserData", adminRoutes);
app.use("/updateUser", adminRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
