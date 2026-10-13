import { motion } from 'framer-motion';
import { Bell, CheckCircle2, TrendingUp } from 'lucide-react';
// import { Container } from '@/components/layout/Container';
import { LandingButton } from './LandingButton';
import { Container } from '../common/Container';

const columns = [
    {
        title: 'To Do',
        color: 'bg-slate-400',
        tasks: ['Create Login UI', 'Create Login API'],
    },
    {
        title: 'In Progress',
        color: 'bg-primary',
        tasks: ['JWT Authentication'],
    },
    {
        title: 'Review',
        color: 'bg-amber-500',
        tasks: ['OTP Verification'],
    },
    {
        title: 'Done',
        color: 'bg-emerald-500',
        tasks: ['Project Setup'],
    },
];

const avatars = [
    { initials: 'SC', color: 'bg-primary' },
    { initials: 'MR', color: 'bg-accent' },
    { initials: 'AK', color: 'bg-emerald-500' },
];

export function Hero() {
    return (
        <section className="relative overflow-hidden pt-28 pb-20 lg:pt-36">
            {/* soft background glows */}
            <div className="pointer-events-none absolute inset-0 -z-10">
                <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute top-40 -left-24 h-96 w-96 rounded-full bg-accent/10 blur-3xl" />
            </div>

            <Container className="grid items-center gap-16 lg:grid-cols-2">
                <motion.div
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                    <span className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-sm font-medium text-primary">
                        🚀 The modern way to ship software
                    </span>
                    <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                        Scrum Project Management
                        <br />
                        <span className="bg-gradient-to-r from-indigo-600 via-purple-500 to-indigo-400 bg-clip-text text-transparent">
                            Built for Software Teams
                        </span>
                    </h1>

                    <p className="mt-6 max-w-xl text-lg leading-relaxed text-slate-600">
                        Plan your product backlog, organize sprints, assign development tasks,
                        track progress and deliver software through a clear Scrum workflow.
                    </p>
                    <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                        <LandingButton to="/login" variant="primary">
                            Get Started
                        </LandingButton>

                        <LandingButton href="#how-it-works" variant="outline">
                            Explore Workflow
                        </LandingButton>
                    </div>
                    {/* <div className="mt-8 flex items-center gap-6 text-sm text-slate-500">
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> Free 14-day trial
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" /> No credit card
            </span>
          </div> */}
                </motion.div>

                {/* Dashboard illustration */}
                <motion.div
                    className="relative"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, ease: 'easeOut', delay: 0.15 }}
                >
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl shadow-slate-300/40">
                        {/* window bar */}
                        <div className="mb-4 flex items-center gap-2">
                            <span className="h-3 w-3 rounded-full bg-red-400" />
                            <span className="h-3 w-3 rounded-full bg-amber-400" />
                            <span className="h-3 w-3 rounded-full bg-emerald-400" />
                            <div className="ml-3 flex-1">
                                <div className="h-6 w-40 rounded-md bg-slate-100" />
                            </div>
                            <div className="flex -space-x-2">
                                {avatars.map((a) => (
                                    <span
                                        key={a.initials}
                                        className={`flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[10px] font-bold text-white ${a.color}`}
                                    >
                                        {a.initials}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* sprint progress */}
                        <div className="mb-4 rounded-xl bg-surface p-3">
                            <div className="mb-2 flex items-center justify-between text-xs font-medium text-slate-500">
                                <span>Sprint 24 · Progress</span>
                                <span className="text-primary">68%</span>
                            </div>
                            <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200">
                                <div className="h-full w-[68%] rounded-full bg-gradient-to-r from-primary to-accent" />
                            </div>
                        </div>

                        {/* kanban */}
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">                            {columns.map((col) => (
                            <div key={col.title} className="rounded-xl bg-surface p-2.5">
                                <div className="mb-2 flex items-center gap-1.5 text-[11px] font-semibold text-slate-600">
                                    <span className={`h-2 w-2 rounded-full ${col.color}`} />
                                    {col.title}
                                </div>
                                <div className="space-y-2">
                                    {col.tasks.map((task) => (
                                        <div key={task} className="rounded-lg border border-slate-100 bg-white p-2 shadow-sm">
                                            <div className="text-[11px] font-medium text-slate-700">{task}</div>
                                            <div className="mt-1.5 h-1.5 w-2/3 rounded-full bg-slate-100" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* floating analytics card */}
                    <motion.div
                        className="absolute -left-6 -bottom-6 hidden rounded-xl border border-slate-200 bg-white p-4 shadow-xl sm:block"
                        animate={{ y: [0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <div className="flex items-center gap-3">
                            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                                <TrendingUp className="h-5 w-5" />
                            </span>
                            <div>
                                <div className="text-xs text-slate-500">Velocity</div>
                                <div className="text-sm font-bold text-slate-900">+24% this sprint</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* floating notification card */}
                    <motion.div
                        className="absolute -right-4 top-10 hidden rounded-xl border border-slate-200 bg-white p-3 shadow-xl sm:flex sm:items-center sm:gap-2"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
                            <Bell className="h-4 w-4" />
                        </span>
                        <span className="text-xs font-medium text-slate-700">Task assigned to you</span>
                    </motion.div>
                </motion.div>
            </Container>
        </section>
    );
}
