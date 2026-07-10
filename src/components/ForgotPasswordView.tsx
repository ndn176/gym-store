import React, { useState } from 'react';
import { Mail, Key, CheckCircle, ArrowLeft, ArrowRight, Lock, Loader2 } from 'lucide-react';
import { authApi } from '../api/auth';
import { ApiError } from '../api/client';

interface ForgotPasswordViewProps {
  setView: (view: string) => void;
  setAuthMode: (mode: 'login' | 'register') => void;
}

export default function ForgotPasswordView({ setView, setAuthMode }: ForgotPasswordViewProps) {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('VUI LÒNG NHẬP EMAIL ĐÃ ĐĂNG KÝ.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await authApi.forgotPassword(email);
      setStep(2);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'KHÔNG GỬI ĐƯỢC MÃ XÁC MINH.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length < 6) {
      setError('VUI LÒNG NHẬP ĐỦ MÃ XÁC MINH 6 SỐ.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await authApi.verifyResetCode(email, code);
      setStep(3);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'MÃ XÁC MINH KHÔNG ĐÚNG.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStep3 = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError('VUI LÒNG NHẬP ĐẦY ĐỦ MẬT KHẨU.');
      return;
    }
    if (password !== confirmPassword) {
      setError('MẬT KHẨU XÁC NHẬN KHÔNG KHỚP.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await authApi.resetPassword(email, code, password);
      setStep(4);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'KHÔNG ĐẶT LẠI ĐƯỢC MẬT KHẨU.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReturnToLogin = () => {
    setAuthMode('login');
    setView('auth');
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-md border border-zinc-900 bg-zinc-950 p-8 rounded-lg shadow-2xl space-y-8">

        <div className="text-center space-y-2">
          <span className="font-mono text-xs tracking-[0.4em] text-zinc-500 uppercase">
            SECURE GATEWAY
          </span>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            {step === 4 ? 'SUCCESS' : 'PASSWORD RECOVERY'}
          </h1>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 text-red-500 text-xs font-mono text-center uppercase tracking-wide rounded">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleStep1} className="space-y-6">
            <p className="text-zinc-500 text-xs tracking-wide leading-relaxed uppercase font-mono text-center">
              NHẬP EMAIL TÀI KHOẢN ĐỂ NHẬN MÃ XÁC MINH ĐẶT LẠI MẬT KHẨU.
            </p>
            <div>
              <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
                EMAIL ĐÃ ĐĂNG KÝ
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

            <div className="space-y-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-xs font-bold tracking-[0.2em] uppercase rounded flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>
                    <span>GỬI MÃ XÁC MINH</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReturnToLogin}
                className="w-full py-3.5 bg-transparent border border-zinc-900 text-zinc-500 hover:text-white transition-colors font-mono text-xs font-bold tracking-[0.2em] uppercase rounded flex items-center justify-center space-x-2 cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>QUAY LẠI ĐĂNG NHẬP</span>
              </button>
            </div>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleStep2} className="space-y-6">
            <div className="text-center space-y-2">
              <p className="text-zinc-400 text-xs tracking-wide leading-relaxed uppercase font-mono">
                Mã đã được gửi tới: <span className="text-white font-bold">{email}</span>
              </p>
              <p className="text-zinc-600 text-[10px] uppercase font-mono leading-relaxed">
                NHẬP MÃ 6 SỐ ĐÃ GỬI TỚI HỘP THƯ CỦA BẠN (CÓ HIỆU LỰC 10 PHÚT).
              </p>
            </div>

            <div>
              <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
                MÃ XÁC MINH 6 SỐ
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  className="w-full bg-black border border-zinc-850 px-10 h-11 text-center font-mono text-lg font-bold tracking-[0.5em] text-white focus:outline-none focus:border-white rounded"
                />
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-700" />
              </div>
            </div>

            <div className="space-y-3">
              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-xs font-bold tracking-[0.2em] uppercase rounded flex items-center justify-center space-x-2 cursor-pointer disabled:opacity-60"
              >
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                  <>
                    <span>XÁC MINH MÃ</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-full text-center font-mono text-[10px] tracking-widest text-zinc-500 hover:text-white uppercase cursor-pointer"
              >
                CHƯA NHẬN ĐƯỢC MÃ? GỬI LẠI
              </button>
            </div>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleStep3} className="space-y-5">
            <p className="text-zinc-500 text-xs tracking-wide leading-relaxed uppercase font-mono text-center">
              THIẾT LẬP MẬT KHẨU MỚI CHO TÀI KHOẢN CỦA BẠN.
            </p>

            <div>
              <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
                MẬT KHẨU MỚI
              </label>
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

            <div>
              <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
                XÁC NHẬN MẬT KHẨU
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full bg-black border border-zinc-850 px-10 h-11 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white rounded"
                />
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-700" />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-xs font-bold tracking-[0.2em] uppercase rounded flex items-center justify-center space-x-2 cursor-pointer mt-4 disabled:opacity-60"
            >
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : (
                <>
                  <span>XÁC NHẬN & CẬP NHẬT</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="space-y-6 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500 mb-2">
              <CheckCircle className="h-6 w-6 text-emerald-400" />
            </div>

            <p className="text-zinc-300 text-sm tracking-wide leading-relaxed uppercase font-mono">
              MẬT KHẨU CỦA BẠN ĐÃ ĐƯỢC CẬP NHẬT THÀNH CÔNG.
            </p>

            <button
              onClick={handleReturnToLogin}
              className="w-full py-4 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-xs font-bold tracking-[0.2em] uppercase rounded flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>ĐĂNG NHẬP VỚI MẬT KHẨU MỚI</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
