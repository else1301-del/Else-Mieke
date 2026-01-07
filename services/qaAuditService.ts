
import { GeneratedTest, QAAuditReport, RTTITarget } from "../types";

export const auditTest = async (test: GeneratedTest, targetRTTI: RTTITarget): Promise<QAAuditReport> => {
  const prompt = `Je bent Senior toetsconstructeur. Voer een audit uit op deze toets.
  
  TOETS: ${JSON.stringify(test)}
  RTTI DOELEN: R=${targetRTTI.r}, T1=${targetRTTI.t1}, T2=${targetRTTI.t2}, I=${targetRTTI.i}

  🛑 REGELS: GEEN KOPPELTEKENS. GESLOTEN SYSTEEM.`;

  const response = await fetch('/api/generate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        temperature: 0.2,
        responseMimeType: "application/json",
        thinkingConfig: { thinkingBudget: 16000 }
      }
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Audit mislukt via proxy.");
  }

  const data = await response.json();
  return JSON.parse(data.text) as QAAuditReport;
};
