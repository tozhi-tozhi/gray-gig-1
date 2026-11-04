import { useGame } from '../app/store';
import type { Screen } from '../app/types';

const ALLOWED: Record<Screen, Screen[]> = {
  boot: ['home'],
  home: ['gigBoard', 'endOfDay', 'gameOver', 'gameWin', 'event'],
  gigBoard: ['home', 'gigDetail'],
  gigDetail: ['gigBoard', 'activeGig'],
  activeGig: ['home', 'endOfDay', 'gameOver', 'gameWin'],
  endOfDay: ['home', 'gameOver', 'gameWin', 'event'],
  gameOver: [],
  gameWin: [],
  event: ['home', 'gameOver', 'gameWin'],
};

export function goTo(next: Screen): void {
  const cur = useGame.getState().screen;
  
  if (!ALLOWED[cur] || !ALLOWED[cur].includes(next)) {
    console.warn(`[FSM] illegal transition: ${cur} → ${next}`);
    return;
  }
  
  console.log(`[FSM] เปลี่ยนจาก ${cur} ไป ${next} สำเร็จ!`);
  useGame.setState({ screen: next });
}