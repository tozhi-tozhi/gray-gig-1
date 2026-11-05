import type { TimeBlock } from './types';

export const TOTAL_DAYS = 14;   // เส้นตายเริ่มต้น (เก็บไว้ใช้อ้างอิง)
export const DEBT_GOAL = 10_000;
export const DAILY_COST = 150;

// ค่าตั้งต้นของระบบหนี้
export const START_DEBT = {
  goal: DEBT_GOAL,
  deadlineDay: TOTAL_DAYS,  // เส้นตายเริ่มต้นที่ 14 วัน
  extensionsLeft: 2,        // ขอขยายหนี้ได้ 2 ครั้ง
  creditorMood: 50,         // อารมณ์เจ้าหนี้เริ่มต้น (กลางๆ)
  lastCollectionDay: 0,     // ยังไม่เคยถูกทวง
} as const;

// ค่าใช้จ่ายและผลของการขอขยายหนี้
export const EXTENSION_COST = 200;        // เงินที่ต้องจ่ายเพื่อขอขยาย
export const EXTENSION_MOOD_PENALTY = 5;  // อารมณ์เจ้าหนี้ลดลงเมื่อขอขยายสำเร็จ

export const START_STATS = { money: 300, heat: 0, rep: 1, sanity: 80 } as const;
export const START_TIME = { day: 1, block: 'morning' as TimeBlock };

export const TIME_BLOCKS: TimeBlock[] = ['morning', 'afternoon', 'night'];
export const BLOCK_LABEL: Record<TimeBlock, string> = {
  morning: 'เช้า',
  afternoon: 'บ่าย',
  night: 'ดึก',
};

export const NORMAL_LIFE = {
  work: { money: 200, heat: -3, sanity: -5, label: 'ไปทำงานประจำ' },
  rest: { money: 0,   heat: -10, sanity: 20, label: 'นอนพักผ่อน' },
} as const;

export const CLAMP = {
  heat:   [0, 100] as [number, number],
  sanity: [0, 100] as [number, number],
  rep:    [1, 5]   as [number, number],
  mood:   [0, 100] as [number, number], // เพิ่มขอบเขตอารมณ์เจ้าหนี้
};