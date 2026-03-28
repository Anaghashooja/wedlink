const mongoose = require('mongoose');

const StorySchema = new mongoose.Schema({
  coupleNames: { type: String, required: true }, // e.g., "Amal & Anjali"
  image: { type: String, required: true },       // Cloudinary URL
  weddingDate: { type: Date },
  testimonial: { type: String, required: true }, // The "Thank You" note
  location: { type: String }
});

module.exports = mongoose.model('Story', StorySchema);