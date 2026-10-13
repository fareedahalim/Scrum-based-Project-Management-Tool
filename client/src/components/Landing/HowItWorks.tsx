// import { Container } from '@/components/layout/Container';
// import { FadeIn } from '@/components/motion/FadeIn';
// import { STEPS } from '../data';
import { STEPS } from '../../constants/landing.constants';
import { Container } from '../common/Container';
import { FadeIn } from '../common/FadeIn';
import { SectionHeading } from './SectionHeading';

export function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-surface py-24">
      <Container>
        <SectionHeading
          eyebrow="How it works"
          title="From Idea to Delivery"
          subtitle="A simple, guided workflow that takes your team from setup to shipped."
        />

        <div className="relative mx-auto mt-16 max-w-3xl">
          {/* vertical line */}
          <div className="absolute left-5 top-2 bottom-2 w-px bg-slate-200 sm:left-6" />

          <div className="space-y-6">
            {STEPS.map((step, index) => (
              <FadeIn key={step.title} delay={index * 0.04}>
                <div className="relative flex items-start gap-5">
                  <span className="z-10 flex h-11 w-11 flex-none items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-lg shadow-primary/25 sm:h-12 sm:w-12">
                    {index + 1}
                  </span>
                  <div className="flex-1 rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <h3 className="text-base font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{step.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
