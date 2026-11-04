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

export interface GameState {
  screen: Screen;
  stats: Stats;
  time: TimeState;
  activeGigId: string | null;
  lastResult: LastResult | null;
  log: string[];
  activeEvent: any | null;
}