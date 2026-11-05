export type TimeBlock = 'morning' | 'afternoon' | 'night';

export type Screen =
  | 'boot' | 'home' | 'gigBoard' | 'gigDetail'
  | 'activeGig' | 'endOfDay' | 'gameOver' | 'gameWin'
  | 'event';

export interface Stats {
  money: number;
  heat: number;   // 0..100
  rep: number;    // 1..5
  sanity: number; // 0..100
}

export interface TimeState { day: number; block: TimeBlock; }

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

export interface GameState {
  screen: Screen;
  stats: Stats;
  time: TimeState;
  activeGigId: string | null;
  lastResult: LastResult | null;
  log: string[];
  activeEvent: any | null;
  debt: DebtState; // เพิ่มระบบหนี้เข้าไปในเกม
}