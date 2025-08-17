const express = require("express");
const { DBConnection } = require("./config/db");
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const dotenv = require('dotenv');

dotenv.config();

// Initializing Express app
const app = express();

// --- Middleware Setup ---
app.use(helmet());

// Define a whitelist of trusted URLs for CORS
const allowedOrigins = [
  'http://localhost:5173', 
  'https://oj-project-pi.vercel.app', 
  'https://oj-project-six.vercel.app'
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('The CORS policy for this site does not allow access from the specified Origin.'));
    }
  },
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// --- End of Middleware Setup ---

// Connect to Database
DBConnection();

// --- Routes ---
app.get("/", (req, res) => {
  res.send('Welcome to the Online Judge API');
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/problems', require('./routes/problemRoutes'));
app.use('/api/submissions', require('./routes/submissionRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
// --- End of Routes ---

const PORT = process.env.PORT || 7000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}!`);
});