import type { ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

/** Shared entrance motion for each game screen. The parent keys this by screen name. */
export function ScreenMotion({ children }: Props) {
  return <div className="screen-motion">{children}</div>;
}
