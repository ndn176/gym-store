import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import RequireAdminAuth from '../routes/RequireAdminAuth';
import { useAdminAuth } from '../context/AdminAuthContext';

// Maps the current URL to the sidebar item that should be highlighted.
function getActiveAdminId(pathname: string): string {
  if (pathname.startsWith('/admin/products/new') || pathname.match(/^\/admin\/products\/[^/]+\/edit$/)) {
    return 'add-product';
  }
  if (pathname.startsWith('/admin/products')) return 'products';
  if (pathname.startsWith('/admin/orders')) return 'orders';
  if (pathname.startsWith('/admin/inventory')) return 'inventory';
  if (pathname.startsWith('/admin/design-system')) return 'design-system';
  return 'dashboard';
}

export default function AdminShell() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAdminAuth();

  const currentAdminView = getActiveAdminId(location.pathname);

  const setAdminView = (id: string) => {
    if (id === 'add-product') {
      navigate('/admin/products/new');
      return;
    }
    navigate(`/admin/${id}`);
  };

  return (
    <RequireAdminAuth>
      <AdminLayout
        currentAdminView={currentAdminView}
        setAdminView={setAdminView}
        onExitAdmin={() => {
          logout();
          navigate('/');
        }}
      >
        <Outlet />
      </AdminLayout>
    </RequireAdminAuth>
  );
}
