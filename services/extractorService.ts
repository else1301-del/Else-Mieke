
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractorOutput } from "../types";

// Corrected API key initialization to use environment variable directly
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const extractContentFromImages = async (base64Images: string[]): Promise<ExtractorOutput> => {
  const parts = base64Images.map(img => ({
    inlineData: {
      mimeType: 'image/jpeg',
      data: img.split(',')[1] || img,
    },
  }));

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: {
      parts: [
        ...parts,
        {
          text: `Je bent Input Extractor en Classifier voor Aardrijkskunde VO. Je krijgt één of meerdere afbeeldingen met lesmateriaal.

Doel
Zet de inhoud van de afbeeldingen om naar gestructureerde input voor een toets generator en label automatisch:
- leerdoelen
- begrippenlijst
- bronnen
- leertekst
Zonder externe kennis te gebruiken.

Harde regels
1. Gesloten systeem
   - Gebruik uitsluitend tekst en informatie die zichtbaar is in de afbeeldingen.
   - Voeg geen feiten toe en vul geen ontbrekende zinnen aan.
   - Als tekst onleesbaar of twijfelachtig is, markeer dit expliciet.

2. Nauwkeurigheid boven netheid
   - Neem tekst zo letterlijk mogelijk over.
   - Normaliseer alleen: verwijder onnodige regeleindes, herstel woorden die door regelafbreking zijn gesplitst, verwijder afbreekstreepjes uit woordafbrekingen.

3. Automatische herkenning en labeling
   - Leerdoelen: zinnen met doel/vaardigheid, vaak met actiewerkwoorden zoals: kan, verklaart, analyseert, vergelijkt, past toe, beschrijft.
   - Begrippen: term met definitie, toelichting, of context.
   - Bronnen: tekstblokken, casussen, tabellen, grafiekbeschrijvingen, kaartbeschrijvingen, opdrachtenmateriaal waar vragen op kunnen leunen.
   - Leertekst: uitleg/lesstof zonder directe bronfunctie.

4. Bronopbouw en clusterbaarheid
   - Als je bronnen herkent, maak bron_id’s: B1, B2, B3, B4 in volgorde van voorkomen.
   - Elke bron moet substantieel zijn. Combineer fragmenten die duidelijk bij elkaar horen tot één bron, maar verzin niets.
   - Bewaar kopjes, titels, onderschriften en bijschriften als onderdeel van bron metadata.

5. Zekerheid en waarschuwingen
   - Geef per gedetecteerde sectie een confidence score: hoog, middel, laag.
   - Als confidence laag is, voeg een warning toe met wat er onzeker is en waarom.

Output
Geef uitsluitend JSON met de gevraagde structuur.`
        }
      ],
    },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          pages: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                page_id: { type: Type.STRING },
                raw_text: { type: Type.STRING },
                detected_sections: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      section_id: { type: Type.STRING },
                      type: { type: Type.STRING, enum: ["leerdoelen", "begrippenlijst", "bronnen", "leertekst", "onduidelijk"] },
                      confidence: { type: Type.STRING, enum: ["hoog", "middel", "laag"] },
                      text: { type: Type.STRING },
                      notes: { type: Type.STRING }
                    },
                    required: ["section_id", "type", "confidence", "text"]
                  }
                },
                warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["page_id", "raw_text", "detected_sections"]
            }
          },
          leerdoelen: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ["hoog", "middel", "laag"] },
                source_page_id: { type: Type.STRING }
              },
              required: ["id", "text", "confidence", "source_page_id"]
            }
          },
          begrippen: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                term: { type: Type.STRING },
                definitie: { type: Type.STRING },
                context: { type: Type.STRING },
                confidence: { type: Type.STRING, enum: ["hoog", "middel", "laag"] },
                source_page_id: { type: Type.STRING }
              },
              required: ["id", "term", "definitie", "confidence", "source_page_id"]
            }
          },
          bronnen: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                bron_id: { type: Type.STRING },
                titel: { type: Type.STRING },
                bron_tekst: { type: Type.STRING },
                bron_type: { type: Type.STRING, enum: ["tekst", "tabel", "grafiek", "kaart", "casus", "gemengd"] },
                confidence: { type: Type.STRING, enum: ["hoog", "middel", "laag"] },
                source_page_ids: { type: Type.ARRAY, items: { type: Type.STRING } },
                warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["bron_id", "titel", "bron_tekst", "bron_type", "confidence", "source_page_ids"]
            }
          },
          leertekst: {
            type: Type.OBJECT,
            properties: {
              text: { type: Type.STRING },
              confidence: { type: Type.STRING, enum: ["hoog", "middel", "laag"] },
              source_page_ids: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["text", "confidence", "source_page_ids"]
          },
          global_warnings: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["pages", "leerdoelen", "begrippen", "bronnen", "leertekst"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("Extractie mislukt.");
  return JSON.parse(text) as ExtractorOutput;
};
