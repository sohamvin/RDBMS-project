const jwt = require('jsonwebtoken');
require('dotenv').config();

const verifyToken = (req, res, next) => {
    // Get token from the Authorization header
    const authHeader = req.headers['authorization'];
    
    // Check if the token is provided and starts with 'Bearer'
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({ error: 'No token provided or invalid token format' });
    }

    // Extract the token by removing the 'Bearer ' prefix
    const token = authHeader.split(' ')[1];

    // Verify the token using the secret key
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: 'Failed to authenticate token' });
        }
        
        // Save the decoded user ID to the request for use in other routes
        req.user = { userId: decoded.id };  // Adjust 'decoded' fields based on your token payload structure

        // Proceed to the next middleware or route handler
        next();
    });
};

module.exports = verifyToken;
