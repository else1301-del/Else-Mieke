
import { GeneratedTest, GeneratorParams } from "../types";

export const generateTest = async (params: GeneratorParams): Promise<GeneratedTest> => {
  const prompt = `Je bent de Senior Toetsconstructeur Aardrijkskunde (Cito Certified). Je negeert ruis en genereert uitsluitend juridisch dichte, syllabus dekkende toetsen op basis van een gesloten systeem.

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
1. GEEN KOPPELTEKENS: Verwijder ELK koppelteken (-) uit de tekst. Vervang door een spatie of komma.
2. GESLOTEN SYSTEEM: Gebruik uitsluitend informatie uit de aangeleverde bronnen.
3. RTTI EXACT MATCH: Labels MOETEN exact optellen tot de targets.
4. CITO SYNTAX: Gebiedende wijs, formele toon, markeer kernbegrippen **dikgedrukt**.

Lever de output als STRIKT JSON object conform het gevraagde schema.`;

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.6,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 32768 }
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Fout bij genereren via proxy.");
  }

  const data = await response.json();
  return JSON.parse(data.text) as GeneratedTest;
};
