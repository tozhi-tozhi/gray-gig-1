import { CLAMP } from '../app/constants';
import { useGame } from '../app/store';
import { goTo } from './fsm';

export function checkWinLoss(): boolean {
  const { stats } = useGame.getState();
  if (stats.sanity <= CLAMP.sanity[0]) { goTo('gameOver'); return true; }
  if (stats.money < 0)                { goTo('gameOver'); return true; }
  return false;
}