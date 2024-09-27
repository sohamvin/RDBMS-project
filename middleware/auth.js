// middleware/auth.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(403).json({ error: 'No token provided' });
    }

    // Remove 'Bearer ' from the token string if present
    const bearerToken = token.startsWith('Bearer ') ? token.slice(7, token.length) : token;

    jwt.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }
        // Save the decoded token to the request for use in other routes
        req.userId = decoded.id;
        next();
    });

    return;
};

module.exports = verifyToken;
