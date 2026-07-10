import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import AdminOrdersView from '../../components/AdminOrdersView';
import { useApp } from '../../context/AppContext';
import { ordersApi } from '../../api/orders';
import { Order } from '../../types';

export default function AdminOrdersPage() {
  const { triggerToast } = useApp();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const highlightId = searchParams.get('highlight');
  const selectedOrderFromDashboard = highlightId
    ? orders.find((o) => o.id === highlightId) ?? null
    : null;

  const loadOrders = () => {
    setLoading(true);
    ordersApi
      .listAll()
      .then(({ orders: list }) => setOrders(list))
      .catch(() => triggerToast('Không tải được danh sách đơn hàng.'))
      .finally(() => setLoading(false));
  };

  useEffect(loadOrders, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-500">
        <Loader2 className="h-5 w-5 animate-spin" />
      </div>
    );
  }

  return (
    <AdminOrdersView
      orders={orders}
      onUpdateOrderStatus={async (id, status) => {
        try {
          const { order: updated } = await ordersApi.updateStatus(id, status);
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        } catch {
          triggerToast('Không cập nhật được trạng thái đơn hàng.');
        }
      }}
      onCancelOrder={async (id) => {
        try {
          const { order: updated } = await ordersApi.cancelAny(id);
          setOrders((prev) => prev.map((o) => (o.id === updated.id ? updated : o)));
        } catch {
          triggerToast('Không huỷ được đơn hàng.');
        }
      }}
      onShowToast={triggerToast}
      selectedOrderFromDashboard={selectedOrderFromDashboard}
      onClearSelectedOrderFromDashboard={() => {
        searchParams.delete('highlight');
        setSearchParams(searchParams, { replace: true });
      }}
    />
  );
}
