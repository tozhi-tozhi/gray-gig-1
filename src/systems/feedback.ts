// ระบบเอฟเฟกต์: สั่นจอ / แฟลชสี / เสียง Beep (ไม่ต้องใช้ไฟล์เสียง)
type BeepType = 'good' | 'bad' | 'warn' | 'tick';

let audioCtx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  try {
    if (!audioCtx) {
      const Ctor = window.AudioContext || (window as any).webkitAudioContext;
      if (!Ctor) return null;
      audioCtx = new Ctor();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
    return audioCtx;
  } catch {
    return null;
  }
}

// [ความถี่ Hz, ความยาววินาที]
const TONES: Record<BeepType, [number, number][]> = {
  good: [[880, 0.08], [1320, 0.12]],
  bad: [[220, 0.15], [150, 0.25]],
  warn: [[520, 0.1], [520, 0.1]],
  tick: [[660, 0.05]],
};

export function beep(type: BeepType): void {
  const ctx = getCtx();
  if (!ctx) return;
  let t = ctx.currentTime;
  for (const [freq, dur] of TONES[type]) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type === 'bad' ? 'sawtooth' : 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.08, t); // ความดัง (ปรับตรงนี้)
    gain.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + dur);
    t += dur + 0.03;
  }
}

// สั่นกรอบมือถือ
export function shake(): void {
  const el = document.querySelector('.phone-device') as HTMLElement | null;
  if (!el) return;
  el.classList.remove('fx-shake');
  void el.offsetWidth; // รีสตาร์ทแอนิเมชัน
  el.classList.add('fx-shake');
}

// แฟลชสีทั้งจอ
export function flash(color = '#ffffff'): void {
  const el = document.createElement('div');
  el.className = 'fx-flash';
  el.style.background = color;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 450);
}