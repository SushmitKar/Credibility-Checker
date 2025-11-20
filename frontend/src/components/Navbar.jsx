import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const navigation = [
        { label: 'Product', to: '/', hash: '#features' },
        { label: 'How it works', to: '/', hash: '#workflow' },
        { label: 'Dashboard', to: '/dashboard' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const renderLink = (item) => {
        if (item.hash) {
            return (
                <a
                    key={item.label}
                    href={item.hash}
                    className="text-sm font-medium text-slate-200/80 transition hover:text-white"
                >
                    {item.label}
                </a>
            );
        }

        return (
            <Link
                key={item.label}
                to={item.to}
                className="text-sm font-medium text-slate-200/80 transition hover:text-white"
            >
                {item.label}
            </Link>
        );
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-4">
            <div className="mx-auto max-w-7xl">
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/70 px-5 py-3 shadow-2xl shadow-indigo-950/20 backdrop-blur-2xl">
                    <Link to="/" className="flex items-center gap-3">
                        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-500 text-lg font-black text-white shadow-lg shadow-indigo-900/40">
                            TL
                            <span className="absolute -right-1 -top-1 rounded-full bg-emerald-400/90 px-1.5 text-[10px] font-semibold uppercase tracking-tight text-slate-900">
                                Beta
                            </span>
                        </div>
                        <div className="text-left">
                            <p className="text-base font-semibold text-white">TrustLens</p>
                            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">AI Credibility Lab</p>
                        </div>
                    </Link>

                    <div className="hidden items-center gap-6 md:flex">
                        {navigation.map(renderLink)}
                    </div>

                    <div className="flex items-center gap-3">
                        {user ? (
                            <>
                                <div className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-emerald-200/80 sm:flex">
                                    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
                                    Live
                                </div>
                                <span className="hidden text-sm font-medium text-slate-200 sm:inline-flex">
                                    {user.username}
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="rounded-xl border border-white/20 px-4 py-2 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login"
                                    className="hidden text-sm font-medium text-slate-200 transition hover:text-white sm:inline-flex"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="btn-primary hidden text-sm sm:inline-flex"
                                >
                                    Try for free
                                </Link>
                                <button
                                    className="inline-flex rounded-xl border border-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-white/70 transition hover:text-white sm:hidden"
                                    onClick={() => (user ? navigate('/dashboard') : navigate('/login'))}
                                >
                                    Menu
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
