import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Search, User, ShoppingBag, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface HeaderProps {
  setView: (view: string) => void;
  cartCount: number;
  onSearchClick: () => void;
  onProfileClick: () => void;
  onCartClick: () => void;
}

export default function Header({
  setView,
  cartCount,
  onSearchClick,
  onProfileClick,
  onCartClick,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { label: 'SHOP ALL', to: '/shop' },
    { label: 'COLLECTIONS', to: '/collections' },
    { label: 'OUR STORY', to: '/our-story' },
  ];

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-zinc-800 bg-black/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          
          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle"
            className="flex h-10 w-10 items-center justify-center text-zinc-400 hover:text-white md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Brand Logo */}
          <div className="flex-1 md:flex-none">
            <button
              onClick={() => setView('home')}
              className="flex items-center space-x-2 text-left cursor-pointer"
            >
              <span className="font-sans text-xl font-black tracking-[0.25em] text-white">
                IRON & AESTHETIC
              </span>
            </button>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden space-x-10 md:flex items-center">
            {navItems.map((item) => {
              const isActive = location.pathname === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`cursor-pointer font-mono text-xs tracking-widest transition-all duration-200 hover:text-white ${
                    isActive ? 'text-white font-bold' : 'text-zinc-400'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-4 sm:space-x-6">
            <button
              id="search-trigger"
              onClick={onSearchClick}
              className="flex h-10 w-10 items-center justify-center text-zinc-400 transition-colors hover:text-white"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            <button
              id="profile-trigger"
              onClick={onProfileClick}
              className="flex h-10 w-10 items-center justify-center text-zinc-400 transition-colors hover:text-white"
              aria-label="Account"
            >
              <User className="h-5 w-5" />
            </button>

            <button
              id="cart-trigger"
              onClick={onCartClick}
              className="relative flex h-10 w-10 items-center justify-center text-zinc-400 transition-colors hover:text-white"
              aria-label="Cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-white text-[9px] font-bold text-black ring-2 ring-black">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Nav Menu Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm md:hidden"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.3 }}
              className="fixed inset-y-0 left-0 z-50 w-full max-w-xs bg-zinc-950 p-6 shadow-xl border-r border-zinc-900 md:hidden flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between border-b border-zinc-900 pb-6 mb-8">
                  <span className="font-sans text-md font-extrabold tracking-[0.2em] text-white">
                    IRON & AESTHETIC
                  </span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex h-10 w-10 items-center justify-center text-zinc-400 hover:text-white"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.label}
                      to={item.to}
                      onClick={closeMobileMenu}
                      className="block w-full text-left font-mono text-sm tracking-widest text-zinc-300 hover:text-white py-2 border-b border-zinc-900/50"
                    >
                      {item.label}
                    </Link>
                  ))}
                  <Link
                    to="/shop"
                    onClick={closeMobileMenu}
                    className="block w-full text-left font-mono text-sm tracking-widest text-zinc-300 hover:text-white py-2 border-b border-zinc-900/50"
                  >
                    NEW ARRIVALS
                  </Link>
                </div>
              </div>

              <div className="border-t border-zinc-900 pt-6">
                <button
                  onClick={() => {
                    onProfileClick();
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-3 text-zinc-400 hover:text-white w-full py-2 mb-2"
                >
                  <User className="h-5 w-5" />
                  <span className="font-mono text-xs tracking-widest">MY ACCOUNT</span>
                </button>
                <div className="text-[10px] font-mono text-zinc-600 mt-4">
                  © 2026 IRON & AESTHETIC. ALL RIGHTS RESERVED.
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
