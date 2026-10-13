import type { LucideIcon } from 'lucide-react';


export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Step {
  title: string;
  description: string;
}

export interface Role {
  icon: LucideIcon;
  title: string;
  description: string;
}

// export interface Testimonial {
//   name: string;
//   role: string;
//   company: string;
//   review: string;
//   initials: string;
// }


export interface Faq {
  question: string;
  answer: string;
}


export interface Screenshot {
  title: string;
  description: string;
}