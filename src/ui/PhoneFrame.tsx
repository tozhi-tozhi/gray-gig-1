import type { ReactNode } from 'react';

export function PhoneFrame({ children }: { children: ReactNode }) {
  return (
    <div className="phone-stage">
      <div className="phone-device">
        {children}
      </div>
    </div>
  );
}
