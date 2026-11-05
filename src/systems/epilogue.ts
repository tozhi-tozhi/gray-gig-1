import { useGame } from '../app/store';
import { FLAG_EPILOGUE } from '../data/storyEvents';

export type EndingCause = 'win' | 'sanity' | 'heat' | 'money' | 'deadline';

interface EndingCtx { money: number; day: number; deadlineDay: number; goal: number }

// ข้อความตอนจบแต่ละแบบ
export const ENDINGS: Record<EndingCause, { title: string; subtitle: (c: EndingCtx) => string; after: string }> = {
  win: {
    title: '🏆 จ่ายหนี้ครบ!',
    subtitle: c => `คุณหาเงินได้ $${c.money} และจ่ายหนี้ให้พี่โจครบภายในวัน ${c.day} คุณเป็นอิสระแล้ว!`,
    after: 'หลายเดือนต่อมา คุณยังตื่นกลางดึกด้วยความเคยชินว่าจะมีเสียงโทรศัพท์ แต่คราวนี้ไม่มีใครโทรมา หนี้ก้อนนั้นจบลงแล้ว สิ่งที่เหลืออยู่คือคำถามว่าคุณยอมแลกอะไรไปบ้างเพื่อมาถึงจุดนี้',
  },
  sanity: {
    title: '🧠 สติแตก',
    subtitle: () => 'คุณทนความกดดันไม่ไหว สภาพจิตใจพังทลาย และยอมแพ้ทุกอย่าง',
    after: 'บางคนบอกว่าเห็นคุณนั่งอยู่ริมถนน พึมพำตัวเลขหนี้ซ้ำไปซ้ำมา เสียงโทรศัพท์ที่ไม่มีใครโทรมาดังอยู่ในหัวคุณทุกคืน',
  },
  heat: {
    title: '🚨 ถูกจับกุม',
    subtitle: () => 'ตำรวจรวบตัวคุณได้ในที่สุด ความร้อนสูงเกินกว่าจะหลบซ่อนอีกต่อไป',
    after: 'ข่าวเช้าวันรุ่งขึ้นใช้เวลาสิบวินาทีเล่าชีวิตคุณทั้งหมด แฟ้มคดีหนาขึ้นอีกเล่ม ส่วนหนี้ก้อนนั้น ไม่มีใครบอกพี่โจว่าเขาควรไปทวงจากใคร',
  },
  money: {
    title: '💸 เงินหมดตัว',
    subtitle: () => 'คุณถูกไล่ที่ ไม่มีเงินจ่ายค่ากินอยู่ และไม่มีใครช่วยเหลือ',
    after: 'ห้องเช่าถูกเปลี่ยนกุญแจก่อนที่คุณจะกลับถึง ข้าวของถูกกองไว้หน้าประตู ไม่มีใครมาถามไถ่ แม้แต่คนที่เคยโทรมาทวง',
  },
  deadline: {
    title: '🕴️ พี่โจมาเก็บหนี้',
    subtitle: c => `เลยกำหนดวัน ${c.deadlineDay} แล้ว แต่คุณมีแค่ $${c.money} (ต้องการ $${c.goal}) พี่โจไม่รออีกต่อไป...`,
    after: 'พี่โจไม่เคยตะโกน เขาแค่ปิดสมุดบัญชีเบาๆ แล้วบอกลูกน้องว่า "ไปรับของเรากันได้แล้ว"',
  },
};

// ตอนจบนี้เกิดจากอะไร (ลำดับเดียวกับหน้าจอ Game Over เดิม)
export function getEndingCause(isWin: boolean): EndingCause {
  const { stats } = useGame.getState();
  if (isWin) return 'win';
  if (stats.sanity <= 0) return 'sanity';
  if (stats.heat >= 100) return 'heat';
  if (stats.money < 0) return 'money';
  return 'deadline';
}

export interface Epilogue {
  summary: string[];    // ภาพรวมการเดินทาง
  story: string[];      // เรื่องที่ตามคุณมา (จากธงเรื่องราว)
  highlights: string[]; // ฉากที่ยังจำได้
  after: string;        // หลังจากนั้น
}

