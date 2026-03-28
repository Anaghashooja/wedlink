const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const { upload } = require('../config/cloudinary');

// Register user and upload photos
const register = async (req, res) => {
    try {
        const { name, email, password, gender, dateOfBirth, religion, motherTongue, profession, annualIncome } = req.body;

        // 1. Check if user exists
        let user = await User.findOne({ email });
        if (user) return res.status(400).json({ msg: "User already exists" });

        // 2. Extract Cloudinary URLs from req.files
        const photoUrls = req.files ? req.files.map(file => file.path) : [];

        // 3. Create User
        user = new User({
            name,
            email,
            password,
            gender,
            dateOfBirth,
            religion,
            motherTongue,
            profession,
            annualIncome,
            photos: photoUrls // Make sure your User Model has a 'photos' field (Array of Strings)
        });

        // 4. Hash Password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // 5. Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token, user: { id: user._id, name: user.name } });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: err.message || "Server Error during registration" });
    }
};

// Google authentication
const googleAuth = async (req, res) => {
    const { token } = req.body;

    try {
        // 1. Verify Google Token
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID,
        });
        const { name, email, picture } = ticket.getPayload();

        // 2. Check if user exists
        let user = await User.findOne({ email });

        if (!user) {
            // Create new user if first time (password is not needed for Google users)
            user = new User({
                name,
                email,
                password: await bcrypt.hash(Math.random().toString(36), 10), // Random placeholder
            });
            await user.save();
        }

        // 3. Generate our own JWT
        const ourToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.json({ token: ourToken, user: { id: user._id, name: user.name } });

    } catch (err) {
        console.error(err);
        res.status(400).json({ msg: 'Google authentication failed' });
    }
};

// Login user
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        // 2. Compare hashed password with typed password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ msg: "Invalid credentials" });
        }

        // 3. Generate Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.json({
            token,
            user: { id: user._id, name: user.name }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server error");
    }
};

// Get matches (all users)
const getMatches = async (req, res) => {
    try {
        const Request = require('../models/Request');
        const users = await User.find().select("-password").lean();
        
        // Enhance each user with connection status relative to the requester
        const usersWithStatus = await Promise.all(users.map(async (u) => {
            const conn = await Request.findOne({
                $or: [
                    { sender: req.user.id, receiver: u._id },
                    { sender: u._id, receiver: req.user.id }
                ]
            });
            return { ...u, connectionStatus: conn ? conn.status : 'none' };
        }));

        res.json(usersWithStatus);
    } catch (err) {
        res.status(500).send("Server Error");
    }
};

const getProfile = async (req, res) => {
    try {
        const User = require('../models/User'); // Ensure User model is imported here or at top
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).send('Server Error');
    }
};
const getPublicProfile = async (req, res) => {
   try {
        const Request = require('../models/Request');
        const user = await User.findById(req.params.id).select("-password").lean();
        
        if (!user) {
            return res.status(404).json({ msg: "User not found" });
        }

        const conn = await Request.findOne({
            $or: [
                { sender: req.user.id, receiver: user._id },
                { sender: user._id, receiver: req.user.id }
            ]
        });
        
        user.connectionStatus = conn ? conn.status : 'none';
        res.json(user);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: "User not found" });
        }
        res.status(500).send("Server Error");
    }
};
const searchUsers = async (req, res) => {
    try {
        const { minAge, maxAge, religion, profession, minIncome, hobbies } = req.query;
        let query = { _id: { $ne: req.user.id } }; // Exclude the current user

        // 1. Age Logic (Calculated from Date of Birth)
        if (minAge || maxAge) {
            const now = new Date();
            if (minAge) {
                const minDate = new Date(now.getFullYear() - minAge, now.getMonth(), now.getDate());
                query.dateOfBirth = { ...query.dateOfBirth, $lte: minDate };
            }
            if (maxAge) {
                const maxDate = new Date(now.getFullYear() - maxAge, now.getMonth(), now.getDate());
                query.dateOfBirth = { ...query.dateOfBirth, $gte: maxDate };
            }
        }

        // 2. Exact Match Filters
        if (religion) query.religion = religion;

        // 3. Partial Match / Search Filters
        if (profession) query.profession = { $regex: profession, $options: 'i' };
        if (hobbies) query.hobbies = { $in: hobbies.split(',') }; // Assuming comma-separated string

        const results = await User.find(query).select("-password").lean();
        const Request = require('../models/Request');

        const resultsWithStatus = await Promise.all(results.map(async (u) => {
            const conn = await Request.findOne({
                $or: [
                    { sender: req.user.id, receiver: u._id },
                    { sender: u._id, receiver: req.user.id }
                ]
            });
            return { ...u, connectionStatus: conn ? conn.status : 'none' };
        }));

        res.json(resultsWithStatus);
    } catch (err) {
        res.status(500).send("Search Error");
    }
};
const submitVerification = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ msg: "Please upload a verification document" });
        }
        
        const user = await User.findById(req.user.id);
        user.verificationDoc = req.files[0].path; // Store the Cloudinary URL
        user.verificationStatus = 'pending';
        await user.save();

        res.json({ msg: "Verification submitted for review", status: 'pending' });
    } catch (err) {
        res.status(500).send("Server Error");
    }
};
const togglePrivacy=async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        user.photoPrivacy = !user.photoPrivacy;
        await user.save();
        res.json({ photoPrivacy: user.photoPrivacy, msg: "Privacy updated" });
    } catch (err) { res.status(500).send("Error updating privacy"); }
};
module.exports = {
    register,
    googleAuth,
    login,
    getMatches,
    getProfile,
    getPublicProfile,
    searchUsers,
    submitVerification,
    togglePrivacy
};
