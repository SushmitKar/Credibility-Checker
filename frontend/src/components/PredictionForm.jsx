import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const PredictionForm = ({ type, endpoint }) => {
    const [text, setText] = useState('');
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { token } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!token) {
            setError('You need to be logged in to analyze content.');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`http://localhost:8000${endpoint}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ text }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.detail || 'Unable to analyze text');
            }

            const data = await response.json();
            setResult(data);
        } catch (err) {
            setResult(null);
            setError(err.message || 'Failed to analyze text. Please ensure the backend is running.');
        } finally {
            setLoading(false);
        }
    };

    const confidenceRaw = typeof result?.confidence === 'number' ? result.confidence : 0;
    const confidencePercent = Math.min(Math.max(confidenceRaw, 0), 1) * 100;

    return (
        <div className="rounded-3xl border border-white/10 bg-linear-to-b from-slate-900/60 to-slate-950/40 p-6 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between gap-3">
                <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">Detector</p>
                    <h3 className="text-2xl font-bold text-white">{type}</h3>
                </div>
                <div className="rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-emerald-200">
                    Live
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                <div>
                    <label htmlFor={`input-${type}`} className="text-sm font-semibold text-white/80">
                        Paste content
                    </label>
                    <div className="relative mt-3">
                        <textarea
                            id={`input-${type}`}
                            rows={7}
                            className="w-full rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white placeholder:text-white/40 focus:border-white/40 focus:outline-none"
                            placeholder={`Drop the ${type.toLowerCase()} text here and TrustLens will do the rest.`}
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            required
                        />
                        <span className="absolute bottom-4 right-4 text-xs text-white/40">{text.length} chars</span>
                    </div>
                </div>

                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-xs text-white/50">We never store your raw text. Analysis happens in-memory.</p>
                    <button
                        type="submit"
                        disabled={loading || !text.trim()}
                        className={`btn-primary flex items-center justify-center gap-2 rounded-2xl px-6 py-3 text-sm font-semibold ${loading || !text.trim() ? 'opacity-50' : ''
                            }`}
                    >
                        {loading ? (
                            <>
                                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                    <path className="opacity-75" d="M4 12a8 8 0 018-8" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
                                </svg>
                                Analyzing
                            </>
                        ) : (
                            <>
                                Run detector
                                <span aria-hidden>→</span>
                            </>
                        )}
                    </button>
                </div>
            </form>

            {error && (
                <div className="mt-6 rounded-2xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-100">
                    {error}
                </div>
            )}

            {result && (
                <div className="mt-8 space-y-6">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/60">Verdict</p>
                        <div className="mt-3 flex flex-wrap items-end gap-4">
                            <span
                                className={`text-4xl font-black ${result.label === 'True' || result.label === 'Real' ? 'text-emerald-300' : 'text-rose-300'
                                    }`}
                            >
                                {result.label}
                            </span>
                            <span className="text-sm text-white/60">Confidence {confidencePercent.toFixed(1)}%</span>
                        </div>
                        <div className="mt-3 h-2 rounded-full bg-white/10">
                            <div
                                className={`h-2 rounded-full ${result.label === 'True' || result.label === 'Real'
                                    ? 'bg-linear-to-r from-emerald-400 to-lime-300'
                                    : 'bg-linear-to-r from-rose-400 to-orange-300'
                                    }`}
                                style={{ width: `${confidencePercent}%` }}
                            />
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Confidence score</p>
                            <p className="mt-2 text-2xl font-bold text-white">{confidencePercent.toFixed(1)}%</p>
                            <p className="text-xs text-white/40">Composite of stance analysis + provenance check</p>
                        </div>
                        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/60">Recommended next step</p>
                            <p className="mt-2 text-sm text-white/80">
                                {result.label === 'True' || result.label === 'Real'
                                    ? 'Archive as trusted source and notify stakeholders.'
                                    : 'Escalate to manual review and cross-check citations.'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PredictionForm;
