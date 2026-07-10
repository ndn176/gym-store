import React, { useState } from 'react';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from 'lucide-react';
import { CartItem } from '../types';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (productId: string, size: string, quantity: number) => void;
  onRemoveItem: (productId: string, size: string) => void;
  onCheckout: () => void;
  setView: (view: string) => void;
}

export default function CartView({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  setView,
}: CartViewProps) {
  const [promoCode, setPromoCode] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(false);
  const [promoError, setPromoError] = useState('');

  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal === 0 ? 0 : subtotal >= 150 ? 0 : 10.00;
  const tax = subtotal * 0.08;
  const discount = appliedPromo ? subtotal * 0.10 : 0; // 10% discount
  const total = subtotal - discount + shipping + tax;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toUpperCase() === 'AESTHETIC10') {
      setAppliedPromo(true);
      setPromoError('');
    } else {
      setPromoError('INVALID PROMO CODE');
      setAppliedPromo(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="bg-black text-white min-h-[70vh] flex flex-col items-center justify-center font-sans px-4">
        <ShoppingBag className="h-16 w-16 text-zinc-800 mb-6" />
        <h2 className="text-2xl font-black uppercase tracking-wider text-white mb-2">
          YOUR BAG IS EMPTY
        </h2>
        <p className="text-zinc-500 text-xs tracking-wide uppercase mb-8 text-center max-w-sm font-mono">
          THERE ARE CURRENTLY NO PIECES REGISTERED IN YOUR SELECTION.
        </p>
        <button
          onClick={() => setView('shop')}
          className="px-8 py-3.5 bg-white text-black font-mono text-xs font-bold tracking-[0.2em] uppercase hover:bg-zinc-200 transition-colors cursor-pointer rounded"
        >
          START EXPLORING
        </button>
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen font-sans pb-24">
      {/* Page Header */}
      <div className="border-b border-zinc-900 bg-zinc-950/20 py-8 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-2 text-xs font-mono text-zinc-500 mb-4 uppercase tracking-widest">
            <span>HOME</span>
            <span className="text-zinc-700">/</span>
            <span className="text-zinc-300">YOUR CART</span>
          </nav>
          <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase">
            YOUR SELECTION ({cart.reduce((sum, item) => sum + item.quantity, 0)})
          </h1>
        </div>
      </div>

      {/* Main Grid content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Cart Items List Column */}
          <div className="lg:col-span-8 space-y-6">
            <div className="border-b border-zinc-900 pb-3 hidden md:grid grid-cols-12 text-[10px] font-mono tracking-widest text-zinc-500 uppercase">
              <span className="col-span-6">PRODUCT DETAILS</span>
              <span className="col-span-2 text-center">SIZE</span>
              <span className="col-span-2 text-center">QUANTITY</span>
              <span className="col-span-2 text-right">TOTAL</span>
            </div>

            <div className="divide-y divide-zinc-900">
              {cart.map((item, idx) => (
                <div key={`${item.product.id}-${item.size}`} className="py-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                  
                  {/* Left Side: Thumbnail & Title */}
                  <div className="col-span-6 flex items-center space-x-4">
                    <div className="aspect-square w-20 flex-shrink-0 overflow-hidden bg-zinc-900 rounded border border-zinc-900">
                      <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="h-full w-full object-cover object-center" />
                    </div>
                    <div>
                      <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">{item.product.category}</span>
                      <h3 className="font-bold text-sm text-white hover:text-zinc-300 transition-colors uppercase leading-tight">{item.product.name}</h3>
                      <div className="flex md:hidden items-center space-x-3 mt-1 text-xs text-zinc-400">
                        <span>SIZE: {item.size}</span>
                        <span>•</span>
                        <span>PRICE: ${item.product.price.toFixed(2)}</span>
                      </div>
                      <button
                        onClick={() => onRemoveItem(item.product.id, item.size)}
                        className="flex items-center space-x-1.5 text-zinc-600 hover:text-red-500 mt-2 text-[10px] font-mono tracking-wider uppercase transition-colors"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                        <span>REMOVE</span>
                      </button>
                    </div>
                  </div>

                  {/* Size Col */}
                  <div className="hidden md:flex col-span-2 justify-center">
                    <span className="font-mono text-xs tracking-widest font-bold bg-zinc-950 px-3 py-1.5 border border-zinc-900 rounded uppercase">{item.size}</span>
                  </div>

                  {/* Quantity Col */}
                  <div className="col-span-2 flex justify-start md:justify-center">
                    <div className="flex items-center border border-zinc-900 bg-zinc-950 h-9 px-1.5 rounded">
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.size, Math.max(item.quantity - 1, 1))}
                        className="p-1 text-zinc-500 hover:text-white"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="font-mono text-xs font-bold text-center w-8 text-white">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="p-1 text-zinc-500 hover:text-white"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  {/* Price Col */}
                  <div className="col-span-2 text-left md:text-right">
                    <span className="font-mono text-sm text-white font-bold block">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                    {item.quantity > 1 && (
                      <span className="font-mono text-[9px] text-zinc-600 block mt-0.5">
                        (${item.product.price.toFixed(2)} EACH)
                      </span>
                    )}
                  </div>

                </div>
              ))}
            </div>

            <button
              onClick={() => setView('shop')}
              className="font-mono text-xs tracking-widest text-zinc-400 hover:text-white mt-8 underline cursor-pointer"
            >
              CONTINUE SHOPPING
            </button>
          </div>

          {/* Right Summary Column */}
          <div className="lg:col-span-4">
            <div className="border border-zinc-900 bg-zinc-950 p-6 md:p-8 rounded-lg space-y-6">
              <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-white uppercase border-b border-zinc-900 pb-4">
                ORDER SUMMARY
              </h2>

              <div className="space-y-4 border-b border-zinc-900 pb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">SUBTOTAL</span>
                  <span className="font-mono text-white font-bold">${subtotal.toFixed(2)}</span>
                </div>
                {appliedPromo && (
                  <div className="flex justify-between text-sm text-emerald-500">
                    <span>PROMO DISCOUNT (10%)</span>
                    <span className="font-mono font-bold">-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">SHIPPING</span>
                  <span className="font-mono text-white font-bold">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500">ESTIMATED TAX (8%)</span>
                  <span className="font-mono text-white font-bold">${tax.toFixed(2)}</span>
                </div>
              </div>

              {/* Total Row */}
              <div className="flex justify-between items-baseline pt-2">
                <span className="font-mono text-xs font-bold tracking-widest text-zinc-400 uppercase">TOTAL</span>
                <span className="font-mono text-2xl font-black text-white">${total.toFixed(2)}</span>
              </div>

              {shipping > 0 && (
                <div className="bg-zinc-900/40 border border-zinc-900 p-3 rounded text-[11px] text-zinc-400 leading-relaxed font-mono">
                  ADD <span className="font-bold text-white">${(150 - subtotal).toFixed(2)}</span> MORE TO ELIGIBLE SELECTIONS TO UNLOCK <span className="text-white font-bold">FREE SHIPPING</span>.
                </div>
              )}

              {/* Promo Form */}
              <form onSubmit={handleApplyPromo} className="pt-4 border-t border-zinc-900">
                <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-2">
                  ENTER PROMO CODE (Try: AESTHETIC10)
                </label>
                <div className="flex border border-zinc-800 focus-within:border-zinc-500 transition-colors h-10 rounded overflow-hidden bg-black">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="PROMO CODE"
                    disabled={appliedPromo}
                    className="w-full bg-transparent px-3 text-xs uppercase focus:outline-none text-white placeholder-zinc-700"
                  />
                  <button
                    type="submit"
                    disabled={appliedPromo}
                    className="bg-zinc-900 hover:bg-zinc-800 disabled:bg-zinc-950 px-4 text-xs font-mono font-bold tracking-wider hover:text-white uppercase disabled:text-zinc-600 transition-colors border-l border-zinc-800"
                  >
                    APPLY
                  </button>
                </div>
                {appliedPromo && (
                  <p className="text-[10px] font-mono text-emerald-500 uppercase mt-2">Code AESTHETIC10 applied successfully!</p>
                )}
                {promoError && (
                  <p className="text-[10px] font-mono text-red-500 uppercase mt-2">{promoError}</p>
                )}
              </form>

              {/* Checkout Trigger */}
              <button
                onClick={onCheckout}
                className="w-full py-4 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-xs font-bold tracking-[0.2em] uppercase rounded flex items-center justify-center space-x-2 cursor-pointer"
              >
                <span>PROCEED TO CHECKOUT</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
