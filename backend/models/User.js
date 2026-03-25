const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // ADD THESE FIELDS
  gender: String,
  dateOfBirth: Date,
  religion: String,
  motherTongue: String,
  profession: String,
  annualIncome: String,
  photos: [String], 
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);