const { GoogleGenAI } = require('@google/genai');
const Assignment = require('../models/Assignment');

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const getHint = async (req, res) => {
  const { assignmentId, userQuery, currentError } = req.body;

  try {
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    const prompt = `
      You are an AI assistant helping a student learn SQL.
      Assignment Context: ${assignment.description}
      Expected Schema: ${assignment.schemaDescription}
      Student's Attempted Query: ${userQuery || 'None provided'}
      Error Received: ${currentError || 'None'}

      Please provide a helpful hint to guide the student towards the correct SQL query.
      CRITICAL INSTRUCTION: DO NOT provide the full correct query. Give them a conceptual hint, point out syntactical errors, or suggest the right clause/function to use.
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
    });

    res.json({ hint: response.text });
  } catch (error) {
    console.error('Gemini API Error:', error);
    res.status(500).json({ message: 'Failed to generate hint. Please try again later.' });
  }
};

module.exports = { getHint };
