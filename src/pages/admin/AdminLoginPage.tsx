import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Shield, Lock, Mail, AlertCircle, Info, KeyRound } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminLoginPage: React.FC = () => {
  const { login, isAuthenticated } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Default credentials for convenience in testing / demo
  const defaultEmail = import.meta.env.VITE_ADMIN_DEFAULT_EMAIL || 'admin@geindustries.com';
  const defaultPassword = import.meta.env.VITE_ADMIN_DEFAULT_PASSWORD || 'geindustries2026';

  const from = (location.state as any)?.from?.pathname || '/admin';

  if (isAuthenticated) {
    navigate(from, { replace: true });
    return null;
  }

  const handleFillDemoCredentials = () => {
    setEmail(defaultEmail);
    setPassword(defaultPassword);
    setErrorMsg('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const result = await login(email, password);
    setIsLoading(false);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setErrorMsg(result.error || 'Authentication failed. Please verify credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background accents */}
      <div className="absolute inset-0 bg-grid-dark opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-brand-accent/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-royal/20 blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10 px-4">
        {/* Logo and Brand */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center gap-2.5 justify-center mb-4 group">
            <img
              src="/brand/logo.png"
              alt="GE Industries"
              className="h-12 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-accent text-[11px] font-mono uppercase tracking-widest mb-2">
            <Lock className="w-3 h-3" />
            <span>Authorized Personnel Only</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wider">
            Factory Control Portal
          </h2>
          <p className="mt-1 text-xs text-steel-400 font-mono">
            GE Industries • Karur, Tamil Nadu
          </p>
        </div>

        {/* Login Box */}
        <div className="mt-8 bg-brand-navy/90 backdrop-blur-md py-8 px-6 sm:px-10 shadow-2xl rounded-3xl border border-brand-royal/40">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-300 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">{errorMsg}</div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-steel-200 mb-1 uppercase tracking-wider">
                Administrator Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-steel-300 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="admin@geindustries.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-dark/80 text-white text-sm rounded-xl border border-steel-700 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent font-medium placeholder-steel-400"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-steel-200 mb-1 uppercase tracking-wider">
                Security Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-steel-300 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-brand-dark/80 text-white text-sm rounded-xl border border-steel-700 focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent font-medium placeholder-steel-400"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3.5 px-4 bg-brand-accent hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-accent/25 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Shield className="w-4 h-4" />
                <span>{isLoading ? 'Verifying Clearance...' : 'Authenticate & Access Panel'}</span>
              </button>
            </div>
          </form>

          {/* Security policy notice */}
          <div className="mt-5 p-3.5 rounded-xl bg-white/[0.08] border border-white/15 text-xs text-slate-200 leading-relaxed shadow-sm">
            <span className="text-white font-bold block mb-1 text-xs tracking-wide">Strict Access Policy</span>
            <p className="text-slate-200 leading-relaxed text-[12px]">
              Public registration is permanently disabled. Administrator credentials are provisioned exclusively via secure factory environment keys or verified database policy.
            </p>
          </div>

          {/* Quick Demo Credentials Autofill Helper */}
          <div className="mt-5 pt-4 border-t border-brand-royal/30 text-center">
            <button
              type="button"
              onClick={handleFillDemoCredentials}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-brand-accent rounded-lg text-xs font-semibold transition-colors border border-white/10"
            >
              <KeyRound className="w-3.5 h-3.5" />
              <span>Fill Verified Demo Credentials</span>
            </button>
            <p className="text-xs text-steel-300 mt-2 font-mono">
              Role: <span className="text-emerald-400 font-bold">superadmin</span> • User: <span className="text-white font-medium">{defaultEmail}</span>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center">
          <Link
            to="/"
            className="text-xs text-steel-300 hover:text-white transition-colors inline-flex items-center gap-1.5"
          >
            ← Return to GE Industries Storefront
          </Link>
        </div>
      </div>
    </div>
  );
};
