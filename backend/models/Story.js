const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  coupleNames: { type: String, required: true },
  image: { type: String, required: true },
  testimonial: { type: String, required: true },
  location: { type: String },
  submittedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isVerified: { type: Boolean, default: false }, // Only true shows on frontend
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Story', StorySchema);