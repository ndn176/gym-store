import React, { useState, useMemo } from 'react';
import {
  Search,
  Plus,
  Edit,
  Trash2,
  SlidersHorizontal,
  ChevronDown,
  Grid,
  List,
  AlertCircle
} from 'lucide-react';
import { Product } from '../types';

interface AdminProductsViewProps {
  products: Product[];
  inventory: Record<string, number>;
  onAddProductClick: () => void;
  onEditProductClick: (product: Product) => void;
  onDeleteProduct: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export default function AdminProductsView({
  products,
  inventory,
  onAddProductClick,
  onEditProductClick,
  onDeleteProduct,
  onShowToast
}: AdminProductsViewProps) {
  const [query, setQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCollection, setSelectedCollection] = useState<string>('all');
  const [displayMode, setDisplayMode] = useState<'grid' | 'list'>('grid');

  // Confirmation state for deleting a product
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch =
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.id.toLowerCase().includes(query.toLowerCase()) ||
        p.category.toLowerCase().includes(query.toLowerCase());

      const matchesCategory =
        selectedCategory === 'all' || p.category === selectedCategory;

      const matchesCollection =
        selectedCollection === 'all' || p.collection === selectedCollection;

      return matchesSearch && matchesCategory && matchesCollection;
    });
  }, [products, query, selectedCategory, selectedCollection]);

  const handleDeleteTrigger = (id: string) => {
    setConfirmDeleteId(id);
  };

  const handleDeleteConfirm = (id: string, name: string) => {
    onDeleteProduct(id);
    setConfirmDeleteId(null);
    onShowToast(`DELETED PIECE SECURELY: ${name.toUpperCase()}`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 1. Header Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-950 border border-zinc-900 rounded-lg p-4">
        
        {/* Search controls */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="SEARCH CATALOG (BY NAME, ID, CATEGORY)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono tracking-wider text-white placeholder-zinc-500 py-3 pl-10 pr-4 focus:outline-none rounded uppercase"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        </div>

        {/* Action button */}
        <button
          onClick={onAddProductClick}
          className="px-5 py-3 bg-white hover:bg-zinc-200 text-black font-mono text-xs font-bold tracking-widest uppercase rounded flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
        >
          <Plus className="h-4 w-4" />
          <span>ADD NEW PRODUCT</span>
        </button>
      </div>

      {/* 2. Advanced Filters Row */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-zinc-950 border border-zinc-900 rounded-lg p-4 text-xs font-mono text-zinc-400">
        <div className="flex flex-wrap items-center gap-6">
          
          {/* Category Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-zinc-600 font-bold">CATEGORY:</span>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-200 px-3 py-1.5 rounded focus:outline-none cursor-pointer uppercase text-[11px] tracking-wider"
            >
              <option value="all">ALL CATEGORIES</option>
              <option value="Tops">TOPS</option>
              <option value="Bottoms">BOTTOMS</option>
              <option value="Outerwear">OUTERWEAR</option>
              <option value="Accessories">ACCESSORIES</option>
            </select>
          </div>

          {/* Collection Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-zinc-600 font-bold">COLLECTION:</span>
            <select
              value={selectedCollection}
              onChange={(e) => setSelectedCollection(e.target.value)}
              className="bg-zinc-900 border border-zinc-850 hover:border-zinc-700 text-zinc-200 px-3 py-1.5 rounded focus:outline-none cursor-pointer uppercase text-[11px] tracking-wider"
            >
              <option value="all">ALL COLLECTIONS</option>
              <option value="Men">MEN</option>
              <option value="Women">WOMEN</option>
              <option value="Unisex">UNISEX</option>
            </select>
          </div>

        </div>

        {/* Grid / List Toggles */}
        <div className="flex items-center space-x-3 text-zinc-500">
          <span>LAYOUT:</span>
          <button
            onClick={() => setDisplayMode('grid')}
            className={`p-1.5 rounded ${displayMode === 'grid' ? 'bg-zinc-900 text-white' : 'hover:text-white'}`}
            title="Grid View"
          >
            <Grid className="h-4 w-4" />
          </button>
          <button
            onClick={() => setDisplayMode('list')}
            className={`p-1.5 rounded ${displayMode === 'list' ? 'bg-zinc-900 text-white' : 'hover:text-white'}`}
            title="List View"
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* 3. Catalog Listing Render */}
      {filteredProducts.length > 0 ? (
        displayMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((p) => {
              const stock = inventory[p.id] ?? 0;
              const isDeleting = confirmDeleteId === p.id;
              
              return (
                <div
                  key={p.id}
                  className="bg-zinc-950 border border-zinc-900 hover:border-zinc-800 p-4 rounded-lg flex flex-col justify-between transition-all group duration-200 relative overflow-hidden"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="aspect-square rounded overflow-hidden bg-zinc-900 mb-4 relative border border-zinc-900">
                      <img
                        src={p.image}
                        alt={p.name}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover object-center group-hover:scale-101 transition-transform duration-500"
                      />
                      <span className="absolute top-2.5 left-2.5 z-10 bg-zinc-950/80 border border-zinc-800 text-zinc-400 font-mono text-[8px] font-bold tracking-widest px-2 py-0.5 uppercase rounded-sm">
                        {p.collection}
                      </span>
                      {stock < 15 && (
                        <span className="absolute top-2.5 right-2.5 z-10 bg-rose-950/90 border border-rose-800 text-rose-300 font-mono text-[8px] font-bold tracking-widest px-2 py-0.5 uppercase rounded-sm">
                          LOW STOCK
                        </span>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase font-semibold">
                        {p.category}
                      </span>
                      <span className="font-mono text-[9px] tracking-wider text-zinc-600 font-semibold truncate max-w-[80px]">
                        ID: {p.id}
                      </span>
                    </div>

                    {/* Title */}
                    <h4 className="font-sans text-xs font-bold text-white uppercase tracking-tight leading-snug line-clamp-1">
                      {p.name}
                    </h4>

                    {/* Price and Stock status details */}
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="font-mono text-xs font-extrabold text-white">
                        ${p.price.toFixed(2)}
                      </span>
                      {p.originalPrice && (
                        <span className="font-mono text-[10px] text-zinc-600 line-through">
                          ${p.originalPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Actions Bar */}
                  <div className="mt-5 pt-3 border-t border-zinc-900 flex items-center justify-between relative min-h-[44px]">
                    {isDeleting ? (
                      <div className="absolute inset-0 bg-zinc-950 flex items-center justify-between text-[10px] font-mono leading-none">
                        <span className="text-rose-500 font-bold flex items-center space-x-1">
                          <AlertCircle className="h-3.5 w-3.5" />
                          <span>SURE?</span>
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDeleteConfirm(p.id, p.name)}
                            className="bg-rose-950 border border-rose-800 text-rose-300 px-2 py-1.5 font-bold uppercase rounded hover:bg-rose-900"
                          >
                            YES, DROP
                          </button>
                          <button
                            onClick={() => setConfirmDeleteId(null)}
                            className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1.5 font-bold uppercase rounded hover:bg-zinc-800"
                          >
                            KEEP
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                          STOCK: <span className={stock < 15 ? 'text-rose-500' : 'text-zinc-300'}>{stock} UNITS</span>
                        </span>
                        <div className="flex items-center space-x-2 shrink-0">
                          <button
                            onClick={() => onEditProductClick(p)}
                            className="p-2 bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 hover:border-white text-zinc-400 rounded transition-all"
                            title="Edit Product"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteTrigger(p.id)}
                            className="p-2 bg-zinc-900 hover:bg-rose-950 hover:text-rose-400 border border-zinc-800 hover:border-rose-900 text-zinc-500 rounded transition-all"
                            title="Delete Product"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </>
                    )}
                  </div>

                </div>
              );
            })}
          </div>
        ) : (
          /* List View Layout */
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-zinc-900 text-[10px] font-mono text-zinc-500 uppercase tracking-wider bg-zinc-950/40">
                    <th className="p-4 font-semibold">PRODUCT</th>
                    <th className="p-4 font-semibold">SKU ID</th>
                    <th className="p-4 font-semibold">CLASSIFICATION</th>
                    <th className="p-4 font-semibold">PRICE</th>
                    <th className="p-4 font-semibold">STOCK STATUS</th>
                    <th className="p-4 text-right font-semibold">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-900 text-xs">
                  {filteredProducts.map((p) => {
                    const stock = inventory[p.id] ?? 0;
                    const isDeleting = confirmDeleteId === p.id;
                    
                    return (
                      <tr key={p.id} className="hover:bg-zinc-950 transition-colors group">
                        <td className="p-4">
                          <div className="flex items-center space-x-4">
                            <img
                              src={p.image}
                              alt={p.name}
                              referrerPolicy="no-referrer"
                              className="h-10 w-10 object-cover rounded bg-zinc-900 border border-zinc-900 shrink-0"
                            />
                            <div>
                              <h4 className="font-sans text-xs font-bold text-white uppercase tracking-tight truncate max-w-[180px] sm:max-w-xs">{p.name}</h4>
                              <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-wider">{p.sizes.join(', ')}</span>
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-mono text-zinc-500 font-semibold">{p.id}</td>
                        <td className="p-4 font-mono">
                          <span className="text-zinc-300 font-bold uppercase">{p.category}</span>
                          <span className="text-zinc-600 block text-[9px] font-bold uppercase mt-0.5">{p.collection}</span>
                        </td>
                        <td className="p-4 font-mono font-bold text-white">${p.price.toFixed(2)}</td>
                        <td className="p-4">
                          <div className="flex items-center space-x-2">
                            <span className={`font-mono font-extrabold ${stock < 15 ? 'text-rose-500' : 'text-zinc-300'}`}>{stock} UNITS</span>
                            {stock < 15 && (
                              <span className="bg-rose-950/30 border border-rose-900 text-rose-400 font-mono text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">LOW</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          {isDeleting ? (
                            <div className="inline-flex items-center space-x-3 text-[10px] font-mono">
                              <span className="text-rose-500 font-bold">DROP PIECE?</span>
                              <div className="flex space-x-1.5">
                                <button
                                  onClick={() => handleDeleteConfirm(p.id, p.name)}
                                  className="bg-rose-950 text-rose-300 border border-rose-800 hover:bg-rose-900 px-2 py-1 font-bold rounded uppercase"
                                >
                                  YES
                                </button>
                                <button
                                  onClick={() => setConfirmDeleteId(null)}
                                  className="bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800 px-2 py-1 font-bold rounded uppercase"
                                >
                                  NO
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-end space-x-2">
                              <button
                                onClick={() => onEditProductClick(p)}
                                className="p-2 bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 hover:border-white text-zinc-400 rounded transition-all"
                                title="Edit Product"
                              >
                                <Edit className="h-3.5 w-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteTrigger(p.id)}
                                className="p-2 bg-zinc-900 hover:bg-rose-950 hover:text-rose-450 border border-zinc-800 hover:border-rose-900 text-zinc-500 rounded transition-all"
                                title="Delete Product"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )
      ) : (
        <div className="text-center py-20 bg-zinc-950 border border-zinc-900 rounded-lg">
          <p className="font-mono text-zinc-500 text-sm uppercase mb-4">No matching products found in catalog</p>
          <button
            onClick={() => {
              setQuery('');
              setSelectedCategory('all');
              setSelectedCollection('all');
            }}
            className="px-5 py-2.5 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-white font-mono text-xs font-bold tracking-widest uppercase rounded cursor-pointer"
          >
            RESET ALL CONTROLS
          </button>
        </div>
      )}
    </div>
  );
}
