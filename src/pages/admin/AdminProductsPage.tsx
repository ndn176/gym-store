import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminProductsView from '../../components/AdminProductsView';
import { useApp } from '../../context/AppContext';

export default function AdminProductsPage() {
  const navigate = useNavigate();
  const { products, handleDeleteProduct, triggerToast } = useApp();

  const inventory = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p.stock ?? 0])),
    [products]
  );

  return (
    <AdminProductsView
      products={products}
      inventory={inventory}
      onAddProductClick={() => navigate('/admin/products/new')}
      onEditProductClick={(prod) => navigate(`/admin/products/${prod.id}/edit`)}
      onDeleteProduct={handleDeleteProduct}
      onShowToast={triggerToast}
    />
  );
}
