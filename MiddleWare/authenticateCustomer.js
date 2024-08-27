const jwt = require('jsonwebtoken');

const authenticateCustomer = async (req, res, next) => {
    const token = req.cookies.token; // Assuming the JWT is stored in cookies
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Replace with your actual JWT secret
        req.customerId = decoded.id; // Store the customer ID for later use

        next();
    } catch (error) {
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};

module.exports = authenticateCustomer;