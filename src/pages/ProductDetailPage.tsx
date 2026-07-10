import { useNavigate, useParams } from 'react-router-dom';
import ProductDetailView from '../components/ProductDetailView';
import { useApp } from '../context/AppContext';

export default function ProductDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, handleAddToCart } = useApp();

  return (
    <ProductDetailView
      products={products}
      productId={id ?? ''}
      onAddToCart={handleAddToCart}
      onSelectProduct={(pid) => navigate(`/product/${pid}`)}
    />
  );
}
