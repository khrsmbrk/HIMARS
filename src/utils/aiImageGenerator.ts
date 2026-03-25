import { GoogleGenAI } from "@google/genai";

function getAI(): GoogleGenAI {
  // @ts-ignore
  const apiKey = process.env.GEMINI_API_KEY || import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set");
  }
  return new GoogleGenAI({ apiKey });
}

const DB_NAME = "AIGeneratedImagesDB";
const STORE_NAME = "images";

function initDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, 1);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME);
      }
    };
  });
}

async function getCachedImage(prompt: string): Promise<string | null> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readonly");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(prompt);
    request.onsuccess = () => resolve(request.result || null);
    request.onerror = () => reject(request.error);
  });
}

async function cacheImage(prompt: string, base64Data: string): Promise<void> {
  const db = await initDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put(base64Data, prompt);
    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

let isGenerating = false;
const queue: (() => Promise<void>)[] = [];

async function processQueue() {
  if (isGenerating || queue.length === 0) return;
  isGenerating = true;
  
  while (queue.length > 0) {
    const task = queue.shift();
    if (task) {
      await task();
      // Add a 3-second delay between requests to avoid hitting rate limits
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
  
  isGenerating = false;
}

export async function generateImage(prompt: string): Promise<string> {
  const cached = await getCachedImage(prompt);
  if (cached) return cached;

  return new Promise((resolve) => {
    queue.push(async () => {
      try {
        // Check cache again in case it was generated while waiting in queue
        const cachedNow = await getCachedImage(prompt);
        if (cachedNow) {
          resolve(cachedNow);
          return;
        }

        const ai = getAI();
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash-image',
          contents: {
            parts: [{ text: prompt }],
          },
          config: {
            imageConfig: {
              aspectRatio: "16:9"
            }
          },
        });

        for (const part of response.candidates?.[0]?.content?.parts || []) {
          if (part.inlineData) {
            const base64Data = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            await cacheImage(prompt, base64Data);
            resolve(base64Data);
            return;
          }
        }
        throw new Error("No image generated");
      } catch (error: any) {
        const isRateLimit = error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('quota');
        if (isRateLimit) {
          console.warn(`Rate limit hit for AI image generation. Using fallback image.`);
        } else {
          console.error("Failed to generate image:", error?.message || error);
        }
        // Fallback image
        resolve("https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1920&q=80");
      }
    });
    
    processQueue();
  });
}
