import React from 'react';
import {
  Sparkles,
  Layers,
  ChevronRight,
  Info,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';

export default function AdminDesignSystemView() {
  const brandColors = [
    { name: 'PURE MATTE BLACK', hex: '#000000', tailwind: 'bg-black', text: 'text-zinc-500', desc: 'Core platform canvas and deep backdrop shadow.' },
    { name: 'SURFACE NOIR', hex: '#09090B', tailwind: 'bg-zinc-950', text: 'text-zinc-500', desc: 'Primary card layouts, containers, and modules.' },
    { name: 'BORDER CHARCOAL', hex: '#18181B', tailwind: 'bg-zinc-900', text: 'text-zinc-500', desc: 'Symmetrical grids, panel lines, and field rings.' },
    { name: 'ACCENT TACTICAL', hex: '#27272A', tailwind: 'bg-zinc-800', text: 'text-zinc-400', desc: 'Secondary borders, input active, and button hovers.' },
    { name: 'PURE IVORY WHITE', hex: '#FFFFFF', tailwind: 'bg-white text-black', text: 'text-zinc-650', desc: 'Primary display headers, hero fills, and core badges.' },
    { name: 'MUTED ZINC', hex: '#71717A', tailwind: 'bg-zinc-500', text: 'text-white', desc: 'Subheadings, metadata tracking lines, and placeholders.' },
  ];

  return (
    <div className="space-y-10 animate-fade-in pb-16">
      
      {/* Introduction */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-6 max-w-4xl">
        <span className="font-mono text-[9px] tracking-widest text-zinc-500 font-bold uppercase">BRAND DIRECTIVE</span>
        <h3 className="font-sans text-xl font-extrabold tracking-wider text-white uppercase mt-1">THE "IRON & AESTHETIC" BRAND ENGINE</h3>
        <p className="font-sans text-xs text-zinc-400 mt-3 leading-relaxed">
          Our administrative UI is forged around brutalist minimalism, high-contrast typography, and clean industrial alignments. Excess borders, default shadows, and primary colored gradients are rejected. True quality comes through spacious margins, micro-level geometric lines, and strong typographic hierarchies.
        </p>
      </div>

      {/* 1. Color Swatches */}
      <div className="space-y-4">
        <div className="border-b border-zinc-900 pb-2">
          <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest">CHAPTER ONE</span>
          <h4 className="font-sans text-sm font-extrabold text-white uppercase mt-0.5">BRAND CHROMATIC SWATCHES</h4>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {brandColors.map((col) => (
            <div key={col.name} className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden flex flex-col justify-between">
              <div className={`h-24 ${col.tailwind} flex items-end p-4 border-b border-zinc-900`}>
                <span className="font-mono text-xs font-black tracking-wider uppercase">{col.hex}</span>
              </div>
              <div className="p-4 space-y-1.5">
                <span className="font-sans text-xs font-extrabold text-white uppercase block">{col.name}</span>
                <span className="font-mono text-[9px] text-zinc-500 uppercase block tracking-wider">{col.tailwind}</span>
                <p className="text-[11px] text-zinc-400 font-sans leading-snug mt-2 pt-2 border-t border-zinc-900/40">
                  {col.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 2. Typography Stacks */}
      <div className="space-y-4">
        <div className="border-b border-zinc-900 pb-2">
          <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest">CHAPTER TWO</span>
          <h4 className="font-sans text-sm font-extrabold text-white uppercase mt-0.5">TYPOGRAPHIC SYSTEM</h4>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-6 space-y-6">
          
          {/* Display title */}
          <div className="space-y-1.5 pb-4 border-b border-zinc-900">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">HERO DISPLAY HEADINGS (SPACE GROTESK pairing)</span>
            <h1 className="text-3xl md:text-5xl font-black tracking-[0.18em] text-white uppercase leading-none">
              RAISE THE BAR
            </h1>
            <span className="font-mono text-[9px] text-zinc-600 tracking-wider block pt-1">CLASSES: text-3xl md:text-5xl font-black tracking-[0.18em] text-white uppercase</span>
          </div>

          {/* Section title */}
          <div className="space-y-1.5 pb-4 border-b border-zinc-900">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">SECTION TITLES</span>
            <h2 className="font-sans text-lg font-extrabold text-white uppercase tracking-wider">
              INVENTORY MANAGEMENT HUB
            </h2>
            <span className="font-mono text-[9px] text-zinc-650 block pt-1">CLASSES: font-sans text-lg font-extrabold text-white uppercase tracking-wider</span>
          </div>

          {/* Monospace details */}
          <div className="space-y-1.5 pb-4 border-b border-zinc-900">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">SYSTEM MONOSPACE DATA (JETBRAINS MONO)</span>
            <p className="font-mono text-xs tracking-widest text-zinc-200 uppercase leading-none">
              SKU: CO-AE-V3-TEE // STOCK: 85 UNITS // REV: $5,440.00
            </p>
            <span className="font-mono text-[9px] text-zinc-650 block pt-1">CLASSES: font-mono text-xs tracking-widest text-zinc-200 uppercase</span>
          </div>

          {/* Body content */}
          <div className="space-y-1.5">
            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">BODY COPY SANS-SERIF (INTER)</span>
            <p className="font-sans text-xs text-zinc-400 leading-relaxed max-w-2xl">
              Engineered for high-intensity training and aesthetic styling. The Core Aesthetic V3 Performance Tee features our signature athletic cut, curved hem, and ultra-lightweight breathable fabric that moves naturally with your body.
            </p>
            <span className="font-mono text-[9px] text-zinc-650 block pt-1">CLASSES: font-sans text-xs text-zinc-400 leading-relaxed</span>
          </div>

        </div>
      </div>

      {/* 3. Button Actions */}
      <div className="space-y-4">
        <div className="border-b border-zinc-900 pb-2">
          <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest">CHAPTER THREE</span>
          <h4 className="font-sans text-sm font-extrabold text-white uppercase mt-0.5">TACTICAL BUTTON SYSTEMS</h4>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            
            {/* White Solid */}
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-zinc-500 uppercase block">HERO SOLID FILL</span>
              <button className="w-full py-3.5 bg-white text-black font-mono text-xs font-bold tracking-widest uppercase rounded shadow-lg hover:bg-zinc-200 transition-all cursor-pointer">
                SUBMIT ORDER
              </button>
            </div>

            {/* Dark border */}
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-zinc-500 uppercase block">CORE TACTICAL OUTLINE</span>
              <button className="w-full py-3.5 bg-black text-white font-mono text-xs font-bold tracking-widest uppercase border border-zinc-800 rounded hover:bg-zinc-900 hover:border-zinc-500 transition-all cursor-pointer">
                ADD TO CATALOG
              </button>
            </div>

            {/* Rose Filled alert */}
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-zinc-500 uppercase block">ALERT TENSION SOLID</span>
              <button className="w-full py-3.5 bg-rose-950 border border-rose-800 hover:bg-rose-900 text-rose-300 font-mono text-xs font-bold tracking-widest uppercase rounded transition-all cursor-pointer">
                CONFIRM DELETION
              </button>
            </div>

            {/* Muted static */}
            <div className="space-y-3">
              <span className="font-mono text-[9px] text-zinc-500 uppercase block">MUTED UTILITY GHOST</span>
              <button className="w-full py-3.5 bg-zinc-900 border border-zinc-850 text-zinc-500 font-mono text-xs tracking-widest uppercase rounded cursor-not-allowed" disabled>
                LOCKED ACTION
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* 4. Badges and Statuses */}
      <div className="space-y-4">
        <div className="border-b border-zinc-900 pb-2">
          <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest">CHAPTER FOUR</span>
          <h4 className="font-sans text-sm font-extrabold text-white uppercase mt-0.5">STATUS LABELS & BADGES</h4>
        </div>
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-6">
          <div className="flex flex-wrap gap-6 items-center">
            
            {/* New In */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-zinc-500 block uppercase">CATALOG: NEW IN</span>
              <span className="bg-white text-black font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-sm">
                NEW IN
              </span>
            </div>

            {/* Sale */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-zinc-500 block uppercase">CATALOG: SALE</span>
              <span className="bg-rose-950/20 border border-rose-800 text-rose-400 font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-sm">
                SALE
              </span>
            </div>

            {/* Essentials */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-zinc-500 block uppercase">CATALOG: ESSENTIALS</span>
              <span className="bg-zinc-900 border border-zinc-800 text-zinc-400 font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-sm">
                ESSENTIALS
              </span>
            </div>

            {/* Delivered */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-zinc-500 block uppercase">SHIPMENT: DELIVERED</span>
              <span className="bg-emerald-950/40 border border-emerald-900 text-emerald-400 px-2.5 py-1 rounded-sm text-[9px] font-mono font-bold uppercase tracking-wider">
                DELIVERED
              </span>
            </div>

            {/* Shipped */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-zinc-500 block uppercase">SHIPMENT: SHIPPED</span>
              <span className="bg-sky-950/40 border border-sky-900 text-sky-400 px-2.5 py-1 rounded-sm text-[9px] font-mono font-bold uppercase tracking-wider">
                SHIPPED
              </span>
            </div>

            {/* Processing */}
            <div className="space-y-2">
              <span className="font-mono text-[9px] text-zinc-500 block uppercase">SHIPMENT: PROCESSING</span>
              <span className="bg-amber-950/40 border border-amber-900 text-amber-400 px-2.5 py-1 rounded-sm text-[9px] font-mono font-bold uppercase tracking-wider">
                PROCESSING
              </span>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}
