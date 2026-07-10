import React, { useState, useEffect, useRef } from 'react';
import { X, Search, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { POPULAR_SEARCHES } from '../data';
import { Product } from '../types';

interface SearchOverlayProps {
  products: Product[];
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (id: string) => void;
}

export default function SearchOverlay({ products, isOpen, onClose, onSelectProduct }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  useEffect(() => {
    if (query.trim() === '') {
      setResults([]);
    } else {
      const q = query.toLowerCase();
      const filtered = products.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
      setResults(filtered);
    }
  }, [query, products]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/98 px-6 py-8 sm:px-12 md:py-16">
      {/* Top Controls */}
      <div className="flex justify-between items-center max-w-7xl mx-auto w-full mb-12">
        <span className="font-sans text-xs tracking-[0.25em] text-zinc-500 uppercase">
          Search the Aesthetic
        </span>
        <button
          onClick={onClose}
          className="flex items-center space-x-2 text-zinc-400 hover:text-white font-mono text-xs tracking-widest cursor-pointer"
        >
          <span>CLOSE</span>
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Main Search Input */}
      <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col justify-start">
        <div className="relative border-b border-zinc-800 pb-4 focus-within:border-white transition-colors duration-300">
          <input
            ref={inputRef}
            type="text"
            placeholder="SEARCH PRODUCTS..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-2xl md:text-4xl font-extrabold tracking-wider text-white placeholder-zinc-800 focus:outline-none uppercase"
          />
          <Search className="absolute right-0 top-1/2 -translate-y-1/2 h-6 md:h-8 w-6 md:w-8 text-zinc-700" />
        </div>

        {/* Dynamic Content */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mt-12 overflow-y-auto pr-2 max-h-[60vh]">
          {/* Popular / Recent Searches */}
          {query === '' && (
            <div className="md:col-span-4 space-y-6">
              <h3 className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                Trending Searches
              </h3>
              <div className="flex flex-col space-y-3 items-start">
                {POPULAR_SEARCHES.map((search) => (
                  <button
                    key={search}
                    onClick={() => setQuery(search)}
                    className="group flex items-center space-x-2 text-sm text-zinc-400 hover:text-white transition-colors cursor-pointer"
                  >
                    <span>{search}</span>
                    <ArrowRight className="h-3 w-3 opacity-0 group-hover:opacity-100 transform translate-x-[-4px] group-hover:translate-x-0 transition-all duration-200" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Results Column */}
          <div className={`${query === '' ? 'md:col-span-8' : 'md:col-span-12'} space-y-6`}>
            {query !== '' && (
              <div className="flex justify-between items-center border-b border-zinc-900 pb-2">
                <h3 className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                  RESULTS ({results.length})
                </h3>
              </div>
            )}

            {results.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.map((product) => (
                  <div
                    key={product.id}
                    onClick={() => {
                      onSelectProduct(product.id);
                      onClose();
                    }}
                    className="group flex flex-col cursor-pointer border border-zinc-900 hover:border-zinc-800 bg-zinc-950 p-4 transition-all duration-300 rounded-lg"
                  >
                    <div className="aspect-square w-full overflow-hidden rounded bg-zinc-900 mb-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
                          {product.category}
                        </span>
                        <h4 className="font-bold text-sm text-white group-hover:text-zinc-300 transition-colors line-clamp-1">
                          {product.name}
                        </h4>
                      </div>
                      <div className="font-mono text-xs text-white mt-2">
                        ${product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : query !== '' ? (
              <div className="text-center py-12 text-zinc-500">
                No products found matching "{query}". Try searching for 'Tee', 'Jogger' or 'Belt'.
              </div>
            ) : (
              <div className="hidden md:block py-12 text-zinc-700 font-mono text-xs tracking-widest">
                ENTER KEYWORDS TO REVEAL SPECIFIC PIECES FROM THE CADRE.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
