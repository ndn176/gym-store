import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, CheckSquare, Square, Loader2 } from 'lucide-react';

interface AuthViewProps {
  onLogin: (email: string, password: string) => Promise<boolean>;
  onRegister: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  onSuccess: () => void;
  setView: (view: string) => void;
  authMode: 'login' | 'register';
  setAuthMode: (mode: 'login' | 'register') => void;
  serverError?: string | null;
}

export default function AuthView({
  onLogin,
  onRegister,
  onSuccess,
  setView,
  authMode,
  setAuthMode,
  serverError,
}: AuthViewProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (authMode === 'login') {
      if (!email || !password) {
        setError('PLEASE ENTER ALL REQUIRED CREDENTIALS.');
        return;
      }
      setSubmitting(true);
      const ok = await onLogin(email, password);
      setSubmitting(false);
      if (ok) onSuccess();
    } else {
      if (!fullName || !email || !password) {
        setError('PLEASE COMPLETE ALL REQUIRED REGISTRATION FIELDS.');
        return;
      }
      if (!agreeTerms) {
        setError('YOU MUST AGREE TO THE TERMS AND PRIVACY CHARTER.');
        return;
      }
      setSubmitting(true);
      const ok = await onRegister(fullName, email, phone, password);
      setSubmitting(false);
      if (ok) onSuccess();
    }
  };

  const displayError = error || serverError;

  return (
    <div className="bg-black text-white min-h-screen font-sans flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md border border-zinc-900 bg-zinc-950 p-8 rounded-lg shadow-2xl space-y-8">

        {/* Toggle Headings */}
        <div className="text-center space-y-2">
          <span className="font-mono text-xs tracking-[0.4em] text-zinc-500 uppercase">
            {authMode === 'login' ? 'WELCOME BACK' : 'JOIN THE CADRE'}
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            {authMode === 'login' ? 'MEMBER SIGN IN' : 'CREATE ACCOUNT'}
          </h1>
        </div>

        {displayError && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 text-red-500 text-xs font-mono text-center uppercase tracking-wide rounded">
            {displayError}
          </div>
        )}

        {/* Auth form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {authMode === 'register' && (
            <>
              <div>
                <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
                  FULL NAME *
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="ATHLETE NAME"
                    className="w-full bg-black border border-zinc-850 px-10 h-11 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white rounded uppercase"
                  />
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-700" />
                </div>
              </div>
              <div>
                <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
                  PHONE
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+84 ..."
                  className="w-full bg-black border border-zinc-850 px-4 h-11 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white rounded"
                />
              </div>
            </>
          )}

          <div>
            <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
              EMAIL ADDRESS *
            </label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-black border border-zinc-850 px-10 h-11 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white rounded"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-700" />
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
                PASSWORD *
              </label>
              {authMode === 'login' && (
                <button
                  type="button"
                  onClick={() => setView('forgot-password')}
                  className="font-mono text-[9px] tracking-widest text-zinc-500 hover:text-white uppercase cursor-pointer"
                >
                  FORGOT PASSWORD?
                </button>
              )}
            </div>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-black border border-zinc-850 px-10 h-11 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white rounded"
              />
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-700" />
            </div>
          </div>

          {authMode === 'register' && (
            <div
              onClick={() => setAgreeTerms(!agreeTerms)}
              className="flex items-start space-x-3 text-xs text-zinc-500 hover:text-zinc-400 cursor-pointer select-none py-1"
            >
              <button type="button" className="shrink-0 mt-0.5">
                {agreeTerms ? (
                  <CheckSquare className="h-4.5 w-4.5 text-white" />
                ) : (
                  <Square className="h-4.5 w-4.5 text-zinc-700" />
                )}
              </button>
              <span className="font-mono text-[10px] leading-relaxed uppercase tracking-wide">
                I agree to the Terms of Service & Privacy Policy.
              </span>
            </div>
          )}

          {/* Submit Action */}
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-xs font-bold tracking-[0.2em] uppercase rounded flex items-center justify-center space-x-2 cursor-pointer mt-4 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <span>{authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Demo credentials hint */}
        {authMode === 'login' && (
          <p className="text-center font-mono text-[9px] tracking-widest text-zinc-600 uppercase">
            Demo: john.doe@ironandaesthetic.com / password123
          </p>
        )}

        {/* Toggle Mode footer */}
        <div className="border-t border-zinc-900 pt-6 text-center">
          <button
            onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
            className="font-mono text-[10px] tracking-widest text-zinc-500 hover:text-white uppercase cursor-pointer"
          >
            {authMode === 'login'
              ? "DON'T HAVE AN ACCOUNT? REGISTER HERE"
              : 'ALREADY AN ACTIVE MEMBER? SIGN IN'}
          </button>
        </div>

      </div>
    </div>
  );
}
