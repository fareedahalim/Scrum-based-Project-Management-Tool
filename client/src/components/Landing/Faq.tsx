import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
// import { Container } from '@/components/layout/Container';
// import { FadeIn } from '@/components/motion/FadeIn';
// import { cn } from '@/lib/cn';
// import { FAQS } from '../data';
import { SectionHeading } from './SectionHeading';
import { Container } from '../common/Container';
import { FadeIn } from '../common/FadeIn';
import { cn } from '../../lib/cn';
import { FAQS } from '../../constants/landing.constants';

export function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="py-24">
      <Container>
        <SectionHeading eyebrow="FAQ" title="Frequently Asked Questions" />

        <div className="mx-auto mt-14 max-w-3xl space-y-3">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <FadeIn key={faq.question} delay={index * 0.03}>
                <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  >
                    <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                    <ChevronDown
                      className={cn(
                        'h-5 w-5 flex-none text-slate-400 transition-transform duration-200',
                        isOpen && 'rotate-180 text-primary',
                      )}
                    />
                  </button>
                  <div
                    className={cn(
                      'grid transition-all duration-200',
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0',
                    )}
                  >
                    <div className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed text-slate-600">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
