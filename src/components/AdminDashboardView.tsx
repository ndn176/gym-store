import React from 'react';
import {
  TrendingUp,
  Receipt,
  Package,
  AlertTriangle,
  ArrowUpRight,
  DollarSign,
  ShoppingBag,
  ExternalLink
} from 'lucide-react';
import { Product, Order } from '../types';

interface AdminDashboardViewProps {
  products: Product[];
  orders: Order[];
  inventory: Record<string, number>;
  onNavigateToView: (view: string) => void;
  onSelectOrder: (order: Order) => void;
}

export default function AdminDashboardView({
  products,
  orders,
  inventory,
  onNavigateToView,
  onSelectOrder
}: AdminDashboardViewProps) {
  // Dynamically compute stats
  const totalRevenue = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, curr) => acc + curr.total, 0);

  const totalOrdersCount = orders.length;

  const totalStockUnits = Object.values(inventory).reduce((acc, curr) => acc + curr, 0);

  const lowStockCount = products.filter(p => {
    const stock = inventory[p.id] ?? 0;
    return stock < 15;
  }).length;

  // Recent 4 orders
  const recentOrders = orders.slice(0, 4);

  // Low stock alert list (first 4 items)
  const lowStockAlerts = products
    .filter(p => (inventory[p.id] ?? 0) < 15)
    .map(p => ({
      id: p.id,
      name: p.name,
      stock: inventory[p.id] ?? 0,
      image: p.image
    }))
    .slice(0, 4);

  // SVG Line Chart points & labels (Mock weekly sales data)
  const chartDays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  const chartSales = [1200, 2400, 1800, 3100, 2200, 4500, 3900];
  const maxSales = Math.max(...chartSales);

  // Convert chart data to SVG points
  const width = 500;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 25;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const points = chartSales
    .map((value, idx) => {
      const x = paddingLeft + (idx / (chartSales.length - 1)) * chartWidth;
      const y = height - paddingBottom - (value / maxSales) * chartHeight;
      return `${x},${y}`;
    })
    .join(' ');

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* 1. Stats KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* KPI 1: Total Revenue */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-white scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase font-bold">TOTAL SALES REVENUE</span>
            <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <DollarSign className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
              ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>
            <div className="flex items-center space-x-1.5 mt-2">
              <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                +18.4% FROM PREV MONTH
              </span>
            </div>
          </div>
        </div>

        {/* KPI 2: Total Orders */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-zinc-400 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase font-bold">TOTAL ORDERS FILED</span>
            <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Receipt className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {totalOrdersCount}
            </span>
            <div className="flex items-center space-x-1.5 mt-2">
              <span className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                100% SECURE TRANSACTIONS
              </span>
            </div>
          </div>
        </div>

        {/* KPI 3: Stock Volume */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-zinc-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase font-bold">STOCK LEVEL UNITS</span>
            <div className="h-8 w-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center text-white">
              <Package className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className="text-2xl md:text-3xl font-black text-white tracking-tight">
              {totalStockUnits}
            </span>
            <div className="flex items-center space-x-1.5 mt-2">
              <span className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                ACROSS {products.length} CORE PIECES
              </span>
            </div>
          </div>
        </div>

        {/* KPI 4: Low Stock Warnings */}
        <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute top-0 left-0 w-1 h-full bg-rose-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-300" />
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase font-bold">LOW STOCK DETECTED</span>
            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${lowStockCount > 0 ? 'bg-rose-950/50 border border-rose-900 text-rose-500' : 'bg-zinc-900 border border-zinc-800 text-zinc-500'}`}>
              <AlertTriangle className="h-4 w-4" />
            </div>
          </div>
          <div>
            <span className={`text-2xl md:text-3xl font-black tracking-tight ${lowStockCount > 0 ? 'text-rose-500' : 'text-white'}`}>
              {lowStockCount}
            </span>
            <div className="flex items-center space-x-1.5 mt-2">
              <span className="font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                {lowStockCount > 0 ? 'REQUIRES REPLENISHMENT' : 'INVENTORY HEALTHY'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* 2. Charts and Warnings Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Weekly Revenue Line Chart (Grid-8) */}
        <div className="lg:col-span-8 bg-zinc-950 border border-zinc-900 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-6">
              <div>
                <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase font-bold">REVENUE CHART</span>
                <h3 className="font-sans text-md font-extrabold tracking-wider text-white uppercase mt-0.5">WEEKLY PERFORMANCE</h3>
              </div>
              <div className="text-right">
                <span className="font-mono text-xs font-bold text-white uppercase">$19,100.00 USD</span>
                <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">WEEKLY ACCUMULATED</p>
              </div>
            </div>

            {/* Custom SVG Line Chart */}
            <div className="relative w-full h-[180px]">
              <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-full overflow-visible">
                {/* Grid Lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
                  const y = paddingTop + ratio * chartHeight;
                  return (
                    <line
                      key={idx}
                      x1={paddingLeft}
                      y1={y}
                      x2={width - paddingRight}
                      y2={y}
                      stroke="#18181b"
                      strokeWidth="1"
                      strokeDasharray="4 4"
                    />
                  );
                })}

                {/* X-axis labels */}
                {chartDays.map((day, idx) => {
                  const x = paddingLeft + (idx / (chartDays.length - 1)) * chartWidth;
                  return (
                    <text
                      key={idx}
                      x={x}
                      y={height - 5}
                      textAnchor="middle"
                      fill="#52525b"
                      className="font-mono text-[10px] font-bold"
                    >
                      {day}
                    </text>
                  );
                })}

                {/* Y-axis labels */}
                {[0, 2000, 4000].map((val, idx) => {
                  const y = height - paddingBottom - (val / maxSales) * chartHeight;
                  return (
                    <text
                      key={idx}
                      x={paddingLeft - 8}
                      y={y + 3}
                      textAnchor="end"
                      fill="#52525b"
                      className="font-mono text-[10px] font-bold"
                    >
                      ${val}
                    </text>
                  );
                })}

                {/* Area Gradient under curve */}
                <defs>
                  <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d={`M ${paddingLeft},${height - paddingBottom} ${points.replace(/,/g, ' ')} L ${width - paddingRight},${height - paddingBottom} Z`}
                  fill="url(#chartGrad)"
                />

                {/* Line Path */}
                <polyline
                  fill="none"
                  stroke="#ffffff"
                  strokeWidth="2.5"
                  points={points}
                />

                {/* Interactive Dot indicators */}
                {chartSales.map((value, idx) => {
                  const x = paddingLeft + (idx / (chartSales.length - 1)) * chartWidth;
                  const y = height - paddingBottom - (value / maxSales) * chartHeight;
                  return (
                    <g key={idx} className="group/dot cursor-pointer">
                      <circle
                        cx={x}
                        cy={y}
                        r="4"
                        fill="#000"
                        stroke="#fff"
                        strokeWidth="2.5"
                      />
                      <circle
                        cx={x}
                        cy={y}
                        r="9"
                        fill="#fff"
                        className="opacity-0 hover:opacity-20 transition-opacity duration-150"
                      />
                      <title>{`$${value.toLocaleString()}`}</title>
                    </g>
                  );
                })}
              </svg>
            </div>
          </div>

          <div className="flex justify-between items-center border-t border-zinc-900 pt-4 mt-4 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
            <span>STABLE NETWORK INGESTION</span>
            <span className="text-white flex items-center space-x-1">
              <span className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span>LIVE SERVER</span>
            </span>
          </div>
        </div>

        {/* Critical Stock Alert Sidebar (Grid-4) */}
        <div className="lg:col-span-4 bg-zinc-950 border border-zinc-900 rounded-lg p-6 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start mb-4">
              <div>
                <span className="font-mono text-[9px] tracking-widest text-rose-500 uppercase font-bold animate-pulse">STOCK LEVEL CRITICAL</span>
                <h3 className="font-sans text-md font-extrabold tracking-wider text-white uppercase mt-0.5">REPLENISH ALERTS</h3>
              </div>
            </div>

            {lowStockAlerts.length > 0 ? (
              <div className="space-y-4 mt-4">
                {lowStockAlerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-3 rounded bg-zinc-900/50 border border-zinc-900">
                    <div className="flex items-center space-x-3">
                      <img
                        src={alert.image}
                        alt={alert.name}
                        referrerPolicy="no-referrer"
                        className="h-10 w-10 object-cover rounded bg-zinc-800"
                      />
                      <div className="max-w-[120px] sm:max-w-[160px]">
                        <h4 className="font-sans text-xs font-bold text-white truncate uppercase">{alert.name}</h4>
                        <span className="font-mono text-[9px] text-rose-400 font-bold uppercase tracking-widest">{alert.stock} ITEMS REMAINING</span>
                      </div>
                    </div>
                    <button
                      onClick={() => onNavigateToView('inventory')}
                      className="px-2.5 py-1.5 bg-rose-950 border border-rose-800 hover:bg-rose-900 text-rose-300 font-mono text-[9px] font-bold tracking-wider rounded uppercase transition-colors"
                    >
                      RESTOCK
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-zinc-500 border border-dashed border-zinc-900 rounded mt-4">
                <span className="font-mono text-xs uppercase block mb-1">ALL LEVELS SECURE</span>
                <span className="font-mono text-[9px] text-zinc-600 uppercase block">NO ALERTS TRIPPED</span>
              </div>
            )}
          </div>

          <button
            onClick={() => onNavigateToView('inventory')}
            className="w-full mt-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white font-mono text-[10px] tracking-widest uppercase rounded transition-all flex items-center justify-center space-x-1 cursor-pointer"
          >
            <span>VIEW INVENTORY HUB</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </button>
        </div>

      </div>

      {/* 3. Recent Orders Panel */}
      <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase font-bold">REAL-TIME INGEST</span>
            <h3 className="font-sans text-md font-extrabold tracking-wider text-white uppercase mt-0.5">RECENT CLIENT ORDERS</h3>
          </div>
          <button
            onClick={() => onNavigateToView('orders')}
            className="group flex items-center space-x-1.5 text-zinc-500 hover:text-white font-mono text-[10px] tracking-widest uppercase transition-colors cursor-pointer"
          >
            <span>VIEW ALL ORDERS</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-zinc-900 text-[10px] font-mono text-zinc-500 uppercase tracking-wider">
                <th className="pb-3 font-semibold">ORDER ID</th>
                <th className="pb-3 font-semibold">CLIENT</th>
                <th className="pb-3 font-semibold">DATE</th>
                <th className="pb-3 font-semibold">METHOD</th>
                <th className="pb-3 font-semibold">TOTAL</th>
                <th className="pb-3 font-semibold">STATUS</th>
                <th className="pb-3 text-right font-semibold">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-900 text-xs">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-zinc-950 transition-colors group">
                  <td className="py-4 font-mono font-bold text-white tracking-wider">
                    {ord.id}
                  </td>
                  <td className="py-4 font-sans text-zinc-300">
                    {ord.shippingAddress.fullName}
                  </td>
                  <td className="py-4 font-mono text-zinc-500">
                    {ord.date}
                  </td>
                  <td className="py-4 font-mono text-zinc-500">
                    {ord.paymentMethod}
                  </td>
                  <td className="py-4 font-mono font-bold text-white">
                    ${ord.total.toFixed(2)}
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-sm text-[9px] font-mono font-bold uppercase tracking-wider ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-950/40 border border-emerald-900 text-emerald-400'
                          : ord.status === 'Cancelled'
                          ? 'bg-zinc-900 border border-zinc-800 text-zinc-500'
                          : ord.status === 'Shipped'
                          ? 'bg-sky-950/40 border border-sky-900 text-sky-400'
                          : 'bg-amber-950/40 border border-amber-900 text-amber-400'
                      }`}
                    >
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-4 text-right">
                    <button
                      onClick={() => onSelectOrder(ord)}
                      className="px-3 py-1.5 bg-zinc-900 hover:bg-white hover:text-black border border-zinc-800 hover:border-white text-zinc-400 font-mono text-[10px] tracking-wider uppercase rounded transition-all cursor-pointer"
                    >
                      INSPECT
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
