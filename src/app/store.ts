import { create } from 'zustand';
import type { GameState } from './types';
import { START_STATS, START_TIME, START_DEBT } from './constants';
import { rollDailyGigIds } from '../systems/gigBoard';

export const useGame = create<GameState>(() => ({
  screen: 'boot',
  stats: { ...START_STATS },
  time: { ...START_TIME },
  activeGigId: null,
  lastResult: null,
  log: [],
  activeEvent: null,
  pendingEvent: null, // เพิ่มบรรทัดนี้
  debt: { ...START_DEBT },
  dailyGigIds: rollDailyGigIds(START_STATS.rep),
  flags: {},
  history: [],
}));

export const patch = (p: Partial<GameState>) => useGame.setState(p);
export const pushLog = (line: string) =>
  useGame.setState(s => ({ log: [...s.log, line].slice(-50) }));