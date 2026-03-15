import { GoogleGenAI } from "@google/genai";
import fs from "fs";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

async function generateAndSaveImage(prompt, filename) {
  console.log(`Generating image for: ${prompt}`);
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-flash-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: "1K"
        }
      },
    });
    
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        const base64Data = part.inlineData.data;
        fs.writeFileSync(`public/${filename}`, base64Data, 'base64');
        console.log(`Saved ${filename}`);
        return;
      }
    }
  } catch (e) {
    console.error(`Failed to generate ${filename}:`, e);
  }
}

async function main() {
  if (!fs.existsSync('public/images')) {
    fs.mkdirSync('public/images', { recursive: true });
  }
  
  await generateAndSaveImage(
    "Indonesian university students in a modern campus, wearing olive green organizational uniform shirts, having a discussion in a bright modern room. High quality, cinematic lighting, realistic, photography.",
    "images/hero-bg.png"
  );
  
  await generateAndSaveImage(
    "Indonesian university students wearing olive green uniform shirts, organizing an event, holding clipboards and talking. High quality, cinematic lighting, realistic, photography.",
    "images/kegiatan-1.png"
  );
  
  await generateAndSaveImage(
    "Indonesian university students wearing olive green uniform shirts, presenting in front of a class. High quality, cinematic lighting, realistic, photography.",
    "images/kegiatan-2.png"
  );
  
  await generateAndSaveImage(
    "Close up of Indonesian university students wearing olive green uniform shirts, working on laptops together. High quality, cinematic lighting, realistic, photography.",
    "images/blog-bg.png"
  );
}

main();
