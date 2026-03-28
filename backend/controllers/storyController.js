const Story = require('../models/Story');

exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find().sort({ weddingDate: -1 });
    res.json(stories);
  } catch (err) {
    res.status(500).send("Server Error");
  }
};