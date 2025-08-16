const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

// Initializing the Google AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

exports.explainCode = async (req, res) => {
  const { code, language, problemTitle } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (user.aiCredits <= 0) {
      return res.status(403).json({ message: 'No AI credits left for today. Come back tomorrow!' });
    }

    user.aiCredits -= 1;
    await user.save();

    const prompt = `
      You are an expert programming tutor providing direct feedback to a user.
      Analyze the following ${language} code that the user wrote for a problem titled "${problemTitle}".
      Address the user directly in the second person (e.g., "Your code...", "You can improve this by...").

      Here is the user's code:
      \`\`\`${language}
      ${code}
      \`\`\`

      Provide a concise analysis in three parts:
      1.  **Your Code's Logic:** Briefly explain what the user's approach is.
      2.  **Efficiency Analysis:** Analyze the time and space complexity of the solution.
      3.  **Improvement Suggestion:** Suggest one actionable improvement (e.g., efficiency, readability, or correctness).

      IMPORTANT: Do not write out a full, corrected code solution. Keep the tone encouraging, helpful, and personal.
    `;

    const result = await model.generateContent(prompt);
    const aiResponse = await result.response;
    const explanation = aiResponse.text();

    res.json({
      explanation,
      creditsLeft: user.aiCredits
    });

  } catch (error) {
    console.error("AI explanation error:", error);
    res.status(500).json({ message: "Failed to get AI explanation." });
  }
};