import React, { useState } from 'react';
import { ShieldCheck, ArrowLeft, CreditCard, Landmark, Truck } from 'lucide-react';
import { CartItem, Order } from '../types';

interface CheckoutViewProps {
  cart: CartItem[];
  currentUser: { name: string; email: string; phone: string } | null;
  onPlaceOrder: (order: Order) => void;
  setView: (view: string) => void;
  onShowToast: (msg: string) => void;
}

export default function CheckoutView({
  cart,
  currentUser,
  onPlaceOrder,
  setView,
  onShowToast,
}: CheckoutViewProps) {
  // Contact & Shipping info
  const [email, setEmail] = useState(currentUser?.email || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [fullName, setFullName] = useState(currentUser?.name || '');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'QR Banking' | 'COD'>('QR Banking');

  // Calculations
  const subtotal = cart.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shipping = subtotal >= 150 ? 0 : 10.00;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !phone || !fullName || !address || !city || !postalCode) {
      onShowToast('PLEASE SECURELY FILL OUT ALL BILLING AND SHIPPING METRICS.');
      return;
    }

    const newOrder: Order = {
      id: `IA-${Math.floor(10000 + Math.random() * 90000)}`,
      date: new Date().toISOString().split('T')[0],
      status: 'Processing',
      items: cart.map(item => ({
        productId: item.product.id,
        productName: item.product.name,
        image: item.product.image,
        size: item.size,
        quantity: item.quantity,
        price: item.product.price,
      })),
      subtotal,
      shipping,
      total,
      shippingAddress: {
        fullName,
        email,
        phone,
        address,
        city,
        postalCode,
      },
      paymentMethod,
    };

    onPlaceOrder(newOrder);
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans pb-24">
      {/* Page Header */}
      <div className="border-b border-zinc-900 bg-zinc-950/20 py-8 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div>
            <nav className="flex space-x-2 text-xs font-mono text-zinc-500 mb-2 uppercase tracking-widest">
              <span>BAG</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-300">CHECKOUT</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase">
              SECURE CHECKOUT
            </h1>
          </div>
          <button
            onClick={() => setView('cart')}
            className="flex items-center space-x-2 text-zinc-500 hover:text-white font-mono text-xs uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">RETURN TO SELECTION</span>
          </button>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Left Column Forms (Grid-7) */}
          <div className="lg:col-span-7 space-y-10">
            
            {/* 1. Contact Information Section */}
            <div className="space-y-4">
              <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-white uppercase border-b border-zinc-900 pb-2">
                01. CONTACT DETAILS
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
                    EMAIL ADDRESS *
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@domain.com"
                    className="w-full bg-zinc-950 border border-zinc-850 px-4 h-11 text-xs text-white focus:outline-none focus:border-white rounded"
                  />
                </div>
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
                    PHONE NUMBER *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full bg-zinc-950 border border-zinc-850 px-4 h-11 text-xs text-white focus:outline-none focus:border-white rounded"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address Section */}
            <div className="space-y-4">
              <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-white uppercase border-b border-zinc-900 pb-2">
                02. SHIPPING ADDRESS
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
                    FULL NAME *
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="JOHN DOE"
                    className="w-full bg-zinc-950 border border-zinc-850 px-4 h-11 text-xs text-white focus:outline-none focus:border-white rounded uppercase"
                  />
                </div>

                <div>
                  <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
                    DELIVERY ADDRESS *
                  </label>
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 MAIN ST, SUITE 4B"
                    className="w-full bg-zinc-950 border border-zinc-850 px-4 h-11 text-xs text-white focus:outline-none focus:border-white rounded uppercase"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
                      CITY *
                    </label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="SPRINGFIELD"
                      className="w-full bg-zinc-950 border border-zinc-850 px-4 h-11 text-xs text-white focus:outline-none focus:border-white rounded uppercase"
                    />
                  </div>
                  <div>
                    <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">
                      POSTAL CODE *
                    </label>
                    <input
                      type="text"
                      required
                      value={postalCode}
                      onChange={(e) => setPostalCode(e.target.value)}
                      placeholder="97477"
                      className="w-full bg-zinc-950 border border-zinc-850 px-4 h-11 text-xs text-white focus:outline-none focus:border-white rounded uppercase"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Payment Method Section */}
            <div className="space-y-4">
              <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-white uppercase border-b border-zinc-900 pb-2">
                03. PAYMENT CONFIGURATION
              </h2>
              <div className="space-y-3">
                {/* QR Banking option */}
                <label className={`flex p-4 border rounded cursor-pointer select-none transition-all ${
                  paymentMethod === 'QR Banking'
                    ? 'bg-zinc-950/85 border-white'
                    : 'bg-transparent border-zinc-900 hover:border-zinc-800'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'QR Banking'}
                    onChange={() => setPaymentMethod('QR Banking')}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-4">
                    <div className="flex h-5 items-center">
                      <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'QR Banking' ? 'border-white' : 'border-zinc-700'
                      }`}>
                        {paymentMethod === 'QR Banking' && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Landmark className="h-4 w-4 text-white" />
                        <span className="font-mono text-xs font-bold tracking-widest uppercase">BANK TRANSFER / SCAN QR</span>
                      </div>
                      <p className="text-zinc-500 text-[11px] leading-relaxed mt-1 tracking-wide font-mono">
                        SCAN CORRESPONDING VIETQR OR RETRIEVE DETAILS DIRECTLY ON THE CONFIRMATION PAGE FOR FAST EXPEDITED PROCESSING.
                      </p>
                    </div>
                  </div>
                </label>

                {/* COD option */}
                <label className={`flex p-4 border rounded cursor-pointer select-none transition-all ${
                  paymentMethod === 'COD'
                    ? 'bg-zinc-950/85 border-white'
                    : 'bg-transparent border-zinc-900 hover:border-zinc-800'
                }`}>
                  <input
                    type="radio"
                    name="payment"
                    checked={paymentMethod === 'COD'}
                    onChange={() => setPaymentMethod('COD')}
                    className="sr-only"
                  />
                  <div className="flex items-start space-x-4">
                    <div className="flex h-5 items-center">
                      <div className={`h-4.5 w-4.5 rounded-full border flex items-center justify-center ${
                        paymentMethod === 'COD' ? 'border-white' : 'border-zinc-700'
                      }`}>
                        {paymentMethod === 'COD' && <div className="h-2 w-2 rounded-full bg-white" />}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <Truck className="h-4 w-4 text-white" />
                        <span className="font-mono text-xs font-bold tracking-widest uppercase">CASH ON DELIVERY (COD)</span>
                      </div>
                      <p className="text-zinc-500 text-[11px] leading-relaxed mt-1 tracking-wide font-mono">
                        PAY WITH REAL CURRENCY TO COURIER SERVICE ON RECEIVING THE SHIPMENT.
                      </p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column Summary Box (Grid-5) */}
          <div className="lg:col-span-5">
            <div className="border border-zinc-900 bg-zinc-950 p-6 sm:p-8 rounded-lg space-y-6 sticky top-24">
              <h2 className="font-mono text-xs font-bold tracking-[0.2em] text-white uppercase border-b border-zinc-900 pb-4">
                YOUR ORDER
              </h2>

              {/* Items List */}
              <div className="divide-y divide-zinc-900 max-h-[25vh] overflow-y-auto pr-2">
                {cart.map((item, idx) => (
                  <div key={idx} className="py-4 flex items-center justify-between text-xs">
                    <div className="flex items-center space-x-3">
                      <div className="aspect-square w-12 flex-shrink-0 overflow-hidden bg-zinc-900 rounded">
                        <img src={item.product.image} alt={item.product.name} referrerPolicy="no-referrer" className="h-full w-full object-cover object-center" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white uppercase line-clamp-1">{item.product.name}</h4>
                        <span className="text-zinc-500 font-mono text-[9px] uppercase">
                          SIZE: {item.size} • QTY: {item.quantity}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono text-zinc-300 font-bold ml-2">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Financial Breakdowns */}
              <div className="border-t border-zinc-900 pt-6 space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 uppercase">SUBTOTAL</span>
                  <span className="font-mono text-white font-bold">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 uppercase">SHIPPING</span>
                  <span className="font-mono text-white font-bold">
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-zinc-500 uppercase">ESTIMATED TAX (8%)</span>
                  <span className="font-mono text-white font-bold">${tax.toFixed(2)}</span>
                </div>
                
                {/* Total */}
                <div className="flex justify-between items-baseline pt-4 border-t border-zinc-900">
                  <span className="font-mono text-xs font-bold tracking-widest text-zinc-400 uppercase">TOTAL</span>
                  <span className="font-mono text-xl font-black text-white">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Secure Trust Badge */}
              <div className="flex items-center space-x-3 bg-zinc-900/30 p-3.5 border border-zinc-900 rounded">
                <ShieldCheck className="h-5 w-5 text-zinc-500" />
                <span className="font-mono text-[10px] tracking-wide text-zinc-400 uppercase">
                  SSL Encrypted Secure Compound Billing Pipeline.
                </span>
              </div>

              {/* Complete Order Action */}
              <button
                type="submit"
                className="w-full py-4 bg-white text-black hover:bg-zinc-200 transition-colors font-mono text-xs font-bold tracking-[0.2em] uppercase rounded flex items-center justify-center cursor-pointer"
              >
                COMPLETE ORDER
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}
