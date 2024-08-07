const jwt = require('jsonwebtoken');
const User = require('./models/User');

const logger = (req, res, next) => {
    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Incoming request: ${req.method} ${req.url}`);
    next();
};

const auth = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = await User.findById(decoded.userId).select('-password');
        if (!req.user) {
            return res.status(404).json({ message: 'User not found' });
        }
        next();
    } catch (error) {
        console.error('Token verification error:', error);
        res.status(400).json({ message: 'Token is not valid' });
    }
};

module.exports = {
    logger,
    auth,
};