import { useNavigate } from 'react-router-dom';
import AuthView from '../components/AuthView';
import { useApp } from '../context/AppContext';
import { useLegacyView } from '../hooks/useLegacyView';

export default function LoginPage() {
  const navigate = useNavigate();
  const { setView } = useLegacyView();
  const { login, register, authError, authMode, setAuthMode, setAccountSubTab } = useApp();

  return (
    <AuthView
      onLogin={login}
      onRegister={register}
      onSuccess={() => {
        setAccountSubTab('profile');
        navigate('/account');
      }}
      setView={setView}
      authMode={authMode}
      setAuthMode={setAuthMode}
      serverError={authError}
    />
  );
}
