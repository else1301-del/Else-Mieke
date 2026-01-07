
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratorParams, ValidationReport } from "../types";

// Initialize AI with environment variable
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const validateInput = async (params: GeneratorParams): Promise<ValidationReport> => {
  const model = ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Je bent Preflight Validator voor een gesloten systeem Aardrijkskunde toetsgenerator.

Doel
Controleer of de input rijk genoeg is voor de gekozen RTTI aantallen en handmatig gekozen vraagtypes. Geef korte, actiegerichte waarschuwingen en verbeterstappen. Geen externe kennis.

INPUT DATA VOOR EVALUATIE:
- Leerdoelen: ${params.leerdoelen}
- Begrippen: ${params.begrippen}
- Bronnen: ${params.bronnen}
- Gewenste RTTI Aantallen: R=${params.rttiTarget.r}, T1=${params.rttiTarget.t1}, T2=${params.rttiTarget.t2}, I=${params.rttiTarget.i}
- Geselecteerde Vraagtypes: ${params.vraagTypes.join(', ')}

🛑 HARDE REGELS:
1. GEEN KOPPELTEKENS: Verwijder ELK koppelteken (-) uit je volledige respons. Vervang door een spatie of komma. Dit is een strikte eis voor de leesbaarheid in dit systeem.
2. GESLOTEN SYSTEEM: Gebruik uitsluitend de aangeleverde input. Voeg GEEN externe kennis of feiten toe.
3. GEEN GENERATIE: Genereer GEEN toetsvragen of antwoorden.
4. CONCREET: Wees kort en wijs exact aan wat ontbreekt en wat nodig is.

SPECIFIEKE CHECKS:
1. BRONRIJKDOM: Zoek naar oorzaak gevolg relaties, procesketens, data kenmerken of conflict dilemma (schuring).
2. RTTI HAALBAARHEID: Indien er veel I of T2 vragen gevraagd worden maar de input mist schuring of procesmatige diepgang, markeer als 'risk'.
3. LEERDOELEN: Controleer op actiewerkwoorden en context. Markeer vage doelen.
4. BEGRIPPEN: Controleer of definities en context aanwezig zijn. Losse termen zonder uitleg zijn onvoldoende.
5. VRAAGTYPES: Beoordeel of 'casus' of 'bronanalyse' haalbaar is met de huidige bronsubstantie.

Output format: Alleen JSON conform het schema.`,
    config: {
      temperature: 0.1,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          feasibility: { type: Type.STRING, enum: ["ok", "risk"] },
          warnings: { type: Type.ARRAY, items: { type: Type.STRING } },
          quick_fixes: { type: Type.ARRAY, items: { type: Type.STRING } },
          missing_information: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["feasibility", "warnings", "quick_fixes", "missing_information"]
      }
    }
  });

  const response = await model;
  const text = response.text;
  if (!text) throw new Error("Geen respons van de validator.");
  return JSON.parse(text) as ValidationReport;
};
