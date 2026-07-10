import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SuccessView from '../components/SuccessView';
import { useApp } from '../context/AppContext';
import { useLegacyView } from '../hooks/useLegacyView';

export default function SuccessPage() {
  const navigate = useNavigate();
  const { setView } = useLegacyView();
  const { currentOrder, setAccountSubTab } = useApp();

  // Guard: if someone lands here directly without an order, bounce to /shop
  useEffect(() => {
    if (!currentOrder) {
      navigate('/shop', { replace: true });
    }
  }, [currentOrder, navigate]);

  return (
    <SuccessView
      order={currentOrder}
      setView={setView}
      setAccountSubTab={setAccountSubTab}
    />
  );
}
