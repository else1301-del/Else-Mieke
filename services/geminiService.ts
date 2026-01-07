
import { GoogleGenAI, Type } from "@google/genai";
import { GeneratorParams, GeneratedTest } from "../types";

// Corrected API key initialization to use environment variable directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateTest = async (params: GeneratorParams): Promise<GeneratedTest> => {
  const model = ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Je bent de Senior Toetsconstructeur Aardrijkskunde (Cito Certified). Je negeert ruis en genereert uitsluitend juridisch dichte, syllabus dekkende toetsen op basis van een gesloten systeem.

DOEL:
Genereer een examenwaardige toets op basis van de door de docent aangeleverde inhoud. De output moet consistent, corrigeerbaar en direct bruikbaar zijn.

PARAMETERS VOOR DEZE OPDRACHT:
- NIVEAUPROFIEL (Bron van waarheid): ${params.niveauProfiel} (Context: ${params.jaarlaag})
- AANTAL VRAGEN: ${params.aantalVragen}
- RTTI TARGET (EXACT): R=${params.rttiTarget.r}, T1=${params.rttiTarget.t1}, T2=${params.rttiTarget.t2}, I=${params.rttiTarget.i}
- TOEGESTANE VRAAGTYPES: ${params.vraagTypes.join(', ')}
- LEERDOELEN: ${params.leerdoelen}
- BEGRIPPEN: ${params.begrippen}
- BRONNEN: ${params.bronnen}
- LEESNIVEAU: ${params.leesniveau}
- TOETSTIJD: ${params.toetstijd} minuten
- MOEILIJKHEIDSVERDELING: ${params.moeilijkheidsverdeling}

🛑 CRUCIALE, NIET ONDERHANDELBARE EISEN:
1. GEEN KOPPELTEKENS: Verwijder ELK koppelteken (-) uit de tekst. Vervang door een spatie of komma. Zelfs in vaktermen (bijv. 'sociaal economisch') of namen (bijv. 'Zuid Amerika'). Dit is een absolute eis.
2. GESLOTEN SYSTEEM: Gebruik uitsluitend informatie uit de aangeleverde bronnen, leerdoelen en begrippen. Gebruik GEEN externe kennis.
3. RTTI EXACT MATCH: De verdeling van vragen over R, T1, T2 en I MOET exact overeenkomen met de opgegeven targets.
4. META SECTIE: 
   - De meta sectie MOET de volgende velden bevatten: levelProfile, questionCount, rttiCountsTarget, enabledQuestionTypes.
   - Leid intern 'stream' (onderwijsstroom) en 'year' (jaar) af uit het niveauProfiel (bijv. MH_1 wordt stream: 'mavo havo', year: '1').
5. CITO SYNTAX & STIJL: Gebruik gebiedende wijs, formele toon, signaalwoorden, en markeer kernbegrippen **dikgedrukt**.
6. RICHE CONTEXT: Cluster vragen rondom substantiële bronnen.
7. ANTWOORDMODEL (DOCENT PROOF): Per vraag: modelantwoord, beoordelingsregels, vaktaal, misconcepties, en de "Max 2" regel bij opsommingen.

Lever de output als STRIKT JSON object conform het gevraagde schema.`,
    config: {
      temperature: 0.6,
      responseMimeType: "application/json",
      thinkingConfig: { thinkingBudget: 32768 },
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          meta: {
            type: Type.OBJECT,
            properties: {
              titel: { type: Type.STRING },
              niveau: { type: Type.STRING },
              niveauProfiel: { type: Type.STRING },
              enabledQuestionTypes: { type: Type.ARRAY, items: { type: Type.STRING } },
              leerjaar: { type: Type.STRING },
              onderwerp: { type: Type.STRING },
              tijd: { type: Type.INTEGER },
              questionCount: { type: Type.INTEGER },
              totalPoints: { type: Type.INTEGER },
              stream: { type: Type.STRING },
              year: { type: Type.STRING },
              rttiCountsTarget: {
                type: Type.OBJECT,
                properties: {
                  r: { type: Type.INTEGER },
                  t1: { type: Type.INTEGER },
                  t2: { type: Type.INTEGER },
                  i: { type: Type.INTEGER }
                }
              }
            },
            required: ["titel", "niveau", "niveauProfiel", "enabledQuestionTypes", "questionCount", "totalPoints", "rttiCountsTarget", "tijd"]
          },
          sources: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                content: { type: Type.STRING },
                type: { type: Type.STRING, enum: ['tekst', 'tabel', 'kaart', 'grafiek'] }
              },
              required: ["id", "title", "content", "type"]
            }
          },
          student_view: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.INTEGER },
                punten: { type: Type.INTEGER },
                rtti: { type: Type.STRING, enum: ['R', 'T1', 'T2', 'I'] },
                bron_id: { type: Type.ARRAY, items: { type: Type.STRING } },
                dimensie: { type: Type.STRING, enum: ['fysisch geografisch', 'sociaal economisch', 'integratief'] },
                kernconcept: { type: Type.STRING, enum: ['verscheidenheid', 'samenhang', 'schaal', 'perceptie', 'verandering in tijd'] },
                vraag_tekst: { type: Type.STRING },
                opties: { type: Type.ARRAY, items: { type: Type.STRING } },
                type: { type: Type.STRING },
                bronrechtvaardiging: { type: Type.STRING }
              },
              required: ["id", "punten", "rtti", "bron_id", "vraag_tekst", "type", "kernconcept", "dimensie", "bronrechtvaardiging"]
            }
          },
          teacher_view: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                vraag_id: { type: Type.INTEGER },
                rtti: { type: Type.STRING },
                motivatie: { type: Type.STRING },
                punten: { type: Type.INTEGER },
                antwoord_model: { type: Type.STRING },
                beoordelingsregels: { type: Type.ARRAY, items: { type: Type.STRING } },
                vereiste_vaktaal: { type: Type.ARRAY, items: { type: Type.STRING } },
                veelgemaakte_fouten: { type: Type.ARRAY, items: { type: Type.STRING } },
                syllabus_domein: { type: Type.STRING },
                tijdsindicatie: { type: Type.STRING },
                geografische_schaal: { type: Type.STRING }
              },
              required: ["vraag_id", "antwoord_model", "punten", "beoordelingsregels", "rtti", "motivatie"]
            }
          },
          beeld_prompts: { type: Type.ARRAY, items: { type: Type.STRING } },
          quality_report: {
            type: Type.OBJECT,
            properties: {
              rtti_dekking: { type: Type.STRING },
              bron_gebruik: { type: Type.STRING },
              taal_check: { type: Type.STRING },
              google_proof_check: { type: Type.STRING }
            },
            required: ["rtti_dekking", "bron_gebruik", "taal_check"]
          }
        },
        required: ["meta", "sources", "student_view", "teacher_view", "quality_report"]
      }
    }
  });

  const response = await model;
  const text = response.text;
  if (!text) throw new Error("Geen respons van de AI.");
  return JSON.parse(text) as GeneratedTest;
};
