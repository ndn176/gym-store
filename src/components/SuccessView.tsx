import React from 'react';
import { Check, QrCode, ClipboardCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Order } from '../types';

interface SuccessViewProps {
  order: Order | null;
  setView: (view: string) => void;
  setAccountSubTab: (tab: 'profile' | 'orders') => void;
}

export default function SuccessView({ order, setView, setAccountSubTab }: SuccessViewProps) {
  if (!order) {
    return (
      <div className="bg-black text-white min-h-[70vh] flex flex-col items-center justify-center text-center font-sans">
        <p className="text-zinc-500 font-mono text-xs uppercase tracking-widest">No Active Order Selected</p>
        <button onClick={() => setView('shop')} className="mt-4 px-6 py-2.5 bg-white text-black font-mono text-xs uppercase font-bold tracking-wider rounded">
          GO TO SHOP
        </button>
      </div>
    );
  }

  const handleGoToHistory = () => {
    setAccountSubTab('orders');
    setView('account');
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans pb-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        
        {/* Dynamic Success Icon */}
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500 mb-8">
          <Check className="h-8 w-8 text-emerald-400" />
        </div>

        <span className="font-mono text-xs tracking-[0.4em] text-emerald-400 uppercase">
          ORDER PLACED SUCCESSFULLY
        </span>
        <h1 className="text-4xl md:text-5xl font-black tracking-tight text-white uppercase mt-3 mb-4">
          THANK YOU FOR YOUR ORDER
        </h1>
        <p className="text-zinc-500 text-xs md:text-sm tracking-wide font-mono uppercase mb-12">
          ORDER REFERENCE: <span className="text-white font-bold">{order.id}</span> • CONFIRMATION SENT TO {order.shippingAddress.email}
        </p>

        {/* Order Details Accordion Box */}
        <div className="border border-zinc-900 bg-zinc-950 p-6 sm:p-8 rounded-lg text-left mb-10 space-y-6">
          <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-white uppercase border-b border-zinc-900 pb-3">
            DELIVERY SUMMARY
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs md:text-sm">
            <div>
              <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">RECIPIENT & ADDRESS</span>
              <p className="text-white font-bold uppercase">{order.shippingAddress.fullName}</p>
              <p className="text-zinc-400 uppercase mt-0.5">{order.shippingAddress.address}</p>
              <p className="text-zinc-400 uppercase">{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            </div>
            <div>
              <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">DELIVERY METRICS</span>
              <p className="text-white font-bold uppercase">STANDARD ATHLETIC COURIER</p>
              <p className="text-zinc-500 font-mono text-[10px] uppercase mt-0.5">ESTIMATED TIME: 3 - 5 WORK DAYS</p>
              <p className="text-zinc-400 uppercase mt-2">PAYMENT: <span className="text-white font-bold">{order.paymentMethod}</span></p>
            </div>
          </div>

          <div className="border-t border-zinc-900 pt-6">
            <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-3">ORDER SUB-TOTALS</span>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-zinc-500">ITEMS TOTAL:</span>
                <span className="text-white">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-500">SHIPPING:</span>
                <span className="text-white">{order.shipping === 0 ? 'FREE' : `$${order.shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm border-t border-zinc-900 pt-3">
                <span className="text-zinc-400 font-bold">TOTAL BILLED:</span>
                <span className="text-white font-bold">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scan to Pay (Only for QR Banking) */}
        {order.paymentMethod === 'QR Banking' && (
          <div className="border border-zinc-900 bg-zinc-950 p-6 sm:p-8 rounded-lg text-left mb-12 flex flex-col md:flex-row items-center space-y-6 md:space-y-0 md:space-x-8">
            {/* Visual QR code mockup */}
            <div className="aspect-square w-40 bg-white p-3 rounded flex flex-col items-center justify-center shadow-lg relative shrink-0">
              {/* Fake QR bars */}
              <div className="w-full h-full border-[3px] border-black flex flex-col justify-between p-1.5 relative">
                <div className="flex justify-between">
                  <div className="w-7 h-7 border-4 border-black" />
                  <div className="w-7 h-7 border-4 border-black" />
                </div>
                <div className="absolute inset-4 border border-black/25 flex flex-col justify-around p-1">
                  <div className="grid grid-cols-4 gap-1">
                    {[...Array(16)].map((_, i) => (
                      <div key={i} className={`h-2.5 w-2.5 ${Math.random() > 0.4 ? 'bg-black' : 'bg-transparent'}`} />
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="w-7 h-7 border-4 border-black" />
                  <span className="font-mono text-[7px] text-black font-extrabold tracking-tight">VIETQR</span>
                </div>
              </div>
            </div>

            {/* Account Details text */}
            <div className="flex-1 space-y-4">
              <div>
                <span className="font-mono text-[9px] tracking-[0.2em] text-emerald-400 uppercase font-bold">SCAN TO COMPLETE TRANSACTION</span>
                <h3 className="text-md font-bold uppercase mt-1">FAST BANK REMITTANCE CREDENTIALS</h3>
              </div>
              
              <div className="space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500">BANK PARTNER:</span>
                  <span className="text-white font-bold">AESTHETIC BANK CORP</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500">ACCOUNT NUMBER:</span>
                  <span className="text-white font-bold select-all">888-AESTHETIC-999</span>
                </div>
                <div className="flex justify-between border-b border-zinc-900 pb-1.5">
                  <span className="text-zinc-500">EXACT AMOUNT:</span>
                  <span className="text-emerald-400 font-bold">${order.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between pb-1.5">
                  <span className="text-zinc-500">TRANSFER MESSAGE:</span>
                  <span className="text-white font-bold bg-zinc-900 px-2 py-0.5 rounded select-all">{order.id}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2 text-[10px] text-zinc-500 font-mono">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>SYSTEM AWAITING DEPOSIT NOTIFICATION...</span>
              </div>
            </div>
          </div>
        )}

        {/* Control Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={handleGoToHistory}
            className="w-full sm:w-auto px-8 py-4 border border-zinc-800 hover:border-zinc-600 text-zinc-400 hover:text-white transition-colors font-mono text-xs tracking-widest uppercase rounded cursor-pointer"
          >
            VIEW ORDER HISTORY
          </button>
          
          <button
            onClick={() => setView('shop')}
            className="w-full sm:w-auto px-8 py-4 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-xs font-bold tracking-widest uppercase rounded flex items-center justify-center space-x-2 cursor-pointer"
          >
            <span>CONTINUE SHOPPING</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
