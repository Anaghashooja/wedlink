exports.getPrivacyPolicy = async (req, res) => {
    // In a real app, this could be fetched from a 'Settings' collection in MongoDB
    const policyData = {
        lastUpdated: "April 2026",
        version: "2.1.0",
        contactEmail: "privacy@wedlink.com",
        sections: [
            { id: "collection", title: "Data Collection", icon: "shield" },
            { id: "usage", title: "How We Use Your Data", icon: "auto_awesome" },
            { id: "security", title: "Data Security", icon: "verified_user" }
        ]
    };
    res.json(policyData);
};