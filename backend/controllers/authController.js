const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //Checking if user already exists
    let user = await User.findOne({ $or: [{ email }, { username }] });
    if (user) {
      return res.status(400).json({ message: 'User with that email or username already exists' });
    }

    //Creating a new user instance
    user = new User({
      username,
      email,
      password,
    });

    // Hashing the password before saving
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    //Saving the user to the database
    await user.save();

    // Responding with success (but not sending the password back)
    res.status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      aiCredits: user.aiCredits,
      lastCreditReset: user.lastCreditReset,
      message: 'User registered successfully'
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const payload = {
      user: {
        id: user.id,
        role: user.role,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    //Cookie Options 
    const cookieOptions = {
      httpOnly: true, // The cookie cannot be accessed by client-side JavaScript
      secure: true, // Using secure cookies in production
      sameSite: 'None',
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24-hour expiry
    };

    //Seting cookie and sending response
    res
      .status(200)
      .cookie('token', token, cookieOptions) //Setting the token in a cookie
      .json({
        success: true,
        message: 'Login successful!',
        token: token, //Sending token in body for frontend convenience
        user: {
          _id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
          aiCredits: user.aiCredits,
          lastCreditReset: user.lastCreditReset,
        }
      });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// Function to get the user's profile
exports.getUserProfile = async (req, res) => {
  try {
    // req.user.id is available because authMiddleware added it
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    //CREDIT RESET LOGIC
    const now = new Date();
    const lastReset = new Date(user.lastCreditReset);
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const lastResetDay = new Date(lastReset.getFullYear(), lastReset.getMonth(), lastReset.getDate());

    if (today > lastResetDay) {
      user.aiCredits = 3; // Reset credits
      user.lastCreditReset = now; // Update the timestamp
      await user.save(); // Save the changes
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.updateUserProfile = async (req, res) => {
  // The user's ID is available from the authMiddleware
  const userId = req.user.id;
  const { username, email } = req.body;

  try {
    // Finding the user in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If the user is trying to update their email, checking if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser && existingUser._id.toString() !== userId) {
        return res.status(400).json({ message: 'Email is already in use' });
      }
      user.email = email;
    }

    // Updating username if provided
    if (username) {
      user.username = username;
    }

    // Saving the updated user
    const updatedUser = await user.save();

    // Responding with the updated user data (excluding the password)
    res.json({
      _id: updatedUser._id,
      username: updatedUser.username,
      email: updatedUser.email,
      role: updatedUser.role,
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.deleteUserProfile = async (req, res) => {
  try {
    // Finding the user by the ID from the token and removing them
    const user = await User.findByIdAndDelete(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User account deleted successfully' });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
exports.logoutUser = (req, res) => {
  // Passing the same options used when setting the cookie to ensure it's cleared
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict', // Be explicit for modern browsers
    path: '/', // Specify the root path
  });
  res.status(200).json({ success: true, message: 'Logged out successfully' });
};