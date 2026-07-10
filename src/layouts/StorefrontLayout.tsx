import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Info, X } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import SearchOverlay from '../components/SearchOverlay';
import { useApp } from '../context/AppContext';
import { useLegacyView } from '../hooks/useLegacyView';

export default function StorefrontLayout() {
  const location = useLocation();
  const { setView, navigate } = useLegacyView();
  const {
    cartCount,
    products,
    currentUser,
    searchOverlayOpen,
    setSearchOverlayOpen,
    triggerToast,
    toastMessage,
    clearToast,
    setAuthMode,
    setAccountSubTab,
  } = useApp();

  // Scroll to top on every route change (same behaviour as before)
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [location.pathname]);

  const handleSearchClick = () => setSearchOverlayOpen(true);

  const handleProfileClick = () => {
    if (currentUser) {
      setAccountSubTab('profile');
      navigate('/account');
    } else {
      setAuthMode('login');
      navigate('/login');
    }
  };

  const handleCartClick = () => navigate('/cart');

  const handleSelectProduct = (id: string) => navigate(`/product/${id}`);

  return (
    <div className="flex flex-col min-h-screen bg-black text-white selection:bg-white selection:text-black font-sans antialiased">
      <Header
        setView={setView}
        cartCount={cartCount}
        onSearchClick={handleSearchClick}
        onProfileClick={handleProfileClick}
        onCartClick={handleCartClick}
      />

      <SearchOverlay
        products={products}
        isOpen={searchOverlayOpen}
        onClose={() => setSearchOverlayOpen(false)}
        onSelectProduct={(id) => {
          setSearchOverlayOpen(false);
          handleSelectProduct(id);
        }}
      />

      <main className="flex-1">
        <Outlet />
      </main>

      <Footer onNewsletterSubscribe={(email: string) => {
        triggerToast(`THANK YOU FOR SUBSCRIBING: ${email.toUpperCase()}. UNLOCK CODES WILL ARRIVE IN YOUR INBOX SHORTLY.`);
      }} />

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            style={{ x: '-50%' }}
            className="fixed bottom-6 left-1/2 z-50 w-[90%] max-w-md bg-zinc-950 border border-white/20 text-white font-mono text-xs uppercase tracking-wider p-4 rounded-lg shadow-2xl flex items-start space-x-3 backdrop-blur-md"
          >
            <Info className="h-4.5 w-4.5 text-zinc-300 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{toastMessage}</div>
            <button
              onClick={clearToast}
              className="text-zinc-500 hover:text-white transition-colors shrink-0 p-1"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
