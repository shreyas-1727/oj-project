const express = require("express");
const { DBConnection } = require("./config/db");
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');
dotenv.config();

// Initializing Express app
const app = express();
app.use(helmet());

// app.use(cors({
//   origin: true,
//   credentials: true,
// }));

// Defining a whitelist of trusted URLs
const allowedOrigins = [
  'http://localhost:5173', //local frontend for development
  'https://oj-project-pi.vercel.app/' // Live Vercel frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    // Allownig requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

// Connecting to Database
DBConnection();

const User = require("./models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

//MIDDLEWARE SETUP
// CORS Middleware to allow requests from frontend
app.use(cors({
  origin: true, // Reflects the request origin
  credentials: true, // Allows cookies to be sent
}));

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse cookies
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

// A simple welcome route
app.get("/", (req, res) => {
  res.send('Welcome to the Online Judge API');
});

// Use the auth routes
app.use('/api/auth', require('./routes/authRoutes'));

// Use the problem routes
app.use('/api/problems', require('./routes/problemRoutes'));

// Use the submission routes
app.use('/api/submissions', require('./routes/submissionRoutes'));

// Use the AI routes
app.use('/api/ai', require('./routes/aiRoutes'));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});