// สร้างบทส่งท้ายจากสิ่งที่ผู้เล่นทำมาจริง (ใช้ได้กับทุกแบบจบ)
export function buildEpilogue(cause: EndingCause): Epilogue {
  const { flags, history, debt, time } = useGame.getState();
  const n = (k: string) => (typeof flags[k] === 'number' ? (flags[k] as number) : 0);
  const gigs = n('gigsDone');
  const isWin = cause === 'win';

  // --- ภาพรวม ---
  const summary: string[] = [];
  summary.push(
    gigs === 0
      ? `ตลอด ${time.day} วัน คุณแทบไม่ได้แตะงานเทาเลย`
      : `ตลอด ${time.day} วัน คุณรับงานเทาสำเร็จ ${gigs} งาน หาเงินจากงานเหล่านั้นรวม $${n('earned')}`
  );

  const traits: string[] = [];
  if (n('highTierGigs') >= 2) traits.push(`คุณไม่กลัวเส้นอันตราย รับงานระดับสูงถึง ${n('highTierGigs')} ครั้ง`);
  if (n('policeBusts') >= 2) traits.push(`ตำรวจตรวจงานคุณถึง ${n('policeBusts')} ครั้ง ชื่อคุณคงอยู่ในสมุดจดของใครสักคนแล้ว`);
  if (n('disasters') >= 2) traits.push(`งานพังไป ${n('disasters')} ครั้ง ซึ่งอย่างน้อยก็ทำให้คุณเก่งเรื่องเอาตัวรอด`);
  if (gigs >= 3 && n('highTierGigs') === 0 && n('policeBusts') === 0) traits.push('คุณเลือกงานเล็กๆ ที่เสี่ยงน้อย และรอดจากสายตาตำรวจมาได้ตลอด');
  summary.push(...traits.slice(0, 2));

  const extUsed = 2 - debt.extensionsLeft;
  if (extUsed > 0) summary.push(`คุณขอขยายหนี้ ${extUsed} ครั้ง ซื้อเวลาด้วยราคาที่ต้องจ่ายทั้งเงินและศักดิ์ศรี`);

  // --- พี่โจตอนจบ ---
  const mood = debt.creditorMood;
  if (isWin) {
    summary.push(
      mood >= 70 ? 'พี่โจนับเงินครบแล้วยิ้มบางๆ "แกเป็นลูกหนี้ที่ดีที่สุดที่ฉันเคยมี"'
      : mood >= 40 ? 'พี่โจนับเงินครบแล้วพยักหน้า ไม่ขอบคุณ ไม่ตำหนิ มีแต่ความเงียบระหว่างพวกคุณ'
      : 'พี่โจรับเงินครบ แต่สายตาเขาบอกว่าถ้าคุณกลับมายืมอีก ครั้งหน้าจะไม่ใช่ดอกเบี้ยแบบนี้'
    );
  } else {
    summary.push(
      mood >= 70 ? 'พี่โจถอนหายใจ "เสียดายนะ ฉันชอบแกอยู่" ซึ่งอาจเป็นคำพูดที่ใจดีที่สุดที่เขาเคยพูด'
      : mood >= 40 ? 'พี่โจไม่ได้โกรธ เขาแค่บันทึกชื่อคุณลงในสมุดอีกเล่ม'
      : 'พี่โจไม่พูดอะไรเลย ซึ่งน่ากลัวกว่าคำขู่ใดๆ'
    );
  }

  // --- เรื่องที่ตามคุณมา (ธงที่เป็นจริง) ---
  const story = Object.keys(flags)
    .filter(k => flags[k] && FLAG_EPILOGUE[k])
    .map(k => FLAG_EPILOGUE[k]);

  // --- ฉากที่ยังจำได้ ---
  const NOTABLE = ['story', 'timeout', 'police', 'disaster'];
  const highlights = history
    .filter(e => e.tag && NOTABLE.includes(e.tag))
    .slice(-6)
    .map(e => `Day ${e.day} · ${e.title} — ${e.detail}`);

  return { summary, story, highlights, after: ENDINGS[cause].after };
}