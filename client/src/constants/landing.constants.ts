import {
  BarChart3,
  Bell,
  FolderKanban,
  KanbanSquare,
  ListTodo,
  ShieldCheck,
  Timer,
  Users,
} from 'lucide-react';

import type {
  Faq,
  Feature,
  NavLink,
  Role,
  Screenshot,
  Step,
} from '../types/landingTypes';


// =========================
// NAVIGATION
// =========================

export const NAV_LINKS = [
  {
    label: 'Features',
    href: '#features',
  },
  {
    label: 'How It Works',
    href: '#how-it-works',
  },
  {
    label: 'Roles',
    href: '#roles',
  },
  {
    label: 'FAQ',
    href: '#faq',
  },
];


// =========================
// FEATURES
// =========================

export const FEATURES: Feature[] = [
  {
    icon: FolderKanban,
    title: 'Project Management',
    description:
      'Create and manage software projects with a structured Scrum workflow.',
  },

  {
    icon: ListTodo,
    title: 'Product Backlog',
    description:
      'Organize epics and user stories into a prioritized product backlog.',
  },

  {
    icon: Timer,
    title: 'Sprint Planning',
    description:
      'Select backlog stories, define sprint goals and prepare focused sprints.',
  },

  {
    icon: KanbanSquare,
    title: 'Sprint Board',
    description:
      'Track sprint tasks as developers move work from To Do to In Progress, Review and Done.',
  },

  {
    icon: Users,
    title: 'Team Management',
    description:
      'Manage project members and assign responsibilities according to Scrum roles.',
  },

  {
    icon: BarChart3,
    title: 'Sprint Reports',
    description:
      'Monitor sprint progress, velocity, burndown and completed work.',
  },

  {
    icon: ShieldCheck,
    title: 'Role-Based Access',
    description:
      'Provide the right permissions to Organization Admins, Product Owners, Scrum Masters and Developers.',
  },

  {
    icon: Bell,
    title: 'Notifications',
    description:
      'Keep team members informed about assignments, updates and important project activity.',
  },
];


// =========================
// SCRUM WORKFLOW
// =========================

export const STEPS: Step[] = [
  {
    title: 'Create Project',
    description:
      'The Organization Admin creates and configures the software project.',
  },

  {
    title: 'Create Product Backlog',
    description:
      'The Product Owner creates epics and breaks them down into user stories.',
  },

  {
    title: 'Prioritize Backlog',
    description:
      'The Product Owner organizes and prioritizes stories for upcoming development.',
  },

  {
    title: 'Plan the Sprint',
    description:
      'The Scrum Master selects stories from the Product Backlog during sprint planning.',
  },

  {
    title: 'Create Sprint Tasks',
    description:
      'Selected stories are broken down into smaller development tasks.',
  },

  {
    title: 'Assign Developers',
    description:
      'The Scrum Master assigns sprint tasks to the appropriate developers.',
  },

  {
    title: 'Start Sprint',
    description:
      'The sprint begins and developers work on their assigned tasks.',
  },

  {
    title: 'Track Sprint Progress',
    description:
      'The team uses the Sprint Board to monitor and update task progress.',
  },

  {
    title: 'Complete Sprint',
    description:
      'Completed work is reviewed, accepted and reflected in sprint reports.',
  },
];


// =========================
// SCRUM ROLES
// =========================

export const ROLES: Role[] = [
  {
    icon: ShieldCheck,
    title: 'Organization Admin',
    description:
      'Manages users, teams, projects and organization-level permissions.',
  },

  {
    icon: FolderKanban,
    title: 'Product Owner',
    description:
      'Creates epics and user stories, manages and prioritizes the Product Backlog.',
  },

  {
    icon: Timer,
    title: 'Scrum Master',
    description:
      'Plans sprints, selects stories, creates tasks, assigns developers and monitors sprint execution.',
  },

  {
    icon: KanbanSquare,
    title: 'Developer',
    description:
      'Works on assigned sprint tasks and updates their progress through the Sprint Board.',
  },
];


// =========================
// PRODUCT SCREENS
// =========================

export const SCREENSHOTS: Screenshot[] = [
  {
    title: 'Product Backlog',
    description:
      'Manage epics and user stories and prepare the backlog for upcoming sprints.',
  },

  {
    title: 'Sprint Planning',
    description:
      'Select stories, create the sprint, define the sprint goal and break stories into tasks.',
  },

  {
    title: 'Sprint Board',
    description:
      'Developers update their tasks as work moves through To Do, In Progress, Review and Done.',
  },
];


// =========================
// FAQ
// =========================

export const FAQS: Faq[] = [
  {
    question: 'What is Nexora?',
    answer:
      'Nexora is a Scrum-based project management system designed to help a software development organization manage projects, backlogs, sprints and development tasks in one place.',
  },

  {
    question: 'Which Scrum roles are supported?',
    answer:
      'Nexora supports four main roles: Organization Admin, Product Owner, Scrum Master and Developer.',
  },

  {
    question: 'Who creates the Product Backlog?',
    answer:
      'The Product Owner creates and manages the Product Backlog by organizing epics and user stories.',
  },

  {
    question: 'Who creates a Sprint?',
    answer:
      'The Scrum Master conducts sprint planning, selects stories from the Product Backlog and creates the Sprint.',
  },

  {
    question: 'Where are development tasks created?',
    answer:
      'Development tasks are created from selected user stories during Sprint Planning. These tasks belong to the Sprint rather than the Product Backlog.',
  },

  {
    question: 'Can developers update task status?',
    answer:
      'Yes. Developers can update the status of their assigned tasks through the Sprint Board.',
  },

  {
    question: 'What happens to completed work?',
    answer:
      'Completed tasks are reviewed and the Product Owner can monitor and accept completed work. Sprint progress is also reflected in reports.',
  },
];