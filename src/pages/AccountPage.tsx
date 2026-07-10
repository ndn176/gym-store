import { Navigate } from 'react-router-dom';
import AccountView from '../components/AccountView';
import { useApp } from '../context/AppContext';

export default function AccountPage() {
  const {
    orders,
    handleCancelOrder,
    currentUser,
    handleUpdateUser,
    handleLogout,
    accountSubTab,
    setAccountSubTab,
  } = useApp();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AccountView
      orders={orders}
      onCancelOrder={handleCancelOrder}
      currentUser={currentUser}
      onUpdateUser={handleUpdateUser}
      onLogout={handleLogout}
      subTab={accountSubTab}
      setSubTab={setAccountSubTab}
    />
  );
}
