import { GIGS } from '../data/gigs';

export const DAILY_GIG_COUNT = 4; // จำนวนงานต่อวัน (ปรับตรงนี้)

// สุ่มงานของวัน (เรียกเฉพาะตอนเริ่มเกมและตอนขึ้นวันใหม่)
export function rollDailyGigIds(rep: number): string[] {
  const pool = GIGS.filter(g => g.tier <= rep + 1);
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, DAILY_GIG_COUNT).map(g => g.id);
}