
import { ExtractorOutput } from "../types";

export const extractContentFromImages = async (base64Images: string[]): Promise<ExtractorOutput> => {
  const parts = base64Images.map(img => ({
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

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemini-3-flash-preview',
      contents: { parts: [...parts, textPart] },
      config: {
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Extractie mislukt via proxy.");
  }

  const data = await response.json();
  return JSON.parse(data.text) as ExtractorOutput;
};
