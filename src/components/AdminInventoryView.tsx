import React, { useState } from 'react';
import {
  Package,
  Search,
  Plus,
  Minus,
  AlertTriangle,
  Check,
  TrendingDown,
  DollarSign,
  Boxes
} from 'lucide-react';
import { Product } from '../types';

interface AdminInventoryViewProps {
  products: Product[];
  inventory: Record<string, number>;
  onUpdateStock: (productId: string, nextStock: number) => void;
  onShowToast: (msg: string) => void;
}

export default function AdminInventoryView({
  products,
  inventory,
  onUpdateStock,
  onShowToast
}: AdminInventoryViewProps) {
  const [query, setQuery] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'low' | 'healthy'>('all');

  // Direct editing input cache states
  const [editingInputId, setEditingInputId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<string>('');

  // Computations
  const totalStockUnits = Object.values(inventory).reduce((acc, curr) => acc + curr, 0);
  
  const totalInventoryValue = products.reduce((acc, p) => {
    const stock = inventory[p.id] ?? 0;
    return acc + (p.price * stock);
  }, 0);

  const lowStockCount = products.filter(p => (inventory[p.id] ?? 0) < 15).length;

  // Filter items
  const filteredProducts = products.filter(p => {
    const stock = inventory[p.id] ?? 0;
    
    const matchesSearch =
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.id.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase());

    const matchesFilter =
      filterMode === 'all' ||
      (filterMode === 'low' && stock < 15) ||
      (filterMode === 'healthy' && stock >= 15);

    return matchesSearch && matchesFilter;
  });

  // Action: Simple Increments
  const handleAdjustValue = (id: string, name: string, delta: number) => {
    const currentStock = inventory[id] ?? 0;
    const nextStock = Math.max(0, currentStock + delta);
    onUpdateStock(id, nextStock);
    
    if (nextStock < currentStock) {
      onShowToast(`DECREMENTED INVENTORY STOCK: [${name.toUpperCase()}] SET TO ${nextStock} UNITS`);
    } else {
      onShowToast(`INCREMENTED INVENTORY STOCK: [${name.toUpperCase()}] SET TO ${nextStock} UNITS`);
    }
  };

  // Action: Direct Text Overrides
  const startEditing = (id: string, currentStock: number) => {
    setEditingInputId(id);
    setTempStockValue(currentStock.toString());
  };

  const saveEditingValue = (id: string, name: string) => {
    const parsed = parseInt(tempStockValue);
    const finalValue = isNaN(parsed) || parsed < 0 ? 0 : parsed;
    onUpdateStock(id, finalValue);
    setEditingInputId(null);
    onShowToast(`MANUAL OVERRIDE APPLIED: [${name.toUpperCase()}] FORCED TO ${finalValue} UNITS`);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Dashboard summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        
        {/* Total Stock units */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 flex items-center space-x-4">
          <div className="h-11 w-11 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
            <Boxes className="h-5 w-5" />
          </div>
          <div>
            <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">TOTAL ASSETS ACCUMULATED</span>
            <span className="text-xl md:text-2xl font-black text-white tracking-tight block mt-0.5">{totalStockUnits} UNITS</span>
          </div>
        </div>

        {/* Combined Value */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 flex items-center space-x-4">
          <div className="h-11 w-11 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white shrink-0">
            <DollarSign className="h-5 w-5" />
          </div>
          <div>
            <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">COMBINED ASSETS CAPITAL</span>
            <span className="text-xl md:text-2xl font-black text-white tracking-tight block mt-0.5">
              ${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USD
            </span>
          </div>
        </div>

        {/* Low Stock Items */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 flex items-center space-x-4">
          <div className={`h-11 w-11 rounded-full flex items-center justify-center shrink-0 ${lowStockCount > 0 ? 'bg-rose-950/40 border border-rose-900 text-rose-400 animate-pulse' : 'bg-zinc-900 border border-zinc-800 text-zinc-500'}`}>
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div>
            <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">STOCK REPLENISH ALERTS</span>
            <span className={`text-xl md:text-2xl font-black tracking-tight block mt-0.5 ${lowStockCount > 0 ? 'text-rose-500' : 'text-white'}`}>{lowStockCount} ARTIFACTS</span>
          </div>
        </div>

      </div>

      {/* 2. Controls Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-950 border border-zinc-900 rounded-lg p-4">
        
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            placeholder="SEARCH STOCK INVENTORY (NAME, ID, CATEGORY)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono tracking-wider text-white placeholder-zinc-500 py-3 pl-10 pr-4 focus:outline-none rounded uppercase"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        </div>

        {/* Segment switches */}
        <div className="flex items-center space-x-2 font-mono text-[10px] uppercase font-bold text-zinc-400">
          <button
            onClick={() => setFilterMode('all')}
            className={`px-3 py-2 rounded border transition-all ${
              filterMode === 'all'
                ? 'bg-white text-black border-white shadow-md'
                : 'bg-zinc-900 border-zinc-850 hover:text-white hover:border-zinc-700'
            }`}
          >
            ALL ITEMS ({products.length})
          </button>
          <button
            onClick={() => setFilterMode('low')}
            className={`px-3 py-2 rounded border transition-all ${
              filterMode === 'low'
                ? 'bg-rose-950/50 border-rose-800 text-rose-300'
                : 'bg-zinc-900 border-zinc-850 hover:text-white hover:border-zinc-700'
            }`}
          >
            LOW STOCK ({lowStockCount})
          </button>
          <button
            onClick={() => setFilterMode('healthy')}
            className={`px-3 py-2 rounded border transition-all ${
              filterMode === 'healthy'
                ? 'bg-emerald-950/40 border-emerald-900 text-emerald-400'
                : 'bg-zinc-900 border-zinc-850 hover:text-white hover:border-zinc-700'
            }`}
          >
            SECURE STOCK ({products.length - lowStockCount})
          </button>
        </div>

      </div>

      {/* 3. Inventory Table Grid */}
      {filteredProducts.length > 0 ? (
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-zinc-900 text-[10px] font-mono text-zinc-500 uppercase tracking-wider bg-zinc-950/40">
                  <th className="p-4 font-semibold">GARMENT ARTIFACT</th>
                  <th className="p-4 font-semibold">SKU CODE</th>
                  <th className="p-4 font-semibold">UNIT PRICE</th>
                  <th className="p-4 font-semibold">LIVE STOCK COUNT</th>
                  <th className="p-4 font-semibold">TOTAL ASSET VALUE</th>
                  <th className="p-4 text-right font-semibold">ADJUSTMENTS</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-xs">
                {filteredProducts.map((p) => {
                  const stock = inventory[p.id] ?? 0;
                  const isLow = stock < 15;
                  const totalValue = p.price * stock;
                  const isEditingDirect = editingInputId === p.id;
                  
                  return (
                    <tr key={p.id} className="hover:bg-zinc-950/50 transition-colors group">
                      {/* Product details */}
                      <td className="p-4">
                        <div className="flex items-center space-x-3.5">
                          <img
                            src={p.image}
                            alt={p.name}
                            referrerPolicy="no-referrer"
                            className="h-10 w-10 object-cover rounded bg-zinc-900 border border-zinc-900 shrink-0"
                          />
                          <div>
                            <h4 className="font-sans text-xs font-bold text-white uppercase tracking-tight truncate max-w-[180px] sm:max-w-xs">{p.name}</h4>
                            <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">{p.category}</span>
                          </div>
                        </div>
                      </td>

                      {/* SKU */}
                      <td className="p-4 font-mono text-zinc-500 font-semibold">{p.id}</td>

                      {/* Unit Price */}
                      <td className="p-4 font-mono font-bold text-zinc-350">${p.price.toFixed(2)}</td>

                      {/* Live Stock Count */}
                      <td className="p-4">
                        <div className="flex items-center space-x-2">
                          {isEditingDirect ? (
                            <div className="flex items-center space-x-1.5">
                              <input
                                type="number"
                                min="0"
                                value={tempStockValue}
                                onChange={(e) => setTempStockValue(e.target.value)}
                                className="w-16 bg-zinc-900 border border-zinc-750 focus:border-white font-mono text-xs text-white p-1 focus:outline-none rounded text-center"
                                autoFocus
                              />
                              <button
                                onClick={() => saveEditingValue(p.id, p.name)}
                                className="p-1 bg-emerald-950 border border-emerald-800 text-emerald-400 rounded hover:bg-emerald-900 transition-all"
                                title="Save Value"
                              >
                                <Check className="h-3 w-3" />
                              </button>
                            </div>
                          ) : (
                            <button
                              onClick={() => startEditing(p.id, stock)}
                              className={`font-mono font-extrabold hover:underline text-left select-text cursor-pointer ${isLow ? 'text-rose-500 font-black' : 'text-zinc-200'}`}
                              title="Click to manually edit number"
                            >
                              {stock} UNITS
                            </button>
                          )}
                          
                          {isLow && (
                            <span className="bg-rose-950/40 border border-rose-900 text-rose-400 font-mono text-[8px] font-bold px-1.5 py-0.5 rounded uppercase">CRITICAL</span>
                          )}
                        </div>
                      </td>

                      {/* Asset value */}
                      <td className="p-4 font-mono font-extrabold text-white">${totalValue.toFixed(2)}</td>

                      {/* Increments controls */}
                      <td className="p-4 text-right">
                        <div className="inline-flex items-center border border-zinc-900 bg-zinc-950 h-9 p-1 rounded">
                          <button
                            onClick={() => handleAdjustValue(p.id, p.name, -10)}
                            className="px-2 text-[10px] font-mono text-zinc-600 hover:text-white border-r border-zinc-900"
                            title="Decrement by 10"
                          >
                            -10
                          </button>
                          <button
                            onClick={() => handleAdjustValue(p.id, p.name, -1)}
                            className="p-1.5 text-zinc-400 hover:text-white"
                            title="Decrement by 1"
                          >
                            <Minus className="h-3.5 w-3.5" />
                          </button>
                          <div className="w-9 font-mono text-xs font-bold text-center text-white">
                            {stock}
                          </div>
                          <button
                            onClick={() => handleAdjustValue(p.id, p.name, 1)}
                            className="p-1.5 text-zinc-400 hover:text-white"
                            title="Increment by 1"
                          >
                            <Plus className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleAdjustValue(p.id, p.name, 10)}
                            className="px-2 text-[10px] font-mono text-zinc-600 hover:text-white border-l border-zinc-900"
                            title="Increment by 10"
                          >
                            +10
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-950 border border-zinc-900 rounded-lg">
          <p className="font-mono text-zinc-500 text-sm uppercase">No assets matched current query filters</p>
        </div>
      )}

    </div>
  );
}
