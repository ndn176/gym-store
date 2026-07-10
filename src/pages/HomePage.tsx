import { useNavigate } from 'react-router-dom';
import HomeView from '../components/HomeView';
import { useApp } from '../context/AppContext';
import { useLegacyView } from '../hooks/useLegacyView';

export default function HomePage() {
  const navigate = useNavigate();
  const { setView } = useLegacyView();
  const { products, handleAddToCart } = useApp();

  return (
    <HomeView
      products={products}
      setView={setView}
      onSelectProduct={(id) => navigate(`/product/${id}`)}
      onAddToCart={handleAddToCart}
    />
  );
}
