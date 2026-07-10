import React, { useState } from 'react';
import {
  Search,
  Receipt,
  User,
  Calendar,
  CreditCard,
  MapPin,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  Truck,
  CheckCircle,
  Clock,
  Trash2
} from 'lucide-react';
import { Order } from '../types';

interface AdminOrdersViewProps {
  orders: Order[];
  onUpdateOrderStatus: (id: string, status: Order['status']) => void;
  onCancelOrder: (id: string) => void;
  onShowToast: (msg: string) => void;
  selectedOrderFromDashboard: Order | null;
  onClearSelectedOrderFromDashboard: () => void;
}

export default function AdminOrdersView({
  orders,
  onUpdateOrderStatus,
  onCancelOrder,
  onShowToast,
  selectedOrderFromDashboard,
  onClearSelectedOrderFromDashboard
}: AdminOrdersViewProps) {
  const [query, setQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(
    selectedOrderFromDashboard ? selectedOrderFromDashboard.id : null
  );

  // If we came from the dashboard with a selected order, expand it immediately
  React.useEffect(() => {
    if (selectedOrderFromDashboard) {
      setExpandedOrderId(selectedOrderFromDashboard.id);
      onClearSelectedOrderFromDashboard();
    }
  }, [selectedOrderFromDashboard]);

  // Filtering orders
  const filteredOrders = orders.filter(ord => {
    const matchesSearch =
      ord.id.toLowerCase().includes(query.toLowerCase()) ||
      ord.shippingAddress.fullName.toLowerCase().includes(query.toLowerCase()) ||
      ord.shippingAddress.email.toLowerCase().includes(query.toLowerCase());

    const matchesStatus =
      selectedStatus === 'all' || ord.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = (orderId: string, nextStatus: Order['status']) => {
    onUpdateOrderStatus(orderId, nextStatus);
    onShowToast(`STATUS SET SUCCESSFULLY: ORDER ${orderId} IS NOW [${nextStatus.toUpperCase()}]`);
  };

  const toggleExpandOrder = (id: string) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* 1. Filtering Toolbelt */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 bg-zinc-950 border border-zinc-900 rounded-lg p-4">
        
        {/* Search */}
        <div className="relative sm:col-span-8">
          <input
            type="text"
            placeholder="SEARCH ORDERS (BY CLIENT NAME, EMAIL, ORDER ID)..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono tracking-wider text-white placeholder-zinc-500 py-3 pl-10 pr-4 focus:outline-none rounded uppercase"
          />
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        </div>

        {/* Filter Status Dropdown */}
        <div className="sm:col-span-4 flex items-center space-x-2">
          <span className="font-mono text-xs text-zinc-500 font-bold shrink-0 uppercase">STATUS:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-200 px-3 py-3 rounded focus:outline-none cursor-pointer uppercase text-xs font-mono tracking-wider"
          >
            <option value="all">ALL SHIPMENTS</option>
            <option value="Processing">PROCESSING</option>
            <option value="Shipped">SHIPPED</option>
            <option value="Delivered">DELIVERED</option>
            <option value="Cancelled">CANCELLED</option>
          </select>
        </div>

      </div>

      {/* 2. Order items cards and details */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((ord) => {
            const isExpanded = expandedOrderId === ord.id;
            
            return (
              <div
                key={ord.id}
                className={`bg-zinc-950 border rounded-lg overflow-hidden transition-all duration-300 ${
                  isExpanded ? 'border-white ring-1 ring-white/10' : 'border-zinc-900 hover:border-zinc-800'
                }`}
              >
                {/* Expandable summary header card */}
                <div
                  onClick={() => toggleExpandOrder(ord.id)}
                  className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer select-none bg-zinc-950"
                >
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-8 flex-1">
                    
                    {/* Order ID */}
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest">ORDER TRACKING ID</span>
                      <span className="font-mono text-xs font-extrabold text-white tracking-wider mt-0.5">{ord.id}</span>
                    </div>

                    {/* Customer */}
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest">CLIENT NAME</span>
                      <span className="font-sans text-xs font-bold text-zinc-300 mt-0.5 truncate uppercase">{ord.shippingAddress.fullName}</span>
                    </div>

                    {/* Date */}
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest">DATE INGESTED</span>
                      <span className="font-mono text-xs text-zinc-400 mt-0.5">{ord.date}</span>
                    </div>

                    {/* Method */}
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest">GATEWAY METHOD</span>
                      <span className="font-mono text-xs text-zinc-400 mt-0.5 uppercase">{ord.paymentMethod}</span>
                    </div>

                    {/* Grand Total */}
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest">GRAND TOTAL</span>
                      <span className="font-mono text-xs font-extrabold text-white mt-0.5">${ord.total.toFixed(2)}</span>
                    </div>

                  </div>

                  {/* Badging and indicator */}
                  <div className="flex items-center space-x-4">
                    <span
                      className={`inline-flex items-center px-2.5 py-1 rounded-sm text-[9px] font-mono font-bold uppercase tracking-widest ${
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
                    {isExpanded ? <ChevronUp className="h-4.5 w-4.5 text-zinc-500" /> : <ChevronDown className="h-4.5 w-4.5 text-zinc-500" />}
                  </div>

                </div>

                {/* Expanded Detailed view block */}
                {isExpanded && (
                  <div className="border-t border-zinc-900 bg-zinc-950/40 p-6 space-y-6 animate-slide-down">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      
                      {/* Left Block: Client address and items list (Grid-8) */}
                      <div className="md:col-span-8 space-y-6">
                        
                        {/* Line Items List */}
                        <div className="space-y-3">
                          <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">ORDER PACKING LIST ({ord.items.length} ITEMS)</span>
                          <div className="border border-zinc-900 rounded bg-zinc-950 overflow-hidden divide-y divide-zinc-900">
                            {ord.items.map((it) => (
                              <div key={`${it.productId}-${it.size}`} className="p-3 sm:p-4 flex items-center justify-between text-xs">
                                <div className="flex items-center space-x-3.5">
                                  <img
                                    src={it.image}
                                    alt={it.productName}
                                    referrerPolicy="no-referrer"
                                    className="h-12 w-12 object-cover rounded bg-zinc-900 border border-zinc-900"
                                  />
                                  <div>
                                    <h4 className="font-sans font-bold text-white uppercase tracking-tight truncate max-w-[140px] sm:max-w-xs">{it.productName}</h4>
                                    <span className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest">SIZE: {it.size}</span>
                                  </div>
                                </div>
                                <div className="text-right flex items-center space-x-6">
                                  <div className="font-mono text-zinc-500">
                                    QTY: <span className="text-white font-bold">{it.quantity}</span>
                                  </div>
                                  <div className="font-mono font-extrabold text-white text-right">
                                    ${(it.price * it.quantity).toFixed(2)}
                                    <span className="block text-[9px] font-normal text-zinc-600 uppercase mt-0.5">${it.price.toFixed(2)} EACH</span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Invoice Summary Details */}
                        <div className="grid grid-cols-2 gap-4 max-w-sm ml-auto border-t border-zinc-900 pt-4 text-xs font-mono">
                          <div className="text-zinc-500 uppercase">SUBTOTAL:</div>
                          <div className="text-right text-zinc-300 font-bold">${ord.subtotal.toFixed(2)}</div>
                          <div className="text-zinc-500 uppercase">SHIPPING DISPATCH:</div>
                          <div className="text-right text-zinc-300 font-bold">${ord.shipping.toFixed(2)}</div>
                          <div className="text-white font-bold uppercase text-[13px] pt-1">GRAND TOTAL:</div>
                          <div className="text-right text-white font-black text-[13px] pt-1">${ord.total.toFixed(2)}</div>
                        </div>

                      </div>

                      {/* Right Block: Ship-to details and Status manager (Grid-4) */}
                      <div className="md:col-span-4 space-y-6 border-t md:border-t-0 md:border-l border-zinc-900 pt-6 md:pt-0 md:pl-6">
                        
                        {/* Shipping details info */}
                        <div className="space-y-3">
                          <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">SHIPPING DISPATCH DETAILS</span>
                          <div className="space-y-2.5 text-xs">
                            <div className="flex items-start space-x-2 text-zinc-400">
                              <User className="h-4 w-4 shrink-0 text-zinc-600 mt-0.5" />
                              <div className="flex-1">
                                <span className="font-bold text-white block uppercase">{ord.shippingAddress.fullName}</span>
                                <span className="text-[11px] text-zinc-500 block truncate">{ord.shippingAddress.email}</span>
                                <span className="text-[11px] text-zinc-500 block">{ord.shippingAddress.phone}</span>
                              </div>
                            </div>
                            <div className="flex items-start space-x-2 text-zinc-400">
                              <MapPin className="h-4 w-4 shrink-0 text-zinc-600 mt-0.5" />
                              <div className="flex-1 font-sans text-zinc-300">
                                <p className="leading-snug uppercase text-[11px]">{ord.shippingAddress.address}</p>
                                <p className="leading-snug uppercase text-[11px]">{ord.shippingAddress.city}, {ord.shippingAddress.postalCode}</p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Interactive Status updating dropdown button list */}
                        <div className="space-y-3 pt-3 border-t border-zinc-900/60">
                          <span className="font-mono text-[9px] text-zinc-500 font-bold uppercase tracking-widest block">ADMIN STATUS OVERRIDE</span>
                          <div className="grid grid-cols-2 gap-2">
                            
                            {/* Processing button */}
                            <button
                              onClick={() => handleStatusChange(ord.id, 'Processing')}
                              className={`py-2 px-2.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border flex items-center justify-center space-x-1.5 transition-all ${
                                ord.status === 'Processing'
                                  ? 'bg-amber-950 border-amber-800 text-amber-300'
                                  : 'bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-white hover:border-zinc-700'
                              }`}
                            >
                              <Clock className="h-3.5 w-3.5 shrink-0" />
                              <span>PROCESS</span>
                            </button>

                            {/* Shipped button */}
                            <button
                              onClick={() => handleStatusChange(ord.id, 'Shipped')}
                              className={`py-2 px-2.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border flex items-center justify-center space-x-1.5 transition-all ${
                                ord.status === 'Shipped'
                                  ? 'bg-sky-950 border-sky-800 text-sky-300'
                                  : 'bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-white hover:border-zinc-700'
                              }`}
                            >
                              <Truck className="h-3.5 w-3.5 shrink-0" />
                              <span>SHIP</span>
                            </button>

                            {/* Delivered button */}
                            <button
                              onClick={() => handleStatusChange(ord.id, 'Delivered')}
                              className={`py-2 px-2.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border flex items-center justify-center space-x-1.5 transition-all ${
                                ord.status === 'Delivered'
                                  ? 'bg-emerald-950 border-emerald-800 text-emerald-300'
                                  : 'bg-zinc-900 border-zinc-850 text-zinc-500 hover:text-white hover:border-zinc-700'
                              }`}
                            >
                              <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                              <span>DELIVER</span>
                            </button>

                            {/* Cancel button */}
                            <button
                              disabled={ord.status === 'Cancelled'}
                              onClick={() => {
                                onCancelOrder(ord.id);
                                onShowToast(`CANCELLED CLIENT ORDER SECURELY: ${ord.id}`);
                              }}
                              className={`py-2 px-2.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider border flex items-center justify-center space-x-1.5 transition-all disabled:opacity-30 disabled:hover:bg-zinc-900 disabled:hover:text-zinc-500 ${
                                ord.status === 'Cancelled'
                                  ? 'bg-rose-950/20 border-rose-950 text-rose-550'
                                  : 'bg-zinc-900 border-zinc-850 text-zinc-550 hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-900'
                              }`}
                            >
                              <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                              <span>CANCEL</span>
                            </button>

                          </div>
                        </div>

                      </div>

                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 bg-zinc-950 border border-zinc-900 rounded-lg">
          <p className="font-mono text-zinc-500 text-sm uppercase mb-2">No matching orders found</p>
          <p className="font-mono text-zinc-700 text-[10px] uppercase">Verify query filters or check general server ingestion health</p>
        </div>
      )}

    </div>
  );
}
