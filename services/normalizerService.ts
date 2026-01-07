
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractorOutput, NormalizedOutput } from "../types";

// Corrected API key initialization to use environment variable directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const normalizeInput = async (extractedData: ExtractorOutput): Promise<NormalizedOutput> => {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Je bent Input Normalizer voor een gesloten systeem toets generator Aardrijkskunde VO.

Doel
Normaliseer de geëxtraheerde input naar compacte, consistente velden voor toets generatie, zonder inhoud toe te voegen.

INPUT DATA (RAW EXTRACTION):
${JSON.stringify(extractedData)}

Regels
- Geen externe kennis, geen aanvulling.
- Dubbelen verwijderen, maar niets inhoudelijks weglaten.
- Bronnen consolideren tot 1–4 substantiële bronnen als dat logisch is, maar behoud de inhoud.
- Behoud bron_id’s of hernummer consequent als je consolideert.
- GEEN KOPPELTEKENS: Verwijder alle koppeltekens (-) in de tekst. Vervang door een spatie of komma.

Output format: Alleen JSON.`,
    config: {
      temperature: 0.1,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          normalized_leerdoelen: { type: Type.ARRAY, items: { type: Type.STRING } },
          normalized_begrippen: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                term: { type: Type.STRING },
                definitie: { type: Type.STRING },
                context: { type: Type.STRING }
              },
              required: ["term", "definitie"]
            }
          },
          normalized_bronnen: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                bron_id: { type: Type.STRING },
                titel: { type: Type.STRING },
                bron_type: { type: Type.STRING, enum: ["tekst", "tabel", "grafiek", "kaart", "casus", "gemengd"] },
                bron_tekst: { type: Type.STRING }
              },
              required: ["bron_id", "titel", "bron_type", "bron_tekst"]
            }
          },
          normalized_leertekst: { type: Type.STRING },
          notes: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["normalized_leerdoelen", "normalized_begrippen", "normalized_bronnen", "normalized_leertekst"]
      }
    }
  });

  const response = await model;
  const text = response.text;
  if (!text) throw new Error("Normalisatie mislukt.");
  return JSON.parse(text) as NormalizedOutput;
};
