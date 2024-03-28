const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  address: { type: String, required: true },
  password: { type: String, required: true },
  latitude: { type: Number },
  mobile: { type: Number, required: true },
  zipCode: { type: Number, required: true }
});
userSchema.pre("save", async function () {
  this.password = await bcrypt.hash(this.password, 10); // salt factor of 10  hashing algo
});
module.exports = mongoose.model("User", userSchema);
