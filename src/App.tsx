import { AppProvider } from './context/AppContext';
import { AdminAuthProvider } from './context/AdminAuthContext';
import AppRouter from './routes/AppRouter';

export default function App() {
  return (
    <AppProvider>
      <AdminAuthProvider>
        <AppRouter />
      </AdminAuthProvider>
    </AppProvider>
  );
}
