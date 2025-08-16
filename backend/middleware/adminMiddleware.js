const adminMiddleware = (req, res, next) => {
  // Assumes authMiddleware has already run and attached req.user
  if (req.user && req.user.role === 'admin') {
    next(); // User is an admin, proceed to the controller
  } else {
    res.status(403).json({ message: 'Access denied. Admin role required.' });
  }
};

module.exports = adminMiddleware;