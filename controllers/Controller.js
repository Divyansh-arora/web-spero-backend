const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const calculateDistance = (lat1, lat2) => {
  // This function calculates the distance between two latitudes
  const lat1Rad = (parseFloat(lat1) * Math.PI) / 180;
  const lat2Rad = (parseFloat(lat2) * Math.PI) / 180;
  const earthRadius = 6371; // Radius of the Earth in kilometers
  const distance = Math.abs(lat1Rad - lat2Rad) * earthRadius;
  return distance;
};
module.exports = {
  addUser: async (req, res) => {
    try {
      const requiredFields = [
        "name",
        "email",
        "password",
        "address",
        "mobile",
        "zipCode",
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);
      // Validate data types
      const schemaFields = {
        name: String,
        email: String,
        password: String,
        address: String,
        latitude: Number,
        mobile: Number,
        zipCode: Number,
        // profilePic: String,
        // lang: String,
      };

      const invalidFields = [];

      for (const [field, type] of Object.entries(schemaFields)) {
        if (
          req.body[field] &&
          typeof req.body[field] !== type.name.toLowerCase()
        ) {
          invalidFields.push(field);
        }
      }

      const errors = [];

      if (missingFields.length > 0) {
        errors.push({ missingFields });
      }

      if (invalidFields.length > 0) {
        errors.push({ invalidFields });
      }

      if (errors.length > 0) {
        return res.status(400).json({ message: "Validation errors", errors });
      }

      const {
        name,
        email,
        password,
        address,
        latitude,
        mobile,
        zipCode,
        profilePic,
        lang,
      } = req.body;

      const user = await User.findOne({ email });
      console.log(user, "user");
      if (user) {
        return res.status(403).json({ message: "User already exists" });
      }

      const addUser = new User({
        name,
        email,
        password,
        address,
        latitude,
        mobile,
        zipCode,
        profilePic,
        lang,
      });
      console.log(addUser, "addUser");
      await addUser.save();
      res.status(200).json({ message: "New User Added", user: req.body });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  getAllUserData: async (req, res) => {
    try {
      const result = await User.find();
      console.log(result, "result");
      res.status(200).json({ data: result });
    } catch (error) {
      console.log(error);
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body, "req.body");
      const user = await User.findOne({ email });
      if (user) {
        const isTrue = await bcrypt.compare(password, user.password);
        console.log(isTrue, "isTrue");
        if (isTrue) {
          const token = jwt.sign(
            { username: user.name, id: user._id.toString() },
            "diviSecretKey"
          );
          console.log(token, "token");
          return res.status(200).json({
            message: "Logged in",
            token: token,
            rootId: user._id.toString(),
            rootUser: user.name,
          });
          con;
        } else {
          return res.status(401).json({ message: "Unauthorized user" });
        }
      } else {
        return res.status(401).json({ error: "Unauthorized user" });
      }
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
    }
  },
  getUser: async (req, res) => {
    try {
      const { latitude } = req.params;
      const result = await User.find(); // Fetch all users

      // Calculate distances and sort users based on the distance
      result.sort((a, b) => {
        const distanceA = calculateDistance(latitude, a.latitude);
        const distanceB = calculateDistance(latitude, b.latitude);
        return distanceA - distanceB;
      });

      closestUsers = result.slice(0, 5);

      res.status(200).json({ data: closestUsers });
    } catch (error) {
      console.log(error);
    }
  },
  // PATCH API endpoint to update user fields
updateUser: async (req, res) => {
  try {
      const allowedFields = [
          "name",
          "email",
          "password",
          "address",
          "mobile",
          "zipCode",
      ];

      const updatedFields = {};

      // Extract only the fields that are being updated from the request body
      for (const field of allowedFields) {
          if (req.body[field]) {
              updatedFields[field] = req.body[field];
          }
      }

      if (Object.keys(updatedFields).length === 0) {
          return res.status(400).json({ message: "No fields to update" });
      }

      const userId = req.params.userId;

      // Update the user document with the edited fields
      const user = await User.findByIdAndUpdate(userId, updatedFields, {
          new: true, // Return the updated document
      });

      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }

      res.status(200).json({ message: "User updated", data: user });
  } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Server Error" });
  }
}

};
