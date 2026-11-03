import { useEffect } from 'react';
import { goTo } from '../systems/fsm';

export function BootScreen() {
  useEffect(() => {
    const t = setTimeout(() => goTo('home'), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="boot-screen flex flex-col items-center justify-center h-full text-white">
      <div className="boot-emblem" aria-hidden="true">
        <span className="boot-emblem-core">G</span>
      </div>
      <div className="boot-wordmark text-3xl font-bold tracking-[0.22em]">
        GRAY GIG
      </div>
      <div className="boot-caption mt-3 text-[10px] tracking-[0.32em] text-neutral-500 uppercase">
        <span className="boot-live-dot" />
        Secure connection established
      </div>
      <div className="mt-8 text-[11px] text-neutral-600 tracking-widest">
        v0.1.0 — prototype
      </div>
    </div>
  );
}
