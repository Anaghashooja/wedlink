const mongoose = require('mongoose');

const TermsSchema = new mongoose.Schema({
    version: { type: String, required: true },
    lastUpdated: { type: Date, default: Date.now },
    content: [
        {
            sectionTitle: String,
            body: String
        }
    ]
});

module.exports = mongoose.model('Terms', TermsSchema);