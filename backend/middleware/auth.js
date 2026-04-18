const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    const token = req.header('Authorization')?.split(' ')[1]; // Supports "Bearer <token>"

    if (!token) {
        console.log("AUTH FAILURE: No token provided in header");
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.id ? decoded : decoded.user; // Adjust based on how you sign your token
        next();
    } catch (err) {
        console.log("AUTH FAILURE: Invalid token", err.message);
        res.status(401).json({ msg: 'Token is not valid' });
    }
};