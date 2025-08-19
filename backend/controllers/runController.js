const axios = require('axios');

exports.runCode = async (req, res) => {
  try {
    // Forward the exact request body to the compiler service
    const response = await axios.post(process.env.COMPILER_API_URL, req.body);
    // Return the exact response from the compiler service
    res.json(response.data);
  } catch (error) {
    // Forward the error response from the compiler service
    res.status(error.response?.status || 500).json(error.response?.data || { 
      success: false, 
      error: "Error connecting to compiler service."
    });
  }
};