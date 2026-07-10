import ForgotPasswordView from '../components/ForgotPasswordView';
import { useApp } from '../context/AppContext';
import { useLegacyView } from '../hooks/useLegacyView';

export default function ForgotPasswordPage() {
  const { setView } = useLegacyView();
  const { setAuthMode } = useApp();

  return <ForgotPasswordView setView={setView} setAuthMode={setAuthMode} />;
}
