import { Container } from '../common/Container';
import { FadeIn } from '../common/FadeIn';
import { LandingButton } from './LandingButton';

export function CallToAction() {
  return (
    <section id="cta" className="py-24">
      <Container>
        <FadeIn>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-accent px-8 py-16 text-center shadow-2xl shadow-primary/20 sm:px-16">
            <div className="pointer-events-none absolute -top-20 -right-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <div className="pointer-events-none absolute -bottom-20 -left-16 h-64 w-64 rounded-full bg-white/10 blur-2xl" />
            <h2 className="relative text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready To Build Better Software?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-lg text-white/90">
              Join thousands of teams shipping faster with Nexora. Get started in minutes.
            </p>
            <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <LandingButton to="/signup" variant="white" className="px-8 py-3.5">
                Start Free
              </LandingButton>
              {/* <LandingButton
                href="mailto:sales@nexora.app"
                variant="outline"
                className="border-white/40 px-8 py-3.5 text-white hover:border-white hover:text-white"
              >
                Contact Sales
              </LandingButton> */}
            </div>
          </div>
        </FadeIn>
      </Container>
    </section>
  );
}
