const verifyRoleMiddleware = (role) => {
    return (req, res, next) => {
        if (req.user && req.user.role === role) {
            next(); // User has the required role, proceed
        } else {
            res.status(403).json({ message: 'Forbidden' }); // User does not have permission
        }
    };
};

module.exports = verifyRoleMiddleware;