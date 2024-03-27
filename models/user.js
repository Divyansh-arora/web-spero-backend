const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  latitude: { type: Number },
  mobile: { type: Number, required: true },
  zipCode: { type: Number, required: true },
  // profilePic: { type: String },
  // lang: { type: String },
});
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10);
});
module.exports = mongoose.model("User", userSchema);
