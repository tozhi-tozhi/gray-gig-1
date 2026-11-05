import { patch, useGame } from '../app/store';
import type { FlagValue, HistoryEntry } from '../app/types';
import type { GameEvent } from '../data/events';

// ตั้งค่าธง (เช่น { fedCat: true })
export function setFlags(f: Record<string, FlagValue>): void {
  patch({ flags: { ...useGame.getState().flags, ...f } });
}

// เพิ่มตัวนับ (เช่น จำนวนงานที่ทำ)
export function bump(key: string, by = 1): void {
  const cur = useGame.getState().flags[key];
  setFlags({ [key]: (typeof cur === 'number' ? cur : 0) + by });
}

// จดประวัติเหตุการณ์ (ใช้ในบทส่งท้าย)
export function recordHistory(entry: Omit<HistoryEntry, 'day'>): void {
  const s = useGame.getState();
  patch({ history: [...s.history, { ...entry, day: s.time.day }].slice(-200) });
}

export function markEventSeen(id: string): void {
  setFlags({ [`seen:${id}`]: true });
}

// อีเวนต์นี้ขึ้นได้ตอนนี้ไหม (เช็กวัน / ธงที่ต้องมี / ธงที่ห้ามมี / ขึ้นซ้ำ)
export function isEventAvailable(ev: GameEvent): boolean {
  const { flags, time } = useGame.getState();
  if (ev.minDay && time.day < ev.minDay) return false;
  if (ev.requires?.some(k => !flags[k])) return false;
  if (ev.blocks?.some(k => flags[k])) return false;
  const once = ev.once ?? !!ev.requires; // อีเวนต์ต่อเนื่องขึ้นได้ครั้งเดียวโดยปริยาย
  if (once && flags[`seen:${ev.id}`]) return false;
  return true;
}