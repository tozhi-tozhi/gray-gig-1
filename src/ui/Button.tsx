import type { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const VARIANT: Record<Variant, string> = {
  primary:   'bg-emerald-600 hover:bg-emerald-500 text-white',
  secondary: 'bg-neutral-700 hover:bg-neutral-600 text-white',
  danger:    'bg-red-600 hover:bg-red-500 text-white',
  ghost:     'bg-transparent hover:bg-white/5 text-neutral-200 border border-white/10',
};

export function Button({ variant = 'primary', children, className = '', ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`w-full py-3 rounded-xl font-semibold text-sm transition-colors active:scale-[0.98] disabled:opacity-40 disabled:cursor-not-allowed ${VARIANT[variant]} ${className}`}
    >
      {children}
    </button>
  );
}