const mongoose = require('mongoose');
const ReportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  reason: { type: String, default: "Inappropriate behavior" },
  date: { type: Date, default: Date.now }
});
module.exports = mongoose.model('Report', ReportSchema);