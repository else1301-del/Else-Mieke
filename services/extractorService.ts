
import { GoogleGenAI } from "@google/genai";
import { ExtractorOutput } from "../types";

export const extractContentFromImages = async (base64Images: string[]): Promise<ExtractorOutput> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const imageParts = base64Images.map(img => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: img.split(',')[1] || img,
    },
  }));

  const textPart = {
    text: `Je bent Input Extractor. Zet afbeeldingen om naar gestructureerde input.
    Label: leerdoelen, begrippenlijst, bronnen, leertekst.
    Regels: Gesloten systeem. Geen koppeltekens.`
  };

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [...imageParts, textPart] },
    config: {
      responseMimeType: "application/json"
    }
  });

  return JSON.parse(response.text) as ExtractorOutput;
};
