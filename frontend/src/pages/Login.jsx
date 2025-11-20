import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Invalid credentials');
            }

            const data = await response.json();
            login(data.access_token);
            navigate('/dashboard');
        } catch (err) {
            console.error(err);
            setError('Login failed. Please check your username and password.');
        }
    };

    return (
        <div className="relative isolate flex min-h-[calc(100vh-5rem)] items-center justify-center px-4 py-16 text-white sm:px-6 lg:px-8">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(14,165,233,0.25),_transparent_55%)]" />
            <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_bottom,_rgba(139,92,246,0.25),_transparent_60%)]" />
            <div className="absolute inset-0 -z-10 opacity-20 bg-grid-slate" />

            <div className="grid w-full max-w-6xl gap-10 lg:grid-cols-2">
                <div className="hidden flex-col justify-center rounded-3xl border border-white/10 bg-white/10 p-10 text-left shadow-2xl shadow-indigo-950/40 backdrop-blur xl:flex">
                    <p className="text-xs font-semibold uppercase tracking-[0.4em] text-white/70">TrustLens Studio</p>
                    <h2 className="mt-4 text-4xl font-bold leading-tight text-white">Rejoin your intelligence cockpit</h2>
                    <p className="mt-5 text-sm text-white/70">
                        Continue where you left off. Track investigations, collaborate on annotations, and generate
                        cinematic reports in a click.
                    </p>

                    <div className="mt-10 space-y-4 text-sm text-white/80">
                        {[
                            'Secure SSO-ready authentication',
                            'Live dashboards with anomaly alerts',
                            'Team spaces with audit histories',
                        ].map((item) => (
                            <div key={item} className="flex items-center gap-3">
                                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel-strong rounded-3xl p-10">
                    <div className="text-center">
                        <span className="inline-flex items-center rounded-full border border-white/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.4em] text-white/60">
                            Welcome back
                        </span>
                        <h2 className="mt-5 text-3xl font-bold text-white">Sign in to TrustLens</h2>
                        <p className="mt-2 text-sm text-white/60">Access your saved analyses, dashboards, and alerts.</p>
                    </div>

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
                                    placeholder="journalist@trustlens"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
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
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
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
                            className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-3 text-base font-semibold"
                        >
                            Sign in
                        </button>
                    </form>

                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 text-left text-sm text-white/80">
                        <p className="font-semibold text-white">Need a quick demo?</p>
                        <p>Use <span className="font-mono text-white">demo / demo123</span> to sign in instantly.</p>
                    </div>

                    <div className="mt-6 text-center text-sm text-white/70">
                        Don&apos;t have an account?{' '}
                        <Link to="/register" className="font-semibold text-white">
                            Request access
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
