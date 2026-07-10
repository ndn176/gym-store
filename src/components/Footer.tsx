import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNewsletterSubscribe: (email: string) => void;
}

const SHOP_CATEGORIES = ['Tops', 'Bottoms', 'Outerwear', 'Accessories'];

const SUPPORT_LINKS = [
  { label: 'Sizing Guide', to: '/info/sizing-guide' },
  { label: 'Shipping Policy', to: '/info/shipping-policy' },
  { label: 'Returns & Exchanges', to: '/info/returns-exchanges' },
  { label: 'Contact Support', to: '/contact' },
];

const LEGAL_LINKS = [
  { label: 'PRIVACY POLICY', to: '/info/privacy-policy' },
  { label: 'TERMS OF SERVICE', to: '/info/terms-of-service' },
  { label: 'ACCESSIBILITY', to: '/info/accessibility' },
];

export default function Footer({ onNewsletterSubscribe }: FooterProps) {
  const [email, setEmail] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      onNewsletterSubscribe(email);
      setEmail('');
    }
  };

  return (
    <footer className="bg-black border-t border-zinc-900 text-zinc-400 font-sans">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">

          {/* Brand Intro Column */}
          <div className="space-y-4">
            <span className="font-sans text-lg font-black tracking-[0.25em] text-white block">
              IRON & AESTHETIC
            </span>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-xs">
              Premium performance apparel designed for high-intensity athletes. Combining heavy compound durability with precise aesthetic cuts.
            </p>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="font-mono text-xs font-semibold tracking-widest text-white uppercase mb-4">
              SHOPPING
            </h3>
            <ul className="space-y-3 text-sm">
              {SHOP_CATEGORIES.map((cat) => (
                <li key={cat}>
                  <Link
                    to={`/shop?category=${cat}`}
                    className="hover:text-white transition-colors duration-150 cursor-pointer"
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service Column */}
          <div>
            <h3 className="font-mono text-xs font-semibold tracking-widest text-white uppercase mb-4">
              SUPPORT
            </h3>
            <ul className="space-y-3 text-sm">
              {SUPPORT_LINKS.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className="hover:text-white transition-colors duration-150">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div>
            <h3 className="font-mono text-xs font-semibold tracking-widest text-white uppercase mb-4">
              JOIN THE CADRE
            </h3>
            <p className="text-xs text-zinc-500 mb-4 leading-relaxed">
              Subscribe to unlock early access to stealth drops, back-in-stock alerts, and elite athletic resources.
            </p>
            <form onSubmit={handleSubmit} className="flex max-w-md border-b border-zinc-800 focus-within:border-white transition-colors duration-300 pb-1">
              <input
                type="email"
                placeholder="YOUR EMAIL"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-transparent text-sm text-white placeholder-zinc-600 focus:outline-none py-1"
                required
              />
              <button
                type="submit"
                className="text-zinc-500 hover:text-white transition-colors p-1"
                aria-label="Subscribe"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 border-t border-zinc-900 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-zinc-600">
          <div className="mb-4 md:mb-0">
            © 2026 IRON & AESTHETIC INC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex space-x-6">
            {LEGAL_LINKS.map((link) => (
              <Link key={link.label} to={link.to} className="hover:text-zinc-400">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
