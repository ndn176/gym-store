import { useMemo } from 'react';
import AdminInventoryView from '../../components/AdminInventoryView';
import { useApp } from '../../context/AppContext';

export default function AdminInventoryPage() {
  const { products, handleUpdateStock, triggerToast } = useApp();

  const inventory = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p.stock ?? 0])),
    [products]
  );

  return (
    <AdminInventoryView
      products={products}
      inventory={inventory}
      onUpdateStock={handleUpdateStock}
      onShowToast={triggerToast}
    />
  );
}
