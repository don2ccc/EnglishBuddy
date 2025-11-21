import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult } from "../types";

// Define the strict output schema for the AI
const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    chineseTranslation: {
      type: Type.STRING,
      description: "The natural, child-friendly Chinese translation of the entire text.",
    },
    difficultyLevel: {
      type: Type.STRING,
      enum: ["Beginner", "Intermediate", "Advanced"],
      description: "The estimated difficulty level for a child.",
    },
    grammarAnalysis: {
      type: Type.ARRAY,
      description: "List of key grammar points found in the text.",
      items: {
        type: Type.OBJECT,
        properties: {
          rule: { type: Type.STRING, description: "Name of the grammar rule (e.g., Past Tense)." },
          explanation: { type: Type.STRING, description: "Simple explanation in Chinese suitable for kids." },
          example: { type: Type.STRING, description: "A very short example snippet from the text or a simple constructed example." },
        },
        required: ["rule", "explanation", "example"],
      },
    },
    keyPhrases: {
      type: Type.ARRAY,
      description: "List of idioms, phrasal verbs, or difficult words.",
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING, description: "The English phrase found." },
          translation: { type: Type.STRING, description: "Chinese translation of the phrase." },
          explanation: { type: Type.STRING, description: "Simple usage explanation in Chinese." },
        },
        required: ["original", "translation", "explanation"],
      },
    },
    encouragement: {
      type: Type.STRING,
      description: "A short, encouraging sentence for the child in Chinese.",
    },
  },
  required: ["chineseTranslation", "difficultyLevel", "grammarAnalysis", "keyPhrases", "encouragement"],
};

export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the following English text for a child student. 
      Text: "${text}"
      Provide a Chinese translation, analyze the grammar simply, identify key phrases/idioms, and rate the difficulty.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a friendly, encouraging English teacher for children. Your explanations should be simple, colorful, and easy to understand for a 6-12 year old Chinese student. Use emojis where appropriate in explanations.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) {
      throw new Error("No data returned from Gemini");
    }

    return JSON.parse(jsonText) as AnalysisResult;
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};