import { useNavigate, useSearchParams } from 'react-router-dom';
import ShopView from '../components/ShopView';
import { useApp } from '../context/AppContext';

export default function ShopPage() {
  const navigate = useNavigate();
  const { products, searchQuery } = useApp();
  const [searchParams] = useSearchParams();
  const collection = searchParams.get('collection');
  const category = searchParams.get('category');

  return (
    <ShopView
      products={products}
      onSelectProduct={(id) => navigate(`/product/${id}`)}
      searchQuery={searchQuery}
      collection={collection}
      category={category}
    />
  );
}
