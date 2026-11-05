import { CLAMP } from '../app/constants';
import { buildOutcomeTable } from './eventSystem';
import type { Gig, Stats } from '../app/types';

export interface GigRisk {
  heatDeath: number;   // 0..1 โอกาสแพ้เพราะ Heat เต็ม
  sanityDeath: number; // 0..1 โอกาสแพ้เพราะสติหมด
  total: number;       // 0..1 โอกาสแพ้รวม (นับไม่ซ้ำ)
}

// คำนวณโอกาสแพ้หลังทำงานนี้ จากตารางผลลัพธ์สุ่มจริง
export function assessGigRisk(gig: Gig, stats: Stats, qteScore = 50): GigRisk {
  const table = buildOutcomeTable(gig, qteScore);
  const totalW = table.reduce((s, o) => s + o.weight, 0);
  let heatW = 0, sanW = 0, anyW = 0;

  for (const o of table) {
    const heat = stats.heat + gig.heatGain + o.extraHeat;
    const sanity = stats.sanity - gig.sanityCost + o.extraSanity;
    const h = heat >= CLAMP.heat[1];
    const s = sanity <= CLAMP.sanity[0];
    if (h) heatW += o.weight;
    if (s) sanW += o.weight;
    if (h || s) anyW += o.weight;
  }
  return { heatDeath: heatW / totalW, sanityDeath: sanW / totalW, total: anyW / totalW };
}

// แสดงเป็นข้อความเปอร์เซ็นต์ (ถ้ามีโอกาสน้อยมากก็ขึ้นอย่างน้อย 1%)
export const pct = (x: number): string =>
  x >= 1 ? '100%' : x > 0 ? `${Math.max(1, Math.round(x * 100))}%` : '0%';