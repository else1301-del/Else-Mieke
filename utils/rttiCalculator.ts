
import { RTTITarget } from "../types";

/**
 * Calculates deterministic RTTI counts using the Hamilton Method (Largest Remainder).
 * Ensures sum exactly matches totalQuestions.
 */
export const calculateRTTICounts = (
  totalQuestions: number,
  weights: RTTITarget
): RTTITarget => {
  const categories: (keyof RTTITarget)[] = ['r', 't1', 't2', 'i'];
  const totalWeight = weights.r + weights.t1 + weights.t2 + weights.i;
  
  if (totalWeight === 0) return { r: 0, t1: 0, t2: 0, i: 0 };

  // 1. Calculate raw shares and integer parts (base)
  const results = categories.map(cat => {
    const share = (weights[cat] / totalWeight) * totalQuestions;
    return {
      key: cat,
      base: Math.floor(share),
      remainder: share - Math.floor(share)
    };
  });

  let currentSum = results.reduce((sum, item) => sum + item.base, 0);
  let remaining = totalQuestions - currentSum;

  // 2. Distribute remaining units to those with largest remainders
  // Tie-break order: R > T1 > T2 > I (same as categories array order)
  const sorted = [...results].sort((a, b) => {
    if (b.remainder !== a.remainder) return b.remainder - a.remainder;
    // If remainder is same, preserve order R > T1 > T2 > I
    return categories.indexOf(a.key) - categories.indexOf(b.key);
  });

  for (let i = 0; i < remaining; i++) {
    const item = results.find(r => r.key === sorted[i].key);
    if (item) item.base += 1;
  }

  return {
    r: results.find(r => r.key === 'r')!.base,
    t1: results.find(r => r.key === 't1')!.base,
    t2: results.find(r => r.key === 't2')!.base,
    i: results.find(r => r.key === 'i')!.base,
  };
};
