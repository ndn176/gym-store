import { useNavigate, useParams } from 'react-router-dom';
import AdminProductFormView from '../../components/AdminProductFormView';
import { useApp } from '../../context/AppContext';
import { Product } from '../../types';

export default function AdminProductFormPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { products, handleSaveProduct, triggerToast } = useApp();

  // Real URL-driven edit: /admin/products/:id/edit looks the product up
  // straight from the catalogue, so the page also works after a refresh
  // or when shared as a direct link.
  const editingProduct = id ? products.find((p) => p.id === id) ?? null : null;
  const isNew = !editingProduct;

  return (
    <AdminProductFormView
      editingProduct={editingProduct}
      onSaveProduct={async (product: Product, initialStock: number) => {
        const ok = await handleSaveProduct({ ...product, stock: initialStock }, isNew);
        if (ok) navigate('/admin/products');
      }}
      onCancel={() => navigate('/admin/products')}
      onShowToast={triggerToast}
    />
  );
}
