import { useGame } from '../app/store';
import type { Screen } from '../app/types';

const ALLOWED: Record<Screen, Screen[]> = {
  boot: ['home'],
  home: ['gigBoard', 'endOfDay', 'gameOver', 'gameWin', 'event'],
  gigBoard: ['home', 'gigDetail'],
  gigDetail: ['gigBoard', 'gigCutscene'],
  gigCutscene: ['activeGig'],
  activeGig: ['gigResult', 'endOfDay', 'gameOver', 'gameWin', 'event'], // เปลี่ยนจาก home เป็น gigResult
  gigResult: ['home', 'event', 'endOfDay', 'gameOver', 'gameWin'], // เพิ่มบรรทัดนี้
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