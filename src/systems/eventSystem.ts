import { mulberry32 } from '../app/utils/rng';
import { useGame } from '../app/store';
import { CLAMP } from '../app/constants';
import { RANDOM_EVENTS, type GameEvent } from '../data/events';
import type { Stats, Gig } from '../app/types';
import { STORY_EVENTS } from '../data/storyEvents';
import { isEventAvailable } from './storySystem';

// ตั้งค่าตัวสุ่มใหม่ทุกครั้งที่โหลดเกม เพื่อให้ผลลัพธ์ไม่ซ้ำเดิม
let rng = mulberry32(Date.now());

export function seedRandom(seed: number): void {
  rng = mulberry32(seed);
}

export function rollPolice(risk: number): boolean {
  return rng() < risk;
}

// สุ่มเหตุการณ์แทรกซ้อน (โอกาส 30%) ถ้ามีเหตุการณ์ต่อเนื่องที่เงื่อนไขครบ จะได้ตัวนั้นก่อน 60%
export function rollRandomEvent(): GameEvent | null {
  if (rng() > 0.3) return null;

  const chain = STORY_EVENTS.filter(isEventAvailable);
  if (chain.length > 0 && rng() < 0.6) {
    return chain[Math.floor(rng() * chain.length)];
  }

  const pool = RANDOM_EVENTS.filter(isEventAvailable);
  if (pool.length === 0) return null;
  return pool[Math.floor(rng() * pool.length)];
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

// ตารางผลลัพธ์ของงาน (ใช้ทั้งตอนสุ่มจริงและตอนคำนวณความเสี่ยง)
export function buildOutcomeTable(gig: Gig, qteScore = 50): GigOutcome[] {
  const skill = (qteScore - 50) / 50; // -1 (แย่สุด) ถึง +1 (เก่งสุด)
  const policeWeight = Math.round(gig.policeRisk * 100 * (1 - skill * 0.4));

  return [
    { id: 'normal', weight: 55, moneyMultiplier: 1, extraHeat: 0, extraSanity: 0, text: null },
    { id: 'bonus', weight: Math.max(1, Math.round(15 + skill * 10)), moneyMultiplier: 1.25, extraHeat: 0, extraSanity: 5, text: '😊 ลูกค้าถูกใจ ให้เงินเพิ่มเล็กน้อย' },
    { id: 'underpaid', weight: Math.max(1, Math.round(10 - skill * 6)), moneyMultiplier: 0.5, extraHeat: 0, extraSanity: -5, text: '😤 ลูกค้าเบี้ยว ได้เงินแค่ครึ่งเดียว' },
    { id: 'police', weight: policeWeight, moneyMultiplier: 0.75, extraHeat: 15, extraSanity: 0, text: '🚨 ตำรวจตรวจงานนี้! เงินลดลง และค่าความร้อนเพิ่ม' },
    { id: 'disaster', weight: Math.max(1, Math.round(5 - skill * 4)), moneyMultiplier: 0.25, extraHeat: 5, extraSanity: -15, text: '💥 งานพัง ได้เงินน้อยมาก และเสียสติเพิ่ม' },
  ].filter((item) => item.weight > 0) as GigOutcome[];
}

// qteScore 0-100: ยิ่งสูง โอกาสโบนัสเพิ่ม / โอกาสพังและตำรวจลด
export function rollGigOutcome(gig: Gig, qteScore = 50): GigOutcome {
  const table = buildOutcomeTable(gig, qteScore);
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