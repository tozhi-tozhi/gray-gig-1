import { mulberry32 } from '../app/utils/rng';
import { useGame } from '../app/store';
import { CLAMP } from '../app/constants';
import { RANDOM_EVENTS, type GameEvent } from '../data/events';
import type { Stats, Gig } from '../app/types';

// ตั้งค่าตัวสุ่มใหม่ทุกครั้งที่โหลดเกม เพื่อให้ผลลัพธ์ไม่ซ้ำเดิม
let rng = mulberry32(Date.now());

export function seedRandom(seed: number): void {
  rng = mulberry32(seed);
}

export function rollPolice(risk: number): boolean {
  return rng() < risk;
}

// สุ่มเหตุการณ์แทรกซ้อน (โอกาส 30%)
export function rollRandomEvent(): GameEvent | null {
  const chance = 0.3;
  if (rng() > chance) return null;
  if (RANDOM_EVENTS.length === 0) return null;
  const randomIndex = Math.floor(rng() * RANDOM_EVENTS.length);
  return RANDOM_EVENTS[randomIndex];
}

// ===== ระบบสุ่มผลลัพธ์หลังเสร็จงาน (Idea 2 เดิม) =====
export interface GigOutcome {
  id: 'normal' | 'bonus' | 'underpaid' | 'police' | 'disaster';
  weight: number;
  moneyMultiplier: number;
  extraHeat: number;
  extraSanity: number;
  text: string | null;
}

export function rollGigOutcome(gig: Gig): GigOutcome {
  // ความเสี่ยงตำรวจของงานนี้ ถูกแปลงเป็นน้ำหนักของเหตุการณ์ "โดนตำรวจตรวจ"
  const policeWeight = Math.round(gig.policeRisk * 100);

  const table = [
    { id: 'normal', weight: 55, moneyMultiplier: 1, extraHeat: 0, extraSanity: 0, text: null },
    { id: 'bonus', weight: 15, moneyMultiplier: 1.25, extraHeat: 0, extraSanity: 5, text: '😊 ลูกค้าถูกใจ ให้เงินเพิ่มเล็กน้อย' },
    { id: 'underpaid', weight: 10, moneyMultiplier: 0.5, extraHeat: 0, extraSanity: -5, text: '😤 ลูกค้าเบี้ยว ได้เงินแค่ครึ่งเดียว' },
    { id: 'police', weight: policeWeight, moneyMultiplier: 0.75, extraHeat: 15, extraSanity: 0, text: '🚨 ตำรวจตรวจงานนี้! เงินลดลง และค่าความร้อนเพิ่ม' },
    { id: 'disaster', weight: 5, moneyMultiplier: 0.25, extraHeat: 5, extraSanity: -15, text: '💥 งานพัง ได้เงินน้อยมาก และเสียสติเพิ่ม' },
  ].filter((item) => item.weight > 0) as GigOutcome[];

  const totalWeight = table.reduce((sum, item) => sum + item.weight, 0);
  let roll = rng() * totalWeight;

  for (const outcome of table) {
    if (roll < outcome.weight) return outcome;
    roll -= outcome.weight;
  }
  return table[0];
}

// คำนวณค่าสถานะเมื่อผู้เล่นเลือกเหตุการณ์
export function applyEventEffect(effect: Partial<Stats>): Stats {
  const s = useGame.getState().stats;
  const clamp = (v: number, [lo, hi]: [number, number]) =>
    Math.max(lo, Math.min(hi, v));

  return {
    money: s.money + (effect.money || 0),
    heat: clamp(s.heat + (effect.heat || 0), CLAMP.heat),
    rep: clamp(s.rep + (effect.rep || 0), CLAMP.rep),
    sanity: clamp(s.sanity + (effect.sanity || 0), CLAMP.sanity),
  };
}