import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, LogIn, Lock } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export const AdminAccessDeniedPage: React.FC = () => {
  const { adminUser, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleSwitchAccount = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-brand-dark flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-grid-dark opacity-20 pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-red-500/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-brand-accent/10 blur-3xl pointer-events-none" />

      <div className="max-w-md w-full relative z-10 text-center">
        {/* Warning Icon Badge */}
        <div className="w-20 h-20 mx-auto rounded-3xl bg-red-500/10 border border-red-500/30 flex items-center justify-center mb-6 shadow-2xl shadow-red-500/20">
          <ShieldAlert className="w-10 h-10 text-red-400" />
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 border border-red-500/30 text-red-300 text-xs font-mono font-bold tracking-widest uppercase mb-3">
          <Lock className="w-3.5 h-3.5" />
          <span>Error 403 • Access Forbidden</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-black text-white uppercase tracking-wider mb-3">
          Administrative Privileges Required
        </h1>

        <p className="text-sm text-steel-300 leading-relaxed mb-6 font-medium">
          The requested management console is strictly restricted to authorized factory personnel and system administrators of GE Industries.
        </p>

        {adminUser && (
          <div className="p-4 bg-brand-navy/80 rounded-2xl border border-steel-700/60 mb-6 text-left text-xs font-mono">
            <p className="text-steel-400">Current Session Details:</p>
            <p className="text-white font-bold mt-1">User: {adminUser.email}</p>
            <p className="text-amber-400 mt-0.5">Role: {adminUser.role || 'Unassigned / Non-Admin'}</p>
            <p className="text-red-400 mt-2 text-[11px]">
              This account does not have sufficient clearance to access this control tier.
            </p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={handleSwitchAccount}
            className="w-full py-3.5 px-6 bg-brand-accent hover:bg-blue-500 text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-brand-accent/25 flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In with Authorized Administrator Account</span>
          </button>

          <Link
            to="/"
            className="w-full py-3.5 px-6 bg-white/5 hover:bg-white/10 text-steel-200 hover:text-white font-bold rounded-xl text-xs uppercase tracking-wider transition-all border border-white/10 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to GE Industries Storefront</span>
          </Link>
        </div>

        <div className="mt-8 pt-6 border-t border-steel-800 text-center">
          <p className="text-[11px] text-steel-500 font-mono">
            Security audit logged. Unauthorized intrusion attempts are monitored.
          </p>
          <p className="text-[10px] text-steel-600 mt-1 font-mono">
            GE Industries • Karuppampalayam, Karur – 639003
          </p>
        </div>
      </div>
    </div>
  );
};
