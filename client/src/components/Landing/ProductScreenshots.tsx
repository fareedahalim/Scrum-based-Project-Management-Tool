import type { ReactNode } from 'react';
// import { Container } from '@/components/layout/Container';
// import { FadeIn } from '@/components/motion/FadeIn';
// import { SCREENSHOTS } from '../data';
import { SectionHeading } from './SectionHeading';
import { Container } from '../common/Container';
import { SCREENSHOTS } from '../../constants/landing.constants';
import { FadeIn } from '../common/FadeIn';

function WindowChrome({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-lg">
      <div className="flex items-center gap-1.5 border-b border-slate-100 bg-slate-50 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

const mockups: ReactNode[] = [
  // Dashboard
  <div className="space-y-3" key="dash">
    <div className="grid grid-cols-3 gap-2">
      {['Tasks', 'Sprints', 'Done'].map((label, i) => (
        <div key={label} className="rounded-lg bg-surface p-3">
          <div className="text-[10px] text-slate-400">{label}</div>
          <div className="mt-1 text-lg font-bold text-slate-800">{[128, 6, 92][i]}</div>
        </div>
      ))}
    </div>
    <div className="flex h-24 items-end gap-2 rounded-lg bg-surface p-3">
      {[40, 65, 50, 80, 60, 90, 70].map((h, i) => (
        <div key={i} className="flex-1 rounded-t bg-gradient-to-t from-primary to-accent" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>,
  // Sprint Board
  <div className="grid grid-cols-3 gap-2" key="board">
    {['To Do', 'In Progress', 'Done'].map((col) => (
      <div key={col} className="rounded-lg bg-surface p-2">
        <div className="mb-2 text-[10px] font-semibold text-slate-500">{col}</div>
        <div className="space-y-2">
          <div className="h-10 rounded-md border border-slate-100 bg-white shadow-sm" />
          <div className="h-10 rounded-md border border-slate-100 bg-white shadow-sm" />
        </div>
      </div>
    ))}
  </div>,
  // Analytics
  <div className="space-y-3" key="analytics">
    <div className="flex items-center justify-between">
      <div className="text-xs font-semibold text-slate-600">Burndown</div>
      <div className="text-[10px] text-emerald-600">On track</div>
    </div>
    <svg viewBox="0 0 200 90" className="h-28 w-full">
      <polyline
        fill="none"
        stroke="#2563eb"
        strokeWidth="3"
        points="0,10 40,30 80,35 120,55 160,70 200,85"
      />
      <polyline fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="4" points="0,10 200,85" />
    </svg>
  </div>,
];

export function ProductScreenshots() {
  return (
    <section className="bg-surface py-24">
      <Container>
        <SectionHeading
          eyebrow="Product"
          title="See Nexora in Action"
          subtitle="A clean, fast interface your whole team will actually enjoy using."
        />

        <div className="mt-16 grid gap-8 lg:grid-cols-3">
          {SCREENSHOTS.map((shot, index) => (
            <FadeIn key={shot.title} delay={index * 0.08}>
              <div className="transition-transform duration-200 hover:-translate-y-1">
                <WindowChrome>{mockups[index]}</WindowChrome>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{shot.title}</h3>
                <p className="mt-1 text-sm text-slate-600">{shot.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
