import React, { useState } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  PlusCircle,
  Receipt,
  Package,
  Sliders,
  LogOut,
  Menu,
  X,
  User,
  ChevronRight
} from 'lucide-react';

interface AdminLayoutProps {
  currentAdminView: string;
  setAdminView: (view: string) => void;
  onExitAdmin: () => void;
  children: React.ReactNode;
}

export default function AdminLayout({
  currentAdminView,
  setAdminView,
  onExitAdmin,
  children
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const menuItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: LayoutDashboard },
    { id: 'products', label: 'PRODUCT CATALOG', icon: ShoppingBag },
    { id: 'add-product', label: 'ADD NEW PRODUCT', icon: PlusCircle },
    { id: 'orders', label: 'ORDER MANAGEMENT', icon: Receipt },
    { id: 'inventory', label: 'INVENTORY HUB', icon: Package },
    { id: 'design-system', label: 'DESIGN SYSTEM', icon: Sliders },
  ];

  const getActiveLabel = () => {
    const activeItem = menuItems.find(item => item.id === currentAdminView);
    return activeItem ? activeItem.label : 'ADMIN PORTAL';
  };

  return (
    <div className="min-h-screen bg-black text-zinc-100 flex font-sans antialiased">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Component */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-900 flex flex-col justify-between transition-transform duration-300 lg:translate-x-0 lg:static lg:h-screen ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header/Logo section */}
          <div className="h-20 px-6 border-b border-zinc-900 flex items-center justify-between">
            <div className="flex flex-col">
              <span className="font-sans text-sm font-black tracking-[0.25em] text-white">
                IRON & AESTHETIC
              </span>
              <span className="font-mono text-[9px] tracking-[0.15em] text-zinc-500 uppercase mt-0.5">
                APEX MANAGEMENT
              </span>
            </div>
            <button
              className="lg:hidden text-zinc-400 hover:text-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentAdminView === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setAdminView(item.id);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center space-x-3.5 px-4 py-3 font-mono text-[11px] tracking-wider rounded-md transition-all duration-200 text-left ${
                    isActive
                      ? 'bg-white text-black font-extrabold shadow-lg'
                      : 'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100'
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-black' : 'text-zinc-400'}`} />
                  <span className="flex-1">{item.label}</span>
                  <ChevronRight className={`h-3 w-3 opacity-40 ${isActive ? 'text-black' : 'hidden'}`} />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer actions inside sidebar */}
        <div className="p-4 border-t border-zinc-900 bg-zinc-950/50">
          <button
            onClick={onExitAdmin}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3.5 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded font-mono text-[11px] tracking-wider uppercase transition-all duration-150 cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>EXIT ADMIN PORTAL</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        {/* Top App Bar */}
        <header className="h-20 border-b border-zinc-900 bg-zinc-950/30 flex items-center justify-between px-6 lg:px-8 shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1 text-zinc-400 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div>
              <h2 className="font-sans text-md font-extrabold tracking-wider text-white uppercase">
                {getActiveLabel()}
              </h2>
              <div className="hidden sm:flex items-center space-x-2 text-[10px] font-mono text-zinc-500 uppercase tracking-widest mt-0.5">
                <span>SYSTEM</span>
                <span>/</span>
                <span>LIVE OVERVIEW</span>
              </div>
            </div>
          </div>

          {/* Right Section: User HUD */}
          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="font-mono text-xs font-bold text-white">STAFF SESSION</p>
              <p className="font-mono text-[9px] text-zinc-500">ADMINISTRATOR</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center">
              <User className="h-4.5 w-4.5 text-zinc-300" />
            </div>
          </div>
        </header>

        {/* Scrollable Main Workspace */}
        <main className="flex-1 p-6 lg:p-8 bg-zinc-950/10 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
