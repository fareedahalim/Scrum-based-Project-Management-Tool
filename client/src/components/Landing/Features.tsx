// import { Container } from '@/components/layout/Container';
// import { FadeIn } from '@/components/motion/FadeIn';
import { FEATURES } from '../../constants/landing.constants';
import { Container } from '../common/Container';
import { FadeIn } from '../common/FadeIn';
// import { FEATURES } from '../data';
import { SectionHeading } from './SectionHeading';

export function Features() {
  return (
    <section id="features" className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Features"
          title="Everything Your Team Needs"
          subtitle="One platform to plan, build, collaborate and deliver — without switching tools."
        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((feature, index) => (
            <FadeIn key={feature.title} delay={index * 0.05}>
              <div className="group h-full rounded-2xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-primary/20 hover:shadow-xl">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <feature.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{feature.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
