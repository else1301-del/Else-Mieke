
import { GoogleGenAI } from "@google/genai";
import { GeneratedTest, CoConstructorResponse } from "../types";

export const coConstructUpdate = async (
  currentTest: GeneratedTest,
  instruction: string,
  extraContext?: string
): Promise<CoConstructorResponse> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `Je bent AI Co Constructeur. Voer wijzigingen uit op basis van docentinstructies.
  
  BESTAANDE TOETS: ${JSON.stringify(currentTest)}
  INSTRUCTIE: ${instruction}
  EXTRA CONTEXT: ${extraContext || 'Geen.'}

  🛑 REGELS: GEEN KOPPELTEKENS. GESLOTEN SYSTEEM.`;

  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: prompt,
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 32768 }
    }
  });

  return JSON.parse(response.text) as CoConstructorResponse;
};
