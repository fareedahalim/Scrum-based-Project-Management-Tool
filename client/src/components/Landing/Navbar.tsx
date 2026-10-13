import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Container } from '../common/Container';
import { cn } from '../../lib/cn';
import { NAV_LINKS } from '../../constants/landing.constants';
import { LandingButton } from './LandingButton';
import { useScrolled } from '../../hooks/useScrolled';

export default function Navbar() {
  const scrolled = useScrolled(8);
  const [open, setOpen] = useState(false);

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-300',
        scrolled
          ? 'border-b border-slate-200/70 bg-white/90 shadow-sm backdrop-blur-md'
          : 'bg-transparent',
      )}
    >
      <Container className="flex h-16 items-center justify-between lg:h-20">

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 text-2xl font-extrabold tracking-tight"
        >
          <span className="bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
            Nexora
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-sm font-medium text-slate-600 transition-colors hover:text-primary"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <LandingButton to="/login" variant="ghost">
            Login
          </LandingButton>

          <LandingButton to="/signup" variant="primary">
            Get Started
          </LandingButton>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="rounded-lg p-2 text-slate-700 transition-colors hover:bg-slate-100 md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </Container>

      {/* Mobile Navigation */}
      {open && (
        <div className="border-t border-slate-100 bg-white shadow-lg md:hidden">
          <Container className="py-4">

            <nav className="flex flex-col gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-3 text-sm font-medium text-slate-600 transition-colors hover:bg-surface hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="mt-4 flex flex-col gap-2 border-t border-slate-100 pt-4">
              <LandingButton
                to="/login"
                variant="outline"
                className="w-full"
              >
                Login
              </LandingButton>

              <LandingButton
                to="/signup"
                variant="primary"
                className="w-full"
              >
                Get Started
              </LandingButton>
            </div>

          </Container>
        </div>
      )}
    </header>
  );
}