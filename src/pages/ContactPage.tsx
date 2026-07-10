import React, { useState } from 'react';
import { Mail, Loader2, CheckCircle } from 'lucide-react';
import { contactApi } from '../api/contact';
import { ApiError } from '../api/client';

export default function ContactPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!name || !email || !message) {
      setError('VUI LÒNG NHẬP ĐẦY ĐỦ TÊN, EMAIL VÀ NỘI DUNG.');
      return;
    }
    setSubmitting(true);
    try {
      await contactApi.send({ name, email, subject, message });
      setSent(true);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Không gửi được, vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-black text-white min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-md space-y-4">
          <CheckCircle className="h-10 w-10 text-emerald-400 mx-auto" />
          <h1 className="text-2xl font-black uppercase">Đã gửi thành công</h1>
          <p className="text-zinc-500 text-sm">
            Cảm ơn bạn đã liên hệ. Đội ngũ hỗ trợ của Iron & Aesthetic sẽ phản hồi qua email trong thời
            gian sớm nhất.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <div className="border-b border-zinc-900 bg-zinc-950/20 py-16 px-4 text-center">
        <span className="font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase">Support</span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase mt-2">
          Liên hệ với chúng tôi
        </h1>
      </div>

      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 p-3 text-red-500 text-xs font-mono text-center uppercase tracking-wide rounded mb-6">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
              Họ tên *
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-850 px-4 h-11 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white rounded"
              placeholder="Nguyễn Văn A"
            />
          </div>
          <div>
            <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
              Email *
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 px-10 h-11 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white rounded"
                placeholder="name@domain.com"
              />
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4.5 w-4.5 text-zinc-700" />
            </div>
          </div>
          <div>
            <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
              Tiêu đề
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-850 px-4 h-11 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white rounded"
              placeholder="Về đơn hàng / sản phẩm / khác"
            />
          </div>
          <div>
            <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
              Nội dung *
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              className="w-full bg-zinc-950 border border-zinc-850 px-4 py-3 text-xs text-white placeholder-zinc-700 focus:outline-none focus:border-white rounded resize-none"
              placeholder="Nội dung bạn muốn gửi..."
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-xs font-bold tracking-[0.2em] uppercase rounded flex items-center justify-center space-x-2 disabled:opacity-60"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <span>GỬI LIÊN HỆ</span>}
          </button>
        </form>
      </div>
    </div>
  );
}
