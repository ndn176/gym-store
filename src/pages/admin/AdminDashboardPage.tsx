import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AdminDashboardView from '../../components/AdminDashboardView';
import { useApp } from '../../context/AppContext';
import { ordersApi } from '../../api/orders';
import { Order } from '../../types';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { products } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    ordersApi
      .listAll()
      .then(({ orders: list }) => setOrders(list))
      .finally(() => setLoading(false));
  }, []);

  const inventory = useMemo(
    () => Object.fromEntries(products.map((p) => [p.id, p.stock ?? 0])),
    [products]
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-500">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <AdminDashboardView
      products={products}
      orders={orders}
      inventory={inventory}
      onNavigateToView={(v) => navigate(`/admin/${v}`)}
      onSelectOrder={(order) => navigate(`/admin/orders?highlight=${order.id}`)}
    />
  );
}
