import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generate() {
  try {
    console.log("Generating image 1...");
    const response1 = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            text: 'Indonesian university students in a modern campus setting, wearing olive green uniform shirts with collars, engaging in organizational activities, discussing around a table, high quality, realistic, cinematic lighting.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });
    
    for (const part of response1.candidates[0].content.parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        fs.mkdirSync('public/images', { recursive: true });
        fs.writeFileSync('public/images/hero-bg.png', buffer);
        console.log("Saved hero-bg.png");
      }
    }

    console.log("Generating image 2...");
    const response2 = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            text: 'A group of Indonesian university students wearing olive green uniform shirts, standing together smiling in a campus hallway, high quality, realistic.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    for (const part of response2.candidates[0].content.parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        fs.writeFileSync('public/images/about-bg.png', buffer);
        console.log("Saved about-bg.png");
      }
    }
    
    console.log("Generating image 3...");
    const response3 = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            text: 'Indonesian university students wearing olive green uniform shirts, organizing an event in an auditorium, high quality, realistic.',
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      }
    });

    for (const part of response3.candidates[0].content.parts) {
      if (part.inlineData) {
        const buffer = Buffer.from(part.inlineData.data, 'base64');
        fs.writeFileSync('public/images/events-bg.png', buffer);
        console.log("Saved events-bg.png");
      }
    }

  } catch (e) {
    console.error(e);
  }
}

generate();
