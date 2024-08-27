
const jwt = require('jsonwebtoken'); // Ensure you import jwt
const jwtToken = process.env.JWT_TOKEN; // Make sure you have your secret stored in an environment variable

const authenticateSellerOrAdmin = async (req, res, next) => {
    const token = req.cookies.token; // Assuming the JWT is stored in cookies
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtToken);
        req.userId = decoded.id; // Store the user ID for later use
        req.role = decoded.role; // Assuming you have a role field in your JWT

        // Allow access if the user is either a seller or an admin
        if (req.role === 'seller' || req.role === 'admin') {
            return next(); // Call next to proceed to the route handler
        } else {
            return res.status(403).json({ message: 'Forbidden: Access is denied' });
        }
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateSellerOrAdmin;