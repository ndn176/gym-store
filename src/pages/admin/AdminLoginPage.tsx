import React, { useState } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import { useAdminAuth } from '../../context/AdminAuthContext';

export default function AdminLoginPage() {
  const { login, isAuthenticated, loading, error } = useAdminAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState('');

  // Already logged in as admin -> skip straight past the login screen
  if (!loading && isAuthenticated) {
    const from = (location.state as { from?: string } | null)?.from || '/admin/dashboard';
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError('');
    if (!email || !password) {
      setLocalError('VUI LÒNG NHẬP ĐẦY ĐỦ EMAIL VÀ MẬT KHẨU.');
      return;
    }
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) navigate('/admin/dashboard', { replace: true });
  };

  const displayError = localError || error;

  return (
    <div className="min-h-screen bg-zinc-950 text-white font-sans flex items-center justify-center px-4">
      <div className="w-full max-w-sm border border-zinc-800 bg-black p-8 rounded-lg shadow-2xl space-y-7">
        <div className="text-center space-y-3">
          <div className="mx-auto w-11 h-11 rounded-full bg-white/5 border border-zinc-800 flex items-center justify-center">
            <ShieldCheck className="h-5 w-5 text-zinc-300" />
          </div>
          <div>
            <span className="font-mono text-[10px] tracking-[0.4em] text-zinc-500 uppercase block mb-1">
              STAFF ONLY
            </span>
            <h1 className="text-2xl font-black tracking-tight uppercase">Admin Portal</h1>
          </div>
        </div>

        {displayError && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 text-red-400 text-xs font-mono text-center uppercase tracking-wide rounded">
            {displayError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@ironandaesthetic.com"
                className="w-full bg-zinc-950 border border-zinc-800 px-10 h-11 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white rounded"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-700" />
            </div>
          </div>

          <div>
            <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
              Mật khẩu
            </label>
            <div className="relative">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-950 border border-zinc-800 px-10 h-11 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white rounded"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-700" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-xs font-bold tracking-[0.2em] uppercase rounded flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>Đăng nhập</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        <p className="text-center font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
          Demo: admin@ironandaesthetic.com / admin123
        </p>
      </div>
    </div>
  );
}
