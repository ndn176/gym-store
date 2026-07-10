import { useNavigate } from 'react-router-dom';
import CheckoutView from '../components/CheckoutView';
import { useApp } from '../context/AppContext';
import { useLegacyView } from '../hooks/useLegacyView';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { setView } = useLegacyView();
  const { cart, currentUser, handlePlaceOrder, triggerToast } = useApp();

  return (
    <CheckoutView
      cart={cart}
      currentUser={currentUser}
      onPlaceOrder={async (order) => {
        const ok = await handlePlaceOrder(order);
        if (ok) navigate('/success');
      }}
      setView={setView}
      onShowToast={triggerToast}
    />
  );
}
