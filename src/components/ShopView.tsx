import React, { useMemo } from 'react';
import { Grid, LayoutGrid } from 'lucide-react';
import { Product } from '../types';

interface ShopViewProps {
  products: Product[];
  onSelectProduct: (id: string) => void;
  searchQuery: string;
  collection?: string | null;
  category?: string | null;
}

export default function ShopView({ products, onSelectProduct, searchQuery, collection, category }: ShopViewProps) {
  const [sortBy, setSortBy] = React.useState<string>('featured');
  const [cols, setCols] = React.useState<number>(4);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) => p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q)
      );
    }

    if (collection) {
      result = result.filter((p) => p.collection === collection);
    }

    if (category) {
      result = result.filter((p) => p.category === category);
    }

    if (sortBy === 'price-low') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [products, searchQuery, collection, category, sortBy]);

  const heading = collection ? `${collection.toUpperCase()} COLLECTION` : category ? category.toUpperCase() : 'SHOP ALL';

  return (
    <div className="bg-black text-white min-h-screen font-sans pb-24">
      {/* Page Header / Breadcrumbs */}
      <div className="border-b border-zinc-900 bg-zinc-950/20 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 text-xs font-mono text-zinc-500 mb-4 uppercase tracking-widest">
            <span>HOME</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">{heading}</span>
          </nav>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
                {heading}
              </h1>
              <p className="text-zinc-500 text-xs md:text-sm tracking-wide mt-1 uppercase font-mono">
                ELEVATED BASICS & HIGH-STRENGTH ATHLETIC WEAR — {filteredProducts.length} SẢN PHẨM
              </p>
            </div>

            <div className="flex items-center space-x-6 mt-4 md:mt-0 border-t border-zinc-900 md:border-t-0 pt-4 md:pt-0">
              <div className="hidden sm:flex items-center space-x-2 text-zinc-500 font-mono text-xs uppercase tracking-wider">
                <span>GRID:</span>
                <button
                  onClick={() => setCols(2)}
                  className={`p-1 ${cols === 2 ? 'text-white bg-zinc-900' : 'hover:text-white'}`}
                  title="2 Columns"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setCols(4)}
                  className={`p-1 ${cols === 4 ? 'text-white bg-zinc-900' : 'hover:text-white'}`}
                  title="4 Columns"
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
              </div>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-zinc-950 border border-zinc-800 text-zinc-400 font-mono text-xs tracking-wider uppercase px-4 py-2 focus:outline-none focus:border-zinc-500 rounded cursor-pointer"
              >
                <option value="featured">SORT: FEATURED</option>
                <option value="price-low">PRICE: LOW TO HIGH</option>
                <option value="price-high">PRICE: HIGH TO LOW</option>
                <option value="rating">TOP RATED</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {filteredProducts.length > 0 ? (
          <div className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-${cols === 2 ? '2' : '4'} gap-8`}>
            {filteredProducts.map((product) => {
              const isSoldOut = (product.stock ?? 0) <= 0;
              return (
                <div
                  key={product.id}
                  onClick={() => onSelectProduct(product.id)}
                  className="group flex flex-col cursor-pointer border border-zinc-900 hover:border-zinc-800 bg-zinc-950/20 p-4 transition-all duration-300 rounded-lg relative"
                >
                  <div className="aspect-square w-full overflow-hidden rounded bg-zinc-900 mb-4 relative">
                    {product.status && !isSoldOut && (
                      <span className="absolute top-3 left-3 z-10 bg-white text-black font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-sm">
                        {product.status}
                      </span>
                    )}
                    {isSoldOut && (
                      <span className="absolute top-3 left-3 z-10 bg-red-500/90 text-white font-mono text-[9px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-sm">
                        SOLD OUT
                      </span>
                    )}

                    <img
                      src={product.image}
                      alt={product.name}
                      referrerPolicy="no-referrer"
                      className={`h-full w-full object-cover object-center transition-all duration-700 ${
                        isSoldOut ? 'opacity-50 grayscale' : ''
                      } ${
                        product.hoverImage ? 'group-hover:opacity-0 group-hover:scale-102' : 'group-hover:scale-102'
                      }`}
                    />

                    {product.hoverImage && !isSoldOut && (
                      <img
                        src={product.hoverImage}
                        alt={`${product.name} alternate`}
                        referrerPolicy="no-referrer"
                        className="absolute inset-0 h-full w-full object-cover object-center opacity-0 group-hover:opacity-100 group-hover:scale-102 transition-all duration-700"
                      />
                    )}
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">
                          {product.category}
                        </span>
                        <span className="font-mono text-[9px] tracking-wider text-zinc-600 uppercase">
                          {product.collection}
                        </span>
                      </div>

                      <h3 className="font-bold text-sm text-white group-hover:text-zinc-300 transition-colors mt-1 leading-tight line-clamp-2">
                        {product.name}
                      </h3>
                    </div>

                    <div className="flex justify-between items-center mt-4 pt-3 border-t border-zinc-900">
                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-sm text-white font-bold">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.originalPrice && (
                          <span className="font-mono text-xs text-zinc-600 line-through">
                            ${product.originalPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-[10px] tracking-widest text-zinc-400 group-hover:text-white transition-colors uppercase">
                        {isSoldOut ? 'HẾT HÀNG' : 'VIEW DETAILS'}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-24 border border-zinc-900 bg-zinc-950/40 rounded-lg">
            <p className="text-zinc-500 font-mono text-sm uppercase">Không tìm thấy sản phẩm phù hợp</p>
          </div>
        )}
      </div>
    </div>
  );
}
