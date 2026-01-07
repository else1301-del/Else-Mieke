
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedTest, CoConstructorResponse } from "../types";

// Corrected API key initialization to use environment variable directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const coConstructUpdate = async (
  currentTest: GeneratedTest,
  instruction: string,
  extraContext?: string
): Promise<CoConstructorResponse> => {
  const model = ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Je bent AI Co Constructeur voor een bestaande Aardrijkskunde toets in JSON.

Doel
Voer gerichte wijzigingen uit op basis van docentinstructies, met minimale impact op de rest.

BESTAANDE TOETS: ${JSON.stringify(currentTest)}
DOCENTINSTRUCTIE: ${instruction}
EXTRA CONTEXT: ${extraContext || 'Geen extra context.'}

🛑 HARDE, NIET ONDERHANDELBARE REGELS:
1. GEEN KOPPELTEKENS: Verwijder alle koppeltekens (-) in de tekst. Vervang door spatie of komma. Zelfs in vaktermen of geografische namen.
2. GESLOTEN SYSTEEM: Gebruik uitsluitend de bestaande toetsinhoud plus eventuele nieuwe input die de docent expliciet toevoegt. Geen externe kennis.
3. MINIMALE WIJZIGING: Pas alleen aan wat de docent vraagt. Behoud bron clustering, nummering en stijl waar mogelijk.
4. RTTI EN VRAAGTYPES BEHOUDEN: RTTI totalen (rttiCountsTarget) mogen niet veranderen tenzij docent expliciet RTTI aanpast. Gebruik alleen vraagtypes die in de toetsconfig zijn ingeschakeld.
5. DOCENT PROOF MODEL: Werk bij elke inhoudelijke wijziging ook antwoord_model, beoordelingsregels, vaktaal en fouten bij. Gebruik de Max 2 regel bij opsommingen.
6. CITO TOON: Gebruik gortdroge, formele taal. Geen 'jij/je'. Gebruik de gebiedende wijs.

OUTPUT FORMAT:
Lever uitsluitend een JSON object conform het onderstaande schema.`,
    config: {
      temperature: 0.3,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 32768 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          changes: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                target: { type: Type.STRING, enum: ["vraag", "bron"] },
                id: { type: Type.STRING },
                change_type: { type: Type.STRING, enum: ["edit", "replace", "add", "remove"] },
                before: { type: Type.STRING },
                after: { type: Type.STRING }
              },
              required: ["target", "id", "change_type", "before", "after"]
            }
          },
          updated_test: { type: Type.OBJECT },
          quality_delta: {
            type: Type.OBJECT,
            properties: {
              rtti_ok: { type: Type.BOOLEAN },
              types_ok: { type: Type.BOOLEAN },
              clustering_ok: { type: Type.BOOLEAN },
              notes: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["rtti_ok", "types_ok", "clustering_ok", "notes"]
          }
        },
        required: ["changes", "updated_test", "quality_delta"]
      }
    }
  });

  const response = await model;
  const text = response.text;
  if (!text) throw new Error("AI kon geen wijzigingen voorstellen.");
  return JSON.parse(text) as CoConstructorResponse;
};
