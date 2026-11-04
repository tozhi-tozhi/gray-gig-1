import { mulberry32 } from '../app/utils/rng';
import { useGame } from '../app/store'; // <-- เพิ่ม import ตัวนี้
import { CLAMP } from '../app/constants';
import { RANDOM_EVENTS, type GameEvent } from '../data/events';
import type { Stats } from '../app/types';

let rng = mulberry32(0xC0FFEE);

export function seedRandom(seed: number): void {
  rng = mulberry32(seed);
}

export function rollPolice(risk: number): boolean {
  return rng() < risk;
}

// ฟังก์ชันสำหรับสุ่มเหตุการณ์ (โอกาส 30%)
export function rollRandomEvent(): GameEvent | null {
  const chance = 0.3;
  if (rng() > chance) return null; 

  const randomIndex = Math.floor(rng() * RANDOM_EVENTS.length);
  return RANDOM_EVENTS[randomIndex];
}

// ฟังก์ชันสำหรับคำนวณผลลัพธ์เมื่อผู้เล่นเลือก
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