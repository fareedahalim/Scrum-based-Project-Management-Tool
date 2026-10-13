// import { Container } from '@/components/layout/Container';
// import { FadeIn } from '@/components/motion/FadeIn';
// import { ROLES } from '../data';
import { ROLES } from '../../constants/landing.constants';
import { Container } from '../common/Container';
import { FadeIn } from '../common/FadeIn';
import { SectionHeading } from './SectionHeading';

export function RoleManagement() {
  return (
    <section id="roles" className="py-24">
      <Container>
        <SectionHeading
          eyebrow="Role Management"
          title="Built for Every Role"
subtitle="Each Scrum role gets the permissions and responsibilities needed to manage the project effectively."        />

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {ROLES.map((role, index) => (
            <FadeIn key={role.title} delay={index * 0.05}>
              <div className="h-full rounded-2xl border border-slate-100 bg-gradient-to-b from-white to-surface p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-accent">
                  <role.icon className="h-6 w-6" />
                </span>
                <h3 className="mt-5 text-lg font-semibold text-slate-900">{role.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{role.description}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </Container>
    </section>
  );
}
