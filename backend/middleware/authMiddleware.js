const jwt = require('jsonwebtoken');
require('dotenv').config();

const authMiddleware = (req, res, next) => {
  // Getting token from the cookie
  const token = req.cookies.token;

  // Checking if token exists
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verifying the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //Adding user from payload to the request object
    req.user = decoded.user;
    next(); // Proceeding to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = authMiddleware;