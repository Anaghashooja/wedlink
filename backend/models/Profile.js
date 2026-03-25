const mongoose = require("mongoose");
const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  gender: String,
  age: Number,
  profession: String,
  religion: String,
  bio: String,
  location: String
});
module.exports = mongoose.model("Profile", ProfileSchema);      