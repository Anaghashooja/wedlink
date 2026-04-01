const Story = require('../models/Story');

// 1. Get only VERIFIED stories
exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find({ isVerified: true }).sort({ createdAt: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};

// 2. User submits a story (Defaults to isVerified: false)
exports.submitStory = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
        return res.status(400).json({ msg: "Please upload a wedding photo" });
    }

    const newStory = new Story({
      coupleNames: req.body.coupleNames,
      location: req.body.location,
      testimonial: req.body.testimonial,
      image: req.files[0].path, // Cloudinary URL
      submittedBy: req.user.id
    });

    await newStory.save();
    res.json({ msg: "Story submitted! It will appear once verified by our team." });
  } catch (err) {
    res.status(500).send("Error submitting story");
  }
};