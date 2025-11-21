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



                <section id="workflow" className="grid gap-10 rounded-3xl border border-white/5 bg-white/5 p-8 shadow-2xl shadow-black/30 backdrop-blur">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-200/70">Workflow</p>
                            <h2 className="mt-2 text-3xl font-bold text-white">Three elegant steps to certainty</h2>
                        </div>
                        <Link to="/register" className="rounded-full border border-white/20 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white hover:text-slate-900">
                            Start verifying
                        </Link>
                    </div>

                    <div className="grid gap-6 md:grid-cols-3">
                        {workflowSteps.map((step, index) => (
                            <div key={step} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white shadow-lg shadow-black/30">
                                <span className="text-sm font-semibold uppercase tracking-widest text-slate-400">Step {index + 1}</span>
                                <p className="mt-3 text-base font-semibold text-slate-200">{step}</p>
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
