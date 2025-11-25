import { GoogleGenAI } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

// Initialize the client. The API key must be in process.env.API_KEY
// Note: In a real production app, you might proxy this through a backend to hide the key,
// or use Firebase Vertex AI for client-side security. For this demo, we assume the env var is set.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateChatResponse = async (
  userMessage: string,
  history: { role: string; parts: { text: string }[] }[]
): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';

    // Map history to the format expected by the SDK if needed,
    // though the SDK usually manages history in a ChatSession.
    // Here we will use a stateless approach with history passed in or a new chat for simplicity
    // but to keep context properly, we'll instantiate a chat.
    
    const chat = ai.chats.create({
      model: model,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7,
      },
      history: history // Pass previous context
    });

    const result = await chat.sendMessage({
      message: userMessage
    });

    return result.text || "I'm having a bit of trouble thinking right now. Try again?";
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return "Sorry, I encountered an error connecting to my brain. Please check the API key configuration.";
  }
};