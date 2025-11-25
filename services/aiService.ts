
import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AnalysisResult, DictionaryResult, UserSettings, ReadingChallengeResult, TongueTwisterResult } from "../types";

// --- Schemas ---

const analysisSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    chineseTranslation: { type: Type.STRING },
    difficultyLevel: { type: Type.STRING, enum: ["Beginner", "Intermediate", "Advanced"] },
    grammarAnalysis: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          rule: { type: Type.STRING },
          explanation: { type: Type.STRING },
          example: { type: Type.STRING },
        },
        required: ["rule", "explanation", "example"],
      },
    },
    keyPhrases: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          original: { type: Type.STRING },
          translation: { type: Type.STRING },
          explanation: { type: Type.STRING },
        },
        required: ["original", "translation", "explanation"],
      },
    },
    encouragement: { type: Type.STRING },
  },
  required: ["chineseTranslation", "difficultyLevel", "grammarAnalysis", "keyPhrases", "encouragement"],
};

const dictionarySchema: Schema = {
  type: Type.OBJECT,
  properties: {
    word: { type: Type.STRING, description: "The main word identified" },
    phonetic: { type: Type.STRING, description: "IPA phonetic symbol" },
    partOfSpeech: { type: Type.STRING, description: "noun, verb, etc." },
    meaning: { type: Type.STRING, description: "English definition simple for kids" },
    translation: { type: Type.STRING, description: "Chinese translation" },
    exampleSentence: { type: Type.STRING },
    exampleTranslation: { type: Type.STRING },
  },
  required: ["word", "phonetic", "partOfSpeech", "meaning", "translation", "exampleSentence", "exampleTranslation"],
};

const readingChallengeSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING },
    topic: { type: Type.STRING },
    content: { type: Type.STRING, description: "A story around 80-120 words." },
    chineseTranslation: { type: Type.STRING },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.INTEGER },
          question: { type: Type.STRING },
          options: {
             type: Type.ARRAY,
             items: {
               type: Type.OBJECT,
               properties: {
                 id: { type: Type.STRING, description: "A, B, C, or D" },
                 text: { type: Type.STRING }
               },
               required: ["id", "text"]
             }
          },
          correctOptionId: { type: Type.STRING },
          explanation: { type: Type.STRING, description: "Why this answer is correct (in Chinese)" }
        },
        required: ["id", "question", "options", "correctOptionId", "explanation"]
      }
    }
  },
  required: ["title", "topic", "content", "chineseTranslation", "questions"]
};

const tongueTwisterSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    phonetic: { type: Type.STRING },
    tongueTwister: { type: Type.STRING, description: "A short, fun tongue twister focusing on the sound" },
    chineseTranslation: { type: Type.STRING },
    challengeLevel: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
    funFact: { type: Type.STRING, description: "A simple tip about mouth position or pronunciation in Chinese" }
  },
  required: ["phonetic", "tongueTwister", "chineseTranslation", "challengeLevel", "funFact"]
};

// --- Helper to get Gemini Client ---
const getGeminiClient = (settings: UserSettings) => {
  // Use process.env.API_KEY exclusively as per guidelines.
  // Note: baseUrl is not currently supported in @google/genai GoogleGenAI constructor options type
  return new GoogleGenAI({
    apiKey: process.env.API_KEY,
  });
};

// --- Services ---

export const analyzeText = async (text: string, settings: UserSettings): Promise<AnalysisResult> => {
  const ai = getGeminiClient(settings);
  
  try {
    const response = await ai.models.generateContent({
      model: settings.modelName || "gemini-2.5-flash",
      contents: `Analyze this English text for a child student: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
        systemInstruction: "You are a friendly English teacher for Chinese children.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    return JSON.parse(jsonText) as AnalysisResult;
  } catch (error) {
    console.error("Analysis Error:", error);
    throw error;
  }
};

export const analyzeImage = async (base64Image: string, settings: UserSettings): Promise<DictionaryResult> => {
  const ai = getGeminiClient(settings);
  // Use Pro model for vision if possible, or fallback to flash image logic (handled by same model name usually)
  // For Gemini 2.5 Flash, it supports images.
  const modelName = settings.modelName || "gemini-2.5-flash";

  try {
    const response = await ai.models.generateContent({
      model: modelName,
      contents: {
        parts: [
          { inlineData: { mimeType: "image/jpeg", data: base64Image } },
          { text: "Identify the main object or text in this image. Provide the English word for it, along with phonetics, meaning, and a simple example sentence." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: dictionarySchema,
        systemInstruction: "You are a visual dictionary for kids. Return JSON only.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    return JSON.parse(jsonText) as DictionaryResult;
  } catch (error) {
    console.error("Image Analysis Error:", error);
    throw error;
  }
};

export const lookupWord = async (text: string, settings: UserSettings): Promise<DictionaryResult> => {
  const ai = getGeminiClient(settings);
  
  try {
    const response = await ai.models.generateContent({
      model: settings.modelName || "gemini-2.5-flash",
      contents: `Provide a dictionary entry for the word or phrase: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: dictionarySchema,
        systemInstruction: "You are a helpful dictionary for kids. Provide IPA phonetics, parts of speech, simple meaning, chinese translation, and an example sentence.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    return JSON.parse(jsonText) as DictionaryResult;
  } catch (error) {
    console.error("Lookup Error:", error);
    throw error;
  }
};

export const generateReadingChallenge = async (settings: UserSettings): Promise<ReadingChallengeResult> => {
  const ai = getGeminiClient(settings);
  
  // Randomly select a broad domain to ensure variety
  const domains = ["Science & Nature", "Daily Life & Friendship", "Animals", "Space Exploration", "History", "Technology"];
  const randomDomain = domains[Math.floor(Math.random() * domains.length)];

  try {
    const response = await ai.models.generateContent({
      model: settings.modelName || "gemini-2.5-flash",
      contents: `Write a short story (approx 100 words) for a child learning English. 
      Topic: ${randomDomain}.
      The story should be based on real life scenarios, interesting facts, or heartwarming events.
      Include 3 multiple-choice reading comprehension questions.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: readingChallengeSchema,
        systemInstruction: "You are an English reading content generator. Create engaging, educational content for kids (CEFR A2-B1 Level).",
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    return JSON.parse(jsonText) as ReadingChallengeResult;
  } catch (error) {
    console.error("Reading Challenge Error:", error);
    throw error;
  }
};

export const generateTongueTwister = async (phonetic: string, settings: UserSettings): Promise<TongueTwisterResult> => {
  const ai = getGeminiClient(settings);
  
  try {
    const response = await ai.models.generateContent({
      model: settings.modelName || "gemini-2.5-flash",
      contents: `Create a funny, kid-friendly English tongue twister that focuses on the sound /${phonetic}/.
      Include a Chinese translation and a 'fun fact' tip about how to pronounce this sound.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: tongueTwisterSchema,
        systemInstruction: "You are a phonics coach for children.",
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data returned");
    return JSON.parse(jsonText) as TongueTwisterResult;
  } catch (error) {
    console.error("Tongue Twister Error:", error);
    throw error;
  }
};
