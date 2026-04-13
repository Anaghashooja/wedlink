exports.getTerms = async (req, res) => {
    // Serving static data for now, but structured so it can move to DB easily
    const termsData = {
        version: "2026.1",
        lastUpdated: "October 24, 2024",
        sections: [
            { id: "acceptance", title: "Acceptance of Terms" },
            { id: "eligibility", title: "User Eligibility" },
            { id: "conduct", title: "Code of Conduct" },
            { id: "subscription", title: "Subscription Terms" },
            { id: "liability", title: "Limitation of Liability" }
        ]
    };
    res.json(termsData);
};