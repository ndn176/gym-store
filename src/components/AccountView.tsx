import React, { useState } from 'react';
import { User, ClipboardList, Shield, CreditCard, ChevronRight, Check, AlertCircle, X } from 'lucide-react';
import { Order, UserProfile } from '../types';

interface AccountViewProps {
  orders: Order[];
  onCancelOrder: (orderId: string) => void;
  currentUser: UserProfile;
  onUpdateUser: (profile: UserProfile) => void;
  onLogout: () => void;
  subTab: 'profile' | 'orders';
  setSubTab: (tab: 'profile' | 'orders') => void;
}

export default function AccountView({
  orders,
  onCancelOrder,
  currentUser,
  onUpdateUser,
  onLogout,
  subTab,
  setSubTab,
}: AccountViewProps) {
  // Local profile edits
  const [profileName, setProfileName] = useState(currentUser.name);
  const [profileEmail, setProfileEmail] = useState(currentUser.email);
  const [profilePhone, setProfilePhone] = useState(currentUser.phone);
  const [profileBday, setProfileBday] = useState(currentUser.birthday);
  const [profileGender, setProfileGender] = useState(currentUser.gender);
  
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<string | null>(null);
  
  // Cancel modal states
  const [cancellingOrderId, setCancellingOrderId] = useState<string | null>(null);

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateUser({
      name: profileName,
      email: profileEmail,
      phone: profilePhone,
      birthday: profileBday,
      gender: profileGender,
    });
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const triggerCancelConfirm = (orderId: string) => {
    setCancellingOrderId(orderId);
  };

  const confirmCancel = () => {
    if (cancellingOrderId) {
      onCancelOrder(cancellingOrderId);
      setCancellingOrderId(null);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans pb-24">
      {/* Header banner */}
      <div className="border-b border-zinc-900 bg-zinc-950/20 py-8 mb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-end">
          <div>
            <nav className="flex space-x-2 text-xs font-mono text-zinc-500 mb-2 uppercase tracking-widest">
              <span>MEMBER PROFILE</span>
              <span className="text-zinc-700">/</span>
              <span className="text-zinc-300 uppercase">{subTab === 'profile' ? 'PERSONAL INFO' : 'ORDER ARCHIVE'}</span>
            </nav>
            <h1 className="text-3xl font-black tracking-tight text-white uppercase">
              ATHLETE WORKSPACE
            </h1>
          </div>
          <button
            onClick={onLogout}
            className="mt-4 sm:mt-0 px-4 py-2 border border-zinc-850 hover:border-zinc-700 text-zinc-500 hover:text-white font-mono text-xs uppercase tracking-wider rounded transition-all cursor-pointer"
          >
            LOG OUT OF PROFILE
          </button>
        </div>
      </div>

      {/* Main Container Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Navigation Drawer Sidebar (Grid-3) */}
          <div className="lg:col-span-3 space-y-2">
            <button
              onClick={() => setSubTab('profile')}
              className={`w-full flex items-center space-x-3.5 px-4 py-3.5 rounded text-left font-mono text-xs font-semibold tracking-wider uppercase transition-all ${
                subTab === 'profile' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
              }`}
            >
              <User className="h-4.5 w-4.5" />
              <span>PERSONAL PROFILE</span>
            </button>
            
            <button
              onClick={() => setSubTab('orders')}
              className={`w-full flex items-center space-x-3.5 px-4 py-3.5 rounded text-left font-mono text-xs font-semibold tracking-wider uppercase transition-all ${
                subTab === 'orders' ? 'bg-white text-black font-bold' : 'text-zinc-400 hover:text-white hover:bg-zinc-900/40'
              }`}
            >
              <ClipboardList className="h-4.5 w-4.5" />
              <span>ORDER ARCHIVE ({orders.length})</span>
            </button>
          </div>

          {/* Core Content Box (Grid-9) */}
          <div className="lg:col-span-9 bg-zinc-950 border border-zinc-900 p-6 sm:p-10 rounded-lg">
            
            {/* TAB 1: Profile Editor */}
            {subTab === 'profile' && (
              <form onSubmit={handleProfileSave} className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wide">PERSONAL INFORMATION</h2>
                  <p className="text-zinc-500 text-xs mt-1 font-mono uppercase tracking-wider">Configure your profile credentials for seamless checkout and early drops.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">FULL ATHLETE NAME</label>
                    <input
                      type="text"
                      required
                      value={profileName}
                      onChange={(e) => setProfileName(e.target.value)}
                      className="w-full bg-black border border-zinc-850 px-4 h-11 text-xs text-white focus:outline-none focus:border-white rounded uppercase"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">EMAIL ADDRESS</label>
                    <input
                      type="email"
                      required
                      value={profileEmail}
                      onChange={(e) => setProfileEmail(e.target.value)}
                      className="w-full bg-black border border-zinc-850 px-4 h-11 text-xs text-white focus:outline-none focus:border-white rounded"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">CONTACT MOBILE</label>
                    <input
                      type="tel"
                      required
                      value={profilePhone}
                      onChange={(e) => setProfilePhone(e.target.value)}
                      className="w-full bg-black border border-zinc-850 px-4 h-11 text-xs text-white focus:outline-none focus:border-white rounded"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">DATE OF BIRTH</label>
                    <input
                      type="date"
                      required
                      value={profileBday}
                      onChange={(e) => setProfileBday(e.target.value)}
                      className="w-full bg-black border border-zinc-850 px-4 h-11 text-xs text-white focus:outline-none focus:border-white rounded uppercase"
                    />
                  </div>

                  <div>
                    <label className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block mb-1">GENDER CLASSIFICATION</label>
                    <select
                      value={profileGender}
                      onChange={(e) => setProfileGender(e.target.value)}
                      className="w-full bg-black border border-zinc-850 px-4 h-11 text-xs text-white focus:outline-none focus:border-white rounded uppercase cursor-pointer"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Unspecified">Unspecified / Non-Binary</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 border-t border-zinc-900 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Shield className="h-4 w-4 text-zinc-500" />
                    <span className="font-mono text-[9px] tracking-wider text-zinc-500 uppercase">Data protected by standard decentralized firewalls.</span>
                  </div>

                  <button
                    type="submit"
                    className={`px-6 py-3 font-mono text-xs font-bold tracking-widest uppercase transition-colors rounded cursor-pointer ${
                      saveSuccess ? 'bg-emerald-600 text-white' : 'bg-white text-black hover:bg-zinc-200'
                    }`}
                  >
                    {saveSuccess ? (
                      <span className="flex items-center space-x-1">
                        <Check className="h-4 w-4" />
                        <span>CHANGES SAVED</span>
                      </span>
                    ) : (
                      'SAVE CHANGES'
                    )}
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: Order Archive */}
            {subTab === 'orders' && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-xl font-bold uppercase tracking-wide">ORDER ARCHIVE</h2>
                  <p className="text-zinc-500 text-xs mt-1 font-mono uppercase tracking-wider">Browse previous equipment deliveries and ongoing processing drops.</p>
                </div>

                {orders.length > 0 ? (
                  <div className="space-y-6">
                    {orders.map((ord) => {
                      const isDetailOpen = selectedOrderDetail === ord.id;
                      const canCancel = ord.status === 'Processing';
                      
                      return (
                        <div key={ord.id} className="border border-zinc-900 rounded-lg overflow-hidden bg-black/40">
                          {/* Order Main Row */}
                          <div className="p-5 sm:p-6 grid grid-cols-2 md:grid-cols-5 gap-4 items-center">
                            <div>
                              <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block">ORDER REF</span>
                              <span className="font-bold text-sm text-white">{ord.id}</span>
                            </div>

                            <div>
                              <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block">DATE PLACED</span>
                              <span className="font-mono text-xs text-zinc-300">{ord.date}</span>
                            </div>

                            <div>
                              <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block">STATUS STATUS</span>
                              <span className={`inline-block font-mono text-[9px] font-bold tracking-wider uppercase px-2 py-0.5 rounded ${
                                ord.status === 'Delivered' ? 'bg-zinc-900 text-zinc-400 border border-zinc-800' :
                                ord.status === 'Processing' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
                                ord.status === 'Cancelled' ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
                                'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              }`}>
                                {ord.status}
                              </span>
                            </div>

                            <div>
                              <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase block">TOTAL BILLED</span>
                              <span className="font-mono text-sm text-white font-bold">${ord.total.toFixed(2)}</span>
                            </div>

                            <div className="col-span-2 md:col-span-1 flex space-x-2 md:justify-end">
                              <button
                                onClick={() => setSelectedOrderDetail(isDetailOpen ? null : ord.id)}
                                className="px-3.5 py-1.5 bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white font-mono text-[10px] tracking-wider uppercase transition-colors rounded cursor-pointer"
                              >
                                {isDetailOpen ? 'HIDE' : 'VIEW DETAILS'}
                              </button>
                            </div>
                          </div>

                          {/* Collapsible details layout */}
                          {isDetailOpen && (
                            <div className="border-t border-zinc-900 p-5 sm:p-6 bg-zinc-950/40 space-y-6">
                              {/* Items details */}
                              <div className="space-y-4">
                                <h4 className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase font-bold">ITEMS ORDERED</h4>
                                <div className="divide-y divide-zinc-900">
                                  {ord.items.map((it, idx) => (
                                    <div key={idx} className="py-3 flex items-center justify-between text-xs sm:text-sm">
                                      <div className="flex items-center space-x-3">
                                        <img src={it.image} alt={it.productName} referrerPolicy="no-referrer" className="h-10 w-10 object-cover rounded bg-zinc-900" />
                                        <div>
                                          <p className="text-white font-bold uppercase">{it.productName}</p>
                                          <p className="font-mono text-[10px] text-zinc-500 uppercase">SIZE: {it.size} • QTY: {it.quantity}</p>
                                        </div>
                                      </div>
                                      <span className="font-mono font-bold text-zinc-300">${(it.price * it.quantity).toFixed(2)}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Shipping address details */}
                              <div className="border-t border-zinc-900 pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                                <div>
                                  <h4 className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase font-bold mb-1">SHIPPING METRICS</h4>
                                  <p className="text-white font-bold uppercase">{ord.shippingAddress.fullName}</p>
                                  <p className="text-zinc-400 uppercase">{ord.shippingAddress.address}</p>
                                  <p className="text-zinc-400 uppercase">{ord.shippingAddress.city}, {ord.shippingAddress.postalCode}</p>
                                </div>
                                <div className="flex flex-col justify-between items-start sm:items-end">
                                  <div>
                                    <h4 className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase font-bold mb-1 sm:text-right">PAYMENT PARAMETERS</h4>
                                    <p className="text-zinc-400 sm:text-right uppercase">METHOD: {ord.paymentMethod}</p>
                                  </div>
                                  {canCancel && (
                                    <button
                                      onClick={() => triggerCancelConfirm(ord.id)}
                                      className="mt-4 px-4 py-2 border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors font-mono text-[10px] tracking-wider uppercase rounded cursor-pointer"
                                    >
                                      CANCEL THIS ORDER
                                    </button>
                                  )}
                                </div>
                              </div>

                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-16 border border-zinc-900 bg-black/40 rounded-lg">
                    <p className="text-zinc-500 font-mono text-sm uppercase">No orders on record.</p>
                  </div>
                )}
              </div>
            )}

          </div>

        </div>
      </div>

      {/* Cancel Order Confirmation Modal Overlay */}
      {cancellingOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-md border border-zinc-800 bg-zinc-950 p-6 sm:p-8 rounded-lg shadow-2xl space-y-6">
            <div className="flex justify-between items-center border-b border-zinc-900 pb-3">
              <div className="flex items-center space-x-2 text-red-500">
                <AlertCircle className="h-5 w-5" />
                <h3 className="font-mono text-xs font-bold tracking-widest uppercase">CANCEL ORDER</h3>
              </div>
              <button
                onClick={() => setCancellingOrderId(null)}
                className="text-zinc-500 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="text-zinc-400 text-sm tracking-wide leading-relaxed font-light">
              Are you sure you want to cancel the order <span className="text-white font-bold">{cancellingOrderId}</span>? This action is immediate and cannot be undone.
            </p>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setCancellingOrderId(null)}
                className="w-1/2 py-3 bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition-colors font-mono text-xs font-bold tracking-widest uppercase rounded cursor-pointer"
              >
                NO, KEEP ORDER
              </button>
              <button
                onClick={confirmCancel}
                className="w-1/2 py-3 bg-red-600 hover:bg-red-500 text-white transition-colors font-mono text-xs font-bold tracking-widest uppercase rounded cursor-pointer"
              >
                YES, CANCEL ORDER
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
