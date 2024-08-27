const authenticateSeller = async (req, res, next) => {
    const token = req.cookies.token; // Assuming the JWT is stored in cookies
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, jwtToken);
        req.sellerId = decoded.id; // Store the seller ID for later use
        next();
    } catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authenticateSeller;