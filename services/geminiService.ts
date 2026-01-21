import { GoogleGenAI, Chat } from "@google/genai";
import { ModelType } from "../types";

// Helper to ensure API Key exists
const getApiKey = () => {
  const key = process.env.API_KEY;
  if (!key) {
    console.error("API_KEY is missing in environment variables.");
    return "";
  }
  return key;
};

// Singleton instance management could be done here, 
// but we'll instantiate per session for cleanliness in this context.
export class GeminiService {
  private ai: GoogleGenAI;
  private chat: Chat | null = null;
  private model: ModelType;

  constructor(model: ModelType = 'gemini-3-flash-preview') {
    this.model = model;
    this.ai = new GoogleGenAI({ apiKey: getApiKey() });
  }

  public async startChat(systemInstruction?: string) {
    this.chat = this.ai.chats.create({
      model: this.model,
      config: {
        systemInstruction: systemInstruction || "You are Prism, a helpful, intelligent, and concise AI assistant.",
        temperature: 0.7,
      }
    });
  }

  public async *sendMessageStream(message: string) {
    if (!this.chat) {
      await this.startChat();
    }

    if (!this.chat) throw new Error("Chat session failed to initialize");

    try {
      const resultStream = await this.chat.sendMessageStream({ message });
      
      for await (const chunk of resultStream) {
        if (chunk.text) {
          yield chunk.text;
        }
      }
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  }

  public setModel(model: ModelType) {
    this.model = model;
    // Reset chat when model changes
    this.chat = null;
  }
}