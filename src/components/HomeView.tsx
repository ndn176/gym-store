import React from 'react';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Product } from '../types';

interface HomeViewProps {
  products: Product[];
  setView: (view: string) => void;
  onSelectProduct: (id: string) => void;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
}

export default function HomeView({ products, setView, onSelectProduct, onAddToCart }: HomeViewProps) {
  // Best sellers: V3 Tee, Kinetic Jogger, Lifting Belt, Hoodie
  const bestSellers = products.filter(p =>
    ['core-aesthetic-v3-tee', 'kinetic-jogger', 'pro-lifting-belt', 'heavy-oversized-hoodie'].includes(p.id)
  );

  const ensembles = [
    {
      title: 'STEALTH SERIES',
      category: 'Tops & Bottoms',
      description: 'Triple-black performance gear designed to absorb light and command focus.',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'CORE ACCESSORIES',
      category: 'Powerlifting & Gear',
      description: '10mm Lever Belts and Cordura pouches engineered for heavy compound loads.',
      image: 'https://images.unsplash.com/photo-1605296867304-46d5465a25f1?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'IVORY COLLECTION',
      category: 'Warm-Ups & Tops',
      description: 'Premium bone and sand-toned oversized French terry hoodies and tees.',
      image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=800',
    },
    {
      title: 'ARCHITECTURAL FIT',
      category: 'Outerwear & Layers',
      description: 'Structured shell windbreakers and utility joggers mirroring geometric perfection.',
      image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&q=80&w=800',
    },
  ];

  return (
    <div className="bg-black text-white font-sans overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative h-[90vh] w-full flex items-center justify-center bg-zinc-950">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1600"
            alt="Hero background"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-40 filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-4 flex flex-col items-center">
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="font-mono text-xs tracking-[0.4em] text-zinc-400 uppercase mb-4"
          >
            IRON & AESTHETIC — VOLUME THREE
          </motion.p>
          
          <motion.h1
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-sans text-5xl md:text-8xl font-black tracking-[0.15em] text-white uppercase leading-tight mb-8"
          >
            RAISE <br className="sm:hidden" /> THE BAR
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-zinc-400 text-sm md:text-base tracking-wide max-w-lg mb-10 leading-relaxed font-light"
          >
            Meticulously engineered garments for the dedicated athlete. Combining raw durability with modern, minimalist geometries.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <button
              onClick={() => setView('shop')}
              className="px-8 py-4 bg-white text-black font-mono text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-200 hover:tracking-[0.25em] transition-all duration-300 shadow-lg cursor-pointer"
            >
              SHOP NEW ARRIVALS
            </button>
          </motion.div>
        </div>
      </section>

      {/* 2. Curated Ensembles (Bento Grid) */}
      <section id="collections" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-900">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16">
          <div>
            <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
              Curated Ensembles
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight mt-1 text-white">
              CORE COLLECTIONS
            </h2>
          </div>
          <button
            onClick={() => setView('shop')}
            className="group flex items-center space-x-2 text-zinc-400 hover:text-white font-mono text-xs tracking-widest mt-4 md:mt-0 cursor-pointer"
          >
            <span>VIEW ALL SERIES</span>
            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ensembles.map((ens, idx) => (
            <div
              key={ens.title}
              onClick={() => setView('shop')}
              className="group relative h-[450px] overflow-hidden cursor-pointer border border-zinc-900 hover:border-zinc-800 transition-all duration-500 rounded-lg bg-zinc-950"
            >
              {/* Background image */}
              <div className="absolute inset-0 bg-black">
                <img
                  src={ens.image}
                  alt={ens.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center opacity-40 group-hover:scale-105 group-hover:opacity-50 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
              </div>

              {/* Text content */}
              <div className="absolute inset-0 p-8 flex flex-col justify-end">
                <span className="font-mono text-[10px] tracking-widest text-zinc-400 uppercase mb-1">
                  {ens.category}
                </span>
                <h3 className="font-sans text-2xl font-black tracking-widest text-white mb-2 uppercase">
                  {ens.title}
                </h3>
                <p className="text-zinc-400 text-xs tracking-wide leading-relaxed max-w-md mb-6 transform opacity-90 group-hover:opacity-100 transition-opacity">
                  {ens.description}
                </p>
                <div className="flex items-center space-x-2 text-white font-mono text-xs tracking-widest">
                  <span>DISCOVER SERIES</span>
                  <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Design Philosophy Mid-Banner */}
      <section id="about" className="py-28 bg-zinc-950 border-t border-b border-zinc-900 text-center px-4">
        <div className="max-w-3xl mx-auto">
          <span className="font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase">
            DESIGN PHILOSOPHY
          </span>
          <h2 className="font-sans text-3xl md:text-5xl font-black tracking-[0.1em] text-white uppercase mt-4 mb-8 leading-tight">
            FORM DICTATES FUNCTION.<br />AESTHETIC COMMANDS RESPECT.
          </h2>
          <p className="text-zinc-500 text-sm tracking-wide leading-relaxed font-light max-w-xl mx-auto">
            We reject the disposable, the noisy, the over-designed. Our training gear is stripped of excess and built for pure athletic leverage. Every stitch is placed with high-strength tactical thread, every cut optimized for standard human posture under load.
          </p>
        </div>
      </section>

      {/* 4. Best Sellers Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-16">
          <div>
            <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
              Athlete Favorites
            </span>
            <h2 className="font-sans text-3xl md:text-4xl font-extrabold tracking-tight mt-1 text-white">
              BEST SELLERS
            </h2>
          </div>
          <button
            onClick={() => setView('shop')}
            className="group flex items-center space-x-2 text-zinc-400 hover:text-white font-mono text-xs tracking-widest cursor-pointer"
          >
            <span>SHOP ENTIRE SELECTION</span>
            <ChevronRight className="h-4 w-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {bestSellers.map((product) => {
            const isSoldOut = (product.stock ?? 0) <= 0;
            return (
            <div
              key={product.id}
              onClick={() => onSelectProduct(product.id)}
              className="group flex flex-col cursor-pointer border border-zinc-900 hover:border-zinc-800 bg-zinc-950/40 p-4 transition-all duration-300 rounded-lg"
            >
              <div className="aspect-square w-full overflow-hidden rounded bg-zinc-900 mb-4 relative">
                {product.status && !isSoldOut && (
                  <span className="absolute top-3 left-3 z-10 bg-white text-black font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase">
                    {product.status}
                  </span>
                )}
                {isSoldOut && (
                  <span className="absolute top-3 left-3 z-10 bg-red-500/90 text-white font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase">
                    SOLD OUT
                  </span>
                )}
                <img
                  src={product.image}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  className={`h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-500 ${isSoldOut ? 'opacity-50 grayscale' : ''}`}
                />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
                    {product.category}
                  </span>
                  <h3 className="font-bold text-sm text-white group-hover:text-zinc-300 transition-colors mt-0.5 leading-tight">
                    {product.name}
                  </h3>
                </div>
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-zinc-900">
                  <span className="font-mono text-sm text-white">
                    ${product.price.toFixed(2)}
                  </span>
                  <span className="font-mono text-[10px] tracking-wider text-zinc-400 group-hover:text-white transition-colors">
                    VIEW PIECE
                  </span>
                </div>
              </div>
            </div>
            );
          })}
        </div>
      </section>
      <section className="relative h-[50vh] w-full flex items-center bg-zinc-950">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1544923246-77307dd654cb?auto=format&fit=crop&q=80&w=1600"
            alt="Atmospheric gym close up"
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center opacity-25 filter grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-xl">
            <span className="font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase">
              NEW SELECTION
            </span>
            <h2 className="font-sans text-3xl md:text-5xl font-black tracking-wider text-white uppercase mt-4 mb-6 leading-tight">
              STEALTH DISCOVERY
            </h2>
            <p className="text-zinc-400 text-sm tracking-wide leading-relaxed mb-8">
              Discover raw materials, tailored ergonomics, and custom black hues designed to outlast any session.
            </p>
            <button
              onClick={() => setView('shop')}
              className="px-6 py-3.5 bg-transparent border border-white text-white font-mono text-xs font-bold tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 cursor-pointer"
            >
              EXPLORE GEAR
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
