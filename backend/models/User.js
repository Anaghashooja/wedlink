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
  membership: {
    type: String,
    enum: ['Free', 'Gold', 'Diamond'],
    default: 'Free'
  },
  membershipExpiry: {
    type: Date,
    default: null
  },
  fcmToken: { type: String, default: null },
  photos: [String],
  photoPrivacy: { 
    type: Boolean, 
    default: false // By default, photos are visible
  },
  isVerified: { type: Boolean, default: false },
  verificationStatus: { 
    type: String, 
    enum: ['none', 'pending', 'verified', 'rejected'], 
    default: 'none' 
  },
  verificationDoc: { type: String },
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", UserSchema);