
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratedTest, QAAuditReport, RTTITarget } from "../types";

// Corrected API key initialization to use environment variable directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const auditTest = async (test: GeneratedTest, targetRTTI: RTTITarget): Promise<QAAuditReport> => {
  const model = ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Je bent Senior toetsconstructeur Aardrijkskunde VO met expertise in RTTI en Cito itemkwaliteit.

Doel
Controleer dat de toets voldoet aan: gesloten systeem, clustering, RTTI aantallen, handmatig gekozen vraagtypes, plausibele afleiders, en docent proof antwoordmodel. Meld issues met minimale fixes.

DE TE CONTROLEREN TOETS: ${JSON.stringify(test)}
GEWENSTE RTTI DOELEN: R=${targetRTTI.r}, T1=${targetRTTI.t1}, T2=${targetRTTI.t2}, I=${targetRTTI.i}

🛑 HARDE REGELS:
1. GEEN KOPPELTEKENS: Verwijder ELK koppelteken (-) uit je volledige respons. Vervang door een spatie of komma. Dit is een strikte eis voor de leesbaarheid.
2. GESLOTEN SYSTEEM: Gebruik uitsluitend de aangeleverde JSON. Geen herschrijven van de hele toets.
3. CONCREET: Rapporteer exact waar het probleem zit met JSON paden.

CHECKS:
1. CONTRACT: Verplichte velden aanwezig? Is antwoord_model een string? Zijn punten integers?
2. RTTI: Tellen de R, T1, T2 en I labels in de vragen EXACT op tot rttiCountsTarget?
3. VRAAGTYPES: Worden alleen toegestane en ingeschakelde types gebruikt?
4. CLUSTERING: Staan de vragen onder de juiste bron_id?
5. BRONFUNCTIONEEL: Is de bron echt nodig voor de vragen? Geen 'behang' bronnen.
6. MEERKEUZE: Controleer op cueing risico's en plausibele afleiders.
7. ANTWOORDMODEL: Bevat het de Max 2 regel bij opsommingen en follow through bij stappen?

Output format: Alleen JSON conform het schema.`,
    config: {
      temperature: 0.2,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 16000 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pass: { type: Type.BOOLEAN },
          issues: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                severity: { type: Type.STRING, enum: ["low", "medium", "high"] },
                location: { type: Type.STRING, description: "JSON pad naar de fout" },
                problem: { type: Type.STRING },
                suggested_fix: { type: Type.STRING }
              },
              required: ["severity", "location", "problem", "suggested_fix"]
            }
          },
          suggested_fixes: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["pass", "issues", "suggested_fixes"]
      }
    }
  });

  const response = await model;
  const text = response.text;
  if (!text) throw new Error("Audit mislukt.");
  return JSON.parse(text) as QAAuditReport;
};
