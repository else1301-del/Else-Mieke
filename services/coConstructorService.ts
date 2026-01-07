
import { GeneratedTest, CoConstructorResponse } from "../types";

export const coConstructUpdate = async (
  currentTest: GeneratedTest,
  instruction: string,
  extraContext?: string
): Promise<CoConstructorResponse> => {
  const prompt = `Je bent AI Co Constructeur. Voer wijzigingen uit op basis van docentinstructies.
  
  BESTAANDE TOETS: ${JSON.stringify(currentTest)}
  INSTRUCTIE: ${instruction}
  EXTRA CONTEXT: ${extraContext || 'Geen.'}

  🛑 REGELS: GEEN KOPPELTEKENS. GESLOTEN SYSTEEM.`;

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.3,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 32768 }
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Co-constructie mislukt via proxy.");
  }

  const data = await response.json();
  return JSON.parse(data.text) as CoConstructorResponse;
};
