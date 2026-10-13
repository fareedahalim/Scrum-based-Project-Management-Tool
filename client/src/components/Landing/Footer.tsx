import { Globe, Mail, MessageSquare } from 'lucide-react';
import { Container } from '../common/Container';
// import { Container } from '@/components/layout/Container';

const columns = [
  { title: 'Product', links: ['Features', 'Pricing', 'Integrations', 'Changelog'] },
  { title: 'Resources', links: ['Documentation', 'Guides', 'Blog', 'API Reference'] },
  { title: 'Support', links: ['Help Center', 'Contact', 'Status', 'Community'] },
];

const socials = [Globe, MessageSquare, Mail];

export function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white py-14">
      <Container>
        <div className="grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <span className="text-2xl font-extrabold">
              <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                Nexora
              </span>
            </span>
            <p className="mt-4 max-w-xs text-sm text-slate-500">
              The modern project management platform for teams that ship great software.
            </p>
            <div className="mt-6 flex gap-3">
              {socials.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-slate-500 transition-colors hover:bg-primary hover:text-white"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-slate-900">{col.title}</h4>
              <ul className="mt-4 space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-slate-500 transition-colors hover:text-primary">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 border-t border-slate-100 pt-6 text-center text-sm text-slate-400">
          © {new Date().getFullYear()} Nexora. All rights reserved.
        </div>
      </Container>
    </footer>
  );
}
