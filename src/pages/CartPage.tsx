import { useNavigate } from 'react-router-dom';
import CartView from '../components/CartView';
import { useApp } from '../context/AppContext';
import { useLegacyView } from '../hooks/useLegacyView';

export default function CartPage() {
  const navigate = useNavigate();
  const { setView } = useLegacyView();
  const { cart, handleUpdateQuantity, handleRemoveItem } = useApp();

  return (
    <CartView
      cart={cart}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onCheckout={() => navigate('/checkout')}
      setView={setView}
    />
  );
}
