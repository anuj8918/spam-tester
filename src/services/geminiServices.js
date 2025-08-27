
import axios from 'axios';

// ⚠️ PASTE YOUR API KEY HERE
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'YOUR_GEMINI_API_KEY';

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;

// 👇 UPDATED AND IMPROVED PROMPT
const buildPrompt = (subject, preheader) => {
  return `
    You are an expert email deliverability analyst. 
    Your task is to evaluate the following email subject line and pre-header text for both spam risk and deliverability.

    Subject: "${subject}"
    Pre-header: "${preheader}"

    Return the response in STRICT JSON format only (no explanations, no markdown, no extra text). 
    The JSON must include:

    1. "deliverabilityScore": A number from 1 to 10. 
       - 10 = Excellent (very safe, highly likely to reach inbox). 
       - 1 = Very poor (almost certain to be flagged as spam).
    2. "riskLevel": One of "Low", "Medium", or "High" (based on the likelihood of being marked spam).
    3. "triggers": An array of specific spam trigger words/phrases or risky elements (e.g., "Free", "!!!", "Cash Prize"). 
       - If none are found, return [].
    4. "summary": A single, clear sentence summarizing the analysis in plain language.

    Examples:

     Example JSON for a spammy email:
    {
      "deliverabilityScore": 3,
      "riskLevel": "High",
      "triggers": ["Free", "!!!", "Win now"],
      "summary": "This subject line contains classic spam triggers and is highly likely to land in the spam folder."
    }

     Example JSON for a genuine, safe email:
    {
      "deliverabilityScore": 9,
      "riskLevel": "Low",
      "triggers": [],
      "summary": "This is a professional, neutral subject line with no spam indicators, making it safe for inbox delivery."
    }
  `;
};


export const analyzeEmailContent = async (subject, preheader) => {
  if (!subject) {
    throw new Error("Subject line cannot be empty.");
  }

  if (API_KEY === 'YOUR_GEMINI_API_KEY' || !API_KEY) {
    throw new Error("Please add your Gemini API Key in src/services/geminiService.js");
  }

  const prompt = buildPrompt(subject, preheader);

  const requestBody = {
    contents: [{
      parts: [{
        text: prompt
      }],
    }],
  };

  try {
    const response = await axios.post(API_URL, requestBody);
    
    const rawText = response.data.candidates[0].content.parts[0].text;

    const jsonMatch = rawText.match(/{[\s\S]*}/);
    if (!jsonMatch) {
      throw new Error("No valid JSON object was found in the AI's response.");
    }

    const parsedResult = JSON.parse(jsonMatch[0]);
    return parsedResult;

  } catch (error) {
    console.error("Error calling or parsing Gemini API response:", error.response?.data || error.message);
    throw new Error("Failed to get analysis from the AI. Check your project setup and API key permissions.");
  }
};