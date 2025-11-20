import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        try {
            setLoading(true);
            const response = await fetch('http://localhost:8000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                throw new Error(data.detail || 'Registration failed');
            }

            const data = await response.json();
            login(data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-16 text-white sm:px-6 lg:px-8">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(236,72,153,0.25),_transparent_45%)]" />
            <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_bottom,_rgba(59,130,246,0.25),_transparent_60%)]" />
            <div className="absolute inset-0 -z-10 opacity-30 bg-grid-slate" />

            <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-2">
                <div className="glass-panel-strong rounded-3xl p-10">
                    <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.4em] text-white/60">
                        Create workspace
                    </span>
                    <h2 className="mt-5 text-3xl font-bold text-white">Request access to TrustLens</h2>
                    <p className="mt-3 text-sm text-white/70">
                        Secure your studio with role-based permissions and collaborative annotations out of the box.
                    </p>

                    <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-white/80" htmlFor="username">
                                Username
                            </label>
                            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 focus-within:border-white/40">
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none"
                                    placeholder="trust.admin"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-white/80" htmlFor="email">
                                Email
                            </label>
                            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 focus-within:border-white/40">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none"
                                    placeholder="team@trustlens.ai"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-white/80" htmlFor="password">
                                Password
                            </label>
                            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 focus-within:border-white/40">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none"
                                    placeholder="Create a strong password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <label className="text-sm font-semibold text-white/80" htmlFor="confirm-password">
                                Confirm password
                            </label>
                            <div className="rounded-2xl border border-white/15 bg-white/5 p-4 focus-within:border-white/40">
                                <input
                                    id="confirm-password"
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    className="w-full bg-transparent text-base text-white placeholder:text-white/40 focus:outline-none"
                                    placeholder="Re-enter your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                />
                            </div>
                        </div>

                        {error && (
                            <div className="rounded-2xl border border-red-400/30 bg-red-400/10 p-3 text-center text-sm text-red-200">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-base font-semibold ${loading ? 'opacity-60' : ''}`}
                        >
                            {loading ? 'Creating...' : 'Create account'}
                        </button>
                    </form>

                    <div className="mt-6 text-center text-sm text-white/70">
                        Already a member?{' '}
                        <Link to="/login" className="font-semibold text-white">
                            Sign in
                        </Link>
                    </div>
                </div>

                <div className="hidden flex-col justify-center rounded-3xl border border-white/10 bg-white/5 p-10 text-slate-900 shadow-2xl shadow-indigo-950/30 backdrop-blur lg:flex">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-slate-700">What you get</p>
                    <h3 className="mt-3 text-3xl font-bold text-slate-900">A cinematic studio for trust & safety teams</h3>
                    <p className="mt-4 text-sm text-slate-600">
                        Onboard in minutes, invite teammates, and watch suspicious narratives get illuminated in real-time.
                    </p>

                    <div className="mt-10 grid gap-5 text-sm">
                        {[
                            'Unlimited detectors across news, reviews, and talent',
                            'Saved investigations with collaborative notes',
                            'Export-ready briefings & API hooks',
                        ].map((perk) => (
                            <div key={perk} className="rounded-2xl border border-slate-200 bg-white/80 p-4 shadow">
                                <p className="font-semibold text-slate-900">{perk}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
