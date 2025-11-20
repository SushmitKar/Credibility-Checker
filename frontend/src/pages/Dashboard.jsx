import React, { useState } from 'react';
import PredictionForm from '../components/PredictionForm';



const Dashboard = () => {
    const [activeTab, setActiveTab] = useState('news');

    const tabs = [
        { id: 'news', name: 'Fake News', icon: '🛰️', endpoint: '/predict/news' },
        { id: 'review', name: 'Fake Reviews', icon: '💬', endpoint: '/predict/review' },
        { id: 'job', name: 'Fake Jobs', icon: '💼', endpoint: '/predict/job' },
    ];

    return (
        <div className="relative isolate px-4 pt-4 pb-16 text-white sm:px-6 lg:px-8">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(79,70,229,0.2),_transparent_50%)]" />
            <div className="absolute inset-0 -z-10 opacity-20 bg-grid-slate" />

            <div className="mx-auto max-w-6xl space-y-10">
                <header className="rounded-3xl border border-white/10 bg-gradient-to-r from-indigo-700/40 to-violet-600/30 p-8 shadow-2xl shadow-indigo-900/40">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">TrustLens Studio</p>
                            <h1 className="mt-3 text-3xl font-bold text-white">Credibility control room</h1>
                            <p className="mt-2 max-w-3xl text-sm text-white/80">
                                Monitor every narrative stream from a single cinematic dashboard. Switch detectors,
                                compare scores, and spin up briefings at the speed of thought.
                            </p>
                        </div>
                        <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold">
                            Secured workspace
                        </div>
                    </div>
                </header>



                <section className="grid gap-6">
                    <div className="space-y-6 rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-black/30">
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">Detectors</p>
                                <h2 className="text-2xl font-semibold">Choose a lens</h2>
                            </div>
                            <div className="rounded-2xl border border-white/10 bg-white/10 p-1 text-sm font-medium">
                                <div className="flex gap-1">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-4 py-2 transition ${activeTab === tab.id ? 'bg-white text-slate-900' : 'text-white/70'
                                                }`}
                                        >
                                            <span>{tab.icon}</span>
                                            {tab.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {tabs.map(
                            (tab) =>
                                activeTab === tab.id && (
                                    <PredictionForm key={tab.id} type={tab.name} endpoint={tab.endpoint} />
                                ),
                        )}
                    </div>


                </section>
            </div>
        </div>
    );
};

export default Dashboard;
