export type TimeBlock = 'morning' | 'afternoon' | 'night';

export type Screen =
  | 'boot' | 'home' | 'gigBoard' | 'gigDetail' | 'gigCutscene'
  | 'activeGig' | 'endOfDay' | 'gameOver' | 'gameWin'
  | 'event';

export interface Stats {
  money: number;
  heat: number;   // 0..100
  rep: number;    // 1..5
  sanity: number; // 0..100
}

export interface TimeState { day: number; block: TimeBlock; }

// ฉากหลังของงาน (ใช้ใน GigCutsceneScreen)
export type GigBackground = 'alley' | 'market' | 'warehouse' | 'rooftop' | 'dock';

// ฉากหลังของอีเวนต์ (ใช้ใน EventScreen)
export type EventBackground = 'police' | 'creditor' | 'found' | 'dream' | 'food' | 'mystery';

// ตัวละครที่โผล่ในอีเวนต์ (ถ้ามี)
export type EventCharacter = 'joe' | 'police';

export interface Gig {
  id: string;
  title: string;
  description: string;
  tier: 1 | 2 | 3 | 4 | 5;
  durationBlocks: 1 | 2;
  rewardMoney: number;
  rewardRep: number;
  heatGain: number;
  sanityCost: number;
  policeRisk: number;
  background: GigBackground; // ← ใหม่
}

export interface LastResult {
  title: string;
  lines: string[];
}

// ผลกระทบต่อระบบหนี้ (ใช้กับเหตุการณ์ของเจ้าหนี้)
export interface DebtEffect {
  mood?: number;      // เปลี่ยนอารมณ์เจ้าหนี้ (+ ดีขึ้น / - แย่ลง)
  deadline?: number;  // เปลี่ยนเส้นตาย (+ ยืดออก / - เร่งเข้า)
}

// สถานะหนี้สินและเจ้าหนี้
export interface DebtState {
  goal: number;              // เป้าหมายเงินที่ต้องจ่าย
  deadlineDay: number;       // เส้นตาย (ขยับได้)
  extensionsLeft: number;    // จำนวนครั้งที่ขอขยายหนี้ได้
  creditorMood: number;      // อารมณ์เจ้าหนี้ (0=โกรธจัด, 100=ใจดี)
  lastCollectionDay: number; // วันที่ถูกทวงล่าสุด (กันทวงซ้ำในวันเดียว)
}
export type FlagValue = boolean | number;

// บันทึกเหตุการณ์สำคัญในรอบเล่น (ใช้สร้างบทส่งท้าย)
export interface HistoryEntry {
  day: number;
  kind: 'gig' | 'event';
  title: string;
  detail: string;
  tag?: string; // police / disaster / bonus / timeout / story
}

export interface GameState {
  screen: Screen;
  stats: Stats;
  time: TimeState;
  activeGigId: string | null;
  lastResult: LastResult | null;
  log: string[];
  activeEvent: any | null;
  debt: DebtState; // เพิ่มระบบหนี้เข้าไปในเกม
  dailyGigIds: string[]; // งานที่เปิดอยู่วันนี้ (สุ่มใหม่เมื่อขึ้นวันใหม่ ทำแล้วหายไป)
  flags: Record<string, FlagValue>; // ธงเรื่องราว + ตัวนับ
  history: HistoryEntry[];
}