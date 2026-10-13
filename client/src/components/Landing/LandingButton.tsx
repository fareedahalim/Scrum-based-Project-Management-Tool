import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

import { cn } from '../../lib/cn';

type Variant = 'primary' | 'outline' | 'ghost' | 'white';

interface LandingButtonProps {
  children: ReactNode;
  to?: string;
  href?: string;
  variant?: Variant;
  className?: string;
}

const base =
  'inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/40';

const styles: Record<Variant, string> = {
  primary:
    'bg-blue-600 text-white shadow-lg shadow-blue-600/25 hover:bg-blue-700 hover:-translate-y-0.5',

  outline:
    'border border-slate-300 bg-white text-slate-700 hover:border-blue-600 hover:text-blue-600',

  ghost:
    'text-slate-600 hover:text-blue-600',

  white:
    'bg-white text-blue-600 shadow-lg shadow-black/10 hover:-translate-y-0.5',
};

export function LandingButton({
  children,
  to,
  href,
  variant = 'primary',
  className,
}: LandingButtonProps) {
  const classes = cn(base, styles[variant], className);

  if (to) {
    return (
      <Link to={to} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <a href={href ?? '#'} className={classes}>
      {children}
    </a>
  );
}