import type { TimeBlock } from './types';

export const TOTAL_DAYS = 14;
export const DEBT_GOAL = 10_000;
export const DAILY_COST = 150;

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
};