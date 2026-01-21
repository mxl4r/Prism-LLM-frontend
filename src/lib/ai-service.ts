import { GoogleGenAI } from "@google/genai";
import { ModelType, Attachment } from "../types";

// --- API Keys ---
const KEYS = {
  GOOGLE: process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY,
  OPENAI: process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY,
  ANTHROPIC: process.env.NEXT_PUBLIC_ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY,
};

// --- Providers Logic ---

// 1. Google Gemini Provider
class GeminiProvider {
  private ai: GoogleGenAI;
  
  constructor() {
    this.ai = new GoogleGenAI({ apiKey: KEYS.GOOGLE || '' });
  }

  async *stream(model: string, prompt: string, attachments: Attachment[]) {
    if (!KEYS.GOOGLE) throw new Error("Google API Key missing");
    
    // Construct contents
    let parts: any[] = [];
    
    // Add images if any
    if (attachments.length > 0) {
      parts = attachments.map(att => ({
        inlineData: {
          mimeType: att.mimeType || 'image/jpeg',
          data: att.base64 || ''
        }
      }));
    }
    
    // Add text prompt
    parts.push({ text: prompt });

    const response = await this.ai.models.generateContentStream({
      model: model,
      contents: { role: 'user', parts: parts }
    });

    for await (const chunk of response) {
      if (chunk.text) yield chunk.text;
    }
  }
}

// 2. OpenAI Provider (Using Fetch for client-side demo - standard SDK usually node-only for some features)
class OpenAIProvider {
  async *stream(model: string, prompt: string, attachments: Attachment[]) {
    if (!KEYS.OPENAI) throw new Error("OpenAI API Key missing");

    const messages: any[] = [
      {
        role: "user",
        content: [
          { type: "text", text: prompt },
          ...attachments.map(att => ({
            type: "image_url",
            image_url: {
              url: `data:${att.mimeType};base64,${att.base64}`
            }
          }))
        ]
      }
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${KEYS.OPENAI}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        stream: true
      })
    });

    if (!response.ok) throw new Error(`OpenAI Error: ${response.statusText}`);

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(line => line.trim() !== "");

      for (const line of lines) {
        if (line === "data: [DONE]") return;
        if (line.startsWith("data: ")) {
          try {
            const json = JSON.parse(line.substring(6));
            const content = json.choices[0]?.delta?.content;
            if (content) yield content;
          } catch (e) {
            console.error("Error parsing OpenAI chunk", e);
          }
        }
      }
    }
  }
}

// 3. Anthropic Claude Provider
// Note: Client-side calls to Anthropic usually blocked by CORS. 
// This assumes you have a proxy or are testing in an environment that allows it, 
// OR utilizing a Next.js API Route (recommended). For this file structure, we simulate client fetch.
class AnthropicProvider {
  async *stream(model: string, prompt: string, attachments: Attachment[]) {
    if (!KEYS.ANTHROPIC) throw new Error("Anthropic API Key missing");

    const content: any[] = attachments.map(att => ({
      type: "image",
      source: {
        type: "base64",
        media_type: att.mimeType,
        data: att.base64
      }
    }));

    content.push({ type: "text", text: prompt });

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "x-api-key": KEYS.ANTHROPIC || "",
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
        "dangerously-allow-browser": "true" // Client-side flag (not recommended for prod)
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 1024,
        messages: [{ role: "user", content }],
        stream: true
      })
    });

    if (!response.ok) {
       // Fallback for CORS error common in demos
       throw new Error(`Anthropic Error: ${response.status} (Possible CORS issue on client-side)`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      const chunk = decoder.decode(value);
      const lines = chunk.split("\n").filter(line => line.trim() !== "");

      for (const line of lines) {
         if (line.startsWith("data: ")) {
            try {
               const json = JSON.parse(line.substring(6));
               if (json.type === 'content_block_delta' && json.delta.text) {
                  yield json.delta.text;
               }
            } catch (e) {
               // ignore keep-alive
            }
         }
      }
    }
  }
}

// --- Main Service Class ---

export class AIService {
  private gemini = new GeminiProvider();
  private openai = new OpenAIProvider();
  private anthropic = new AnthropicProvider();

  async *streamMessage(model: ModelType, prompt: string, attachments: Attachment[] = []) {
    
    // Router based on model prefix
    if (model.startsWith('gemini') || model.startsWith('veo')) {
       yield* this.gemini.stream(model, prompt, attachments);
    } else if (model.startsWith('gpt')) {
       yield* this.openai.stream(model, prompt, attachments);
    } else if (model.startsWith('claude')) {
       yield* this.anthropic.stream(model, prompt, attachments);
    } else {
       throw new Error("Unsupported model provider");
    }
  }
}