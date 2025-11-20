import React from 'react';
import { Link } from 'react-router-dom';

const featureCards = [
    {
        title: 'Fake News Radar',
        description: 'Cross-check narratives with trusted sources and linguistic cues.',
        icon: '🛰️',
        accent: 'from-violet-500/20 to-indigo-500/10',
    },
    {
        title: 'Review Pulse',
        description: 'Flag synthetic review clusters before they harm your brand.',
        icon: '💬',
        accent: 'from-emerald-500/10 to-teal-500/5',
    },
    {
        title: 'Job Shield',
        description: 'Expose fraudulent openings with recruiter history & tone analysis.',
        icon: '🛡️',
        accent: 'from-amber-500/10 to-orange-500/5',
    },
];

const workflowSteps = [
    'Paste any headline, review, or job listing directly into TrustLens.',
    'Our multi-model AI stack validates context, tone, source history, and novelty.',
    'Receive a confidence score, risk notes, and recommended next actions.',
];



const demoSignalStats = [
    {
        label: 'Confidence',
        value: '91%',
        detail: 'Derived from stance agreement across 4 sources',
        barColor: 'from-emerald-400 to-lime-300',
    },
    {
        label: 'Anomaly index',
        value: '22%',
        detail: 'Tone drift detected after audience amplification',
        barColor: 'from-amber-300 to-rose-300',
    },
];

const LandingPage = () => {
    return (
        <div className="relative isolate overflow-hidden text-white">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(76,0,255,0.18),_transparent_45%)]" />
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom,_rgba(14,165,233,0.12),_transparent_50%)]" />
            <div className="absolute inset-0 -z-10 opacity-30 bg-grid-slate" />

            <div className="mx-auto flex w-full max-w-6xl flex-col gap-20 px-4 pb-24 pt-16 sm:px-6 lg:px-8">
                <section className="pt-16 text-center">
                    <div className="mx-auto mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-slate-900/40 px-4 py-1 text-xs font-semibold uppercase tracking-[0.4em] text-slate-200/80">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        AI credibility cloud
                    </div>

                    <h1 className="text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
                        See truth from every angle with{' '}
                        <span className="bg-gradient-to-r from-indigo-200 via-violet-200 to-rose-200 bg-clip-text text-transparent">
                            TrustLens
                        </span>
                    </h1>
                    <p className="mx-auto mt-6 max-w-3xl text-lg text-slate-200/80 sm:text-xl">
                        Blend linguistic forensics, network telemetry, and reputation data in one stunning workspace.
                        Equip every researcher, journalist, and recruiter with instant credibility superpowers.
                    </p>

                    <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                        <Link to="/register" className="btn-primary text-base px-8 py-3">
                            Launch the studio
                        </Link>
                        <Link
                            to="/dashboard"
                            className="text-sm font-semibold text-slate-200/80 transition hover:text-white"
                        >
                            Explore dashboard →
                        </Link>
                    </div>

                    <div className="mt-12 grid grid-cols-1 gap-6 text-left sm:grid-cols-2 lg:grid-cols-3">
                        {featureCards.map((card) => (
                            <div
                                key={card.title}
                                className={`rounded-2xl border border-white/10 bg-gradient-to-br ${card.accent} p-6 shadow-xl shadow-black/30 backdrop-blur`}
                            >
                                <div className="text-4xl">{card.icon}</div>
                                <h3 className="mt-4 text-xl font-semibold text-white">{card.title}</h3>
                                <p className="mt-2 text-sm text-slate-200/80">{card.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]" id="features">
                    <div className="space-y-6 rounded-3xl border border-white/10 bg-slate-900/40 p-8 shadow-2xl shadow-indigo-950/40 backdrop-blur">
                        <p className="text-sm font-semibold uppercase tracking-[0.4em] text-slate-200/70">
                            Live signal board
                        </p>
                        <div className="flex items-center justify-between gap-3">
                            <h2 className="text-3xl font-bold text-white">Sample orchestration preview</h2>
                            <span className="rounded-full border border-white/20 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.35em] text-white/70">
                                Demo data
                            </span>
                        </div>
                        <p className="text-base text-slate-300/80">
                            These metrics use placeholder numbers so you can demo Milestone 1 immediately. Wire them to
                            production telemetry whenever the backend endpoints are live.
                        </p>
                        <div className="grid gap-5 sm:grid-cols-2">
                            {demoSignalStats.map((stat) => (
                                <div key={stat.label} className="rounded-2xl border border-white/10 bg-black/20 p-5">
                                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                                    <p className="mt-2 text-4xl font-black text-white">{stat.value}</p>
                                    <div className="mt-3 h-2 rounded-full bg-white/10">
                                        <div className={`h-2 rounded-full bg-gradient-to-r ${stat.barColor}`} style={{ width: stat.label === 'Confidence' ? '91%' : '22%' }} />
                                    </div>
                                    <p className="mt-3 text-xs text-slate-400">{stat.detail}</p>
                                </div>
                            ))}
                        </div>
                        <p className="text-[11px] uppercase tracking-[0.4em] text-slate-400">Swap with live numbers once ready</p>
                    </div>

                    <div className="relative rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/10 via-slate-900/60 to-slate-900/90 p-8 shadow-2xl shadow-indigo-900/60">
                        <div className="absolute inset-x-12 -top-10 h-20 rounded-3xl bg-white/10 blur-3xl" />
                        <div className="relative space-y-5 text-sm text-slate-100/80">
                            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-300/70">Spotlight</p>
                            <h3 className="text-2xl font-semibold text-white">What should appear here?</h3>
                            <p>
                                For the milestone demo we keep a short checklist so stakeholders know this is a placeholder.
                                Later, replace it with a real feed, onboarding steps, or change-log.
                            </p>
                            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/60">Demo checklist</p>
                                <p className="mt-2 text-sm text-white/80">• Mention sample numbers<br />• Highlight future API hookups<br />• Capture stakeholder questions</p>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="workflow" className="grid gap-10 rounded-3xl border border-white/5 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-900/70">Workflow</p>
                            <h2 className="mt-2 text-3xl font-bold text-slate-900">Three elegant steps to certainty</h2>
                        </div>
                        <Link to="/register" className="rounded-full border border-slate-900/20 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-slate-900 hover:text-white">
                            Start verifying
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {workflowSteps.map((step, index) => (
                            <div key={step} className="rounded-2xl border border-slate-900/10 bg-white/70 p-6 text-slate-900 shadow-lg shadow-slate-900/5">
                                <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">Step {index + 1}</span>
                                <p className="mt-3 text-base font-semibold text-slate-900">{step}</p>
                            </div>
                        ))}
                    </div>
                </section>



                <section className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-600 to-rose-500 p-8 text-center shadow-2xl shadow-rose-900/40">
                    <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/70">Ready to explore?</p>
                    <h2 className="mt-4 text-3xl font-black text-white">
                        Launch TrustLens Studio and fall in love with verification
                    </h2>
                    <p className="mt-3 text-slate-100/80">
                        The dashboard, predictions, and reports you need—wrapped in a cinematic UI.
                    </p>
                    <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
                        <Link to="/register" className="rounded-full bg-white px-8 py-3 text-sm font-semibold text-slate-900 shadow-lg shadow-rose-950/30 transition hover:-translate-y-0.5">
                            Create my workspace
                        </Link>
                        <Link to="/login" className="text-sm font-semibold text-white/90">
                            I already have an account
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default LandingPage;
