
import { ExtractorOutput, NormalizedOutput } from "../types";

export const normalizeInput = async (extractedData: ExtractorOutput): Promise<NormalizedOutput> => {
  const prompt = `Je bent Input Normalizer. Maak de input compact en consistent.
  
  DATA: ${JSON.stringify(extractedData)}
  
  Regels: Geen externe kennis. GEEN KOPPELTEKENS.`;

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Normalisatie mislukt via proxy.");
  }

  const data = await response.json();
  return JSON.parse(data.text) as NormalizedOutput;
};
