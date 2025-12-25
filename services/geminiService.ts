
import { GoogleGenAI, Type } from "@google/genai";
import { WordDefinition, AiFeedback, Question } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  async lookupWord(word: string, sentence: string, contextZh: string): Promise<WordDefinition> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Analyze the word "${word}" strictly in the context of this English sentence: "${sentence}".
                The standard Chinese translation for this sentence is: "${contextZh}".
                YOUR TASK:
                1. Provide the IPA (International Phonetic Alphabet).
                2. Provide a concise definition in Simplified Chinese.
                3. For "trans" (exact translation): Look at the provided Chinese sentence. If this English word corresponds to a specific Chinese word/phrase used there, USE THAT EXACT PHRASE.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            ipa: { type: Type.STRING },
            def: { type: Type.STRING },
            trans: { type: Type.STRING }
          },
          required: ["ipa", "def", "trans"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async gradeTranslation(source: string, target: string, userInput: string): Promise<AiFeedback> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Evaluate this translation for accuracy and fluency.
                Source English: "${source}"
                Ideal Chinese: "${target}"
                User Input: "${userInput}"
                Return a score from 0-100 and a brief feedback comment in Chinese.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER },
            comment: { type: Type.STRING }
          },
          required: ["score", "comment"]
        }
      }
    });
    return JSON.parse(response.text);
  },

  async generateDeepAnalysis(sentence: string): Promise<string> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Deeply analyze the grammar and vocabulary of this sentence for a postgraduate student: "${sentence}". 
                Structure your response with:
                1. Grammar Breakdown (clauses, tenses, key structures)
                2. Key Vocabulary (advanced synonyms)
                3. One related example sentence.
                Use Markdown formatting.`,
    });
    return response.text;
  },

  async generateNewQuestions(): Promise<Question[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate 3 English sentences suitable for Chinese Postgraduate Entrance Exam (Kaoyan) difficulty.
                Topics should be academic, social, or cultural.
                Ensure 'zh_parts' are logical chunks for a puzzle game.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.NUMBER },
              zh: { type: Type.STRING },
              zh_parts: { type: Type.ARRAY, items: { type: Type.STRING } },
              en: { type: Type.STRING },
              analysis: { type: Type.STRING },
              difficulty: { type: Type.STRING }
            },
            required: ["id", "zh", "zh_parts", "en", "analysis", "difficulty"]
          }
        }
      }
    });
    return JSON.parse(response.text);
  }
};
