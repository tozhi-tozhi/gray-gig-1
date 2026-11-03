import { create } from 'zustand';
import type { GameState } from './types';
import { START_STATS, START_TIME } from './constants';

export const useGame = create<GameState>(() => ({
  screen: 'boot',
  stats: { ...START_STATS },
  time: { ...START_TIME },
  activeGigId: null,
  lastResult: null,
  log: [],
}));

export const patch = (p: Partial<GameState>) => useGame.setState(p);

export const pushLog = (line: string) =>
  useGame.setState(s => ({ log: [...s.log, line].slice(-50) }));