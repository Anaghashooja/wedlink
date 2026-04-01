module.exports = function (req, res, next) {
    // Check for the custom API key header (e.g., "x-api-key")
    const apiKey = req.header('x-api-key');

    // You should define POWERBI_SECRET in your backend .env file
    // If it's missing, it defaults to a fallback for safety but you should set it!
    const validKey = process.env.POWERBI_SECRET || 'secure-fallback-key-123!!'; 

    if (!apiKey || apiKey !== validKey) {
        return res.status(401).json({ msg: 'Unauthorized: Invalid or missing API Key for Power BI' });
    }

    next();
};
