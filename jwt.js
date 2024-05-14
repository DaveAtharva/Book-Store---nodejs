const jwt = require('jsonwebtoken');

// JWT authentication middleware
const jwtauthmiddleware = async (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        if (!token) {
            return res.status(401).json({ error: 'Unauthorized: No token provided' });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        req.user = decoded;
        // console.log(decoded);
        next();
    } catch (error) {
        console.error('Error verifying token:', error);
        return res.status(401).json({ error: 'Unauthorized: Invalid token' });
    }
};

// Admin authentication middleware
const adminAuthMiddleware = (req, res, next) => {
    try {
        let token;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }
        const decoded = jwt.verify(token, process.env.JWT_TOKEN);
        console.log(decoded);
        console.log(decoded.isAdmin);
        if (!decoded || !decoded.isAdmin) {
            return res.status(403).json({ message: 'Unauthorized: User is not an admin' });
        }
        next();
    } catch (error) {
        console.error('Error in adminAuthMiddleware:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

// Generate JWT token
const generateToken = async (userData) => {
    try {
        const token = await jwt.sign(userData, process.env.JWT_TOKEN); // use ,{expiresIn:3000} to set expiration time
        return token;
    } catch (error) {
        console.error('Error generating token:', error);
        throw new Error('Error generating token');
    }
};

module.exports = { jwtauthmiddleware, generateToken, adminAuthMiddleware };
