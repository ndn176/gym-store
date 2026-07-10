import { useNavigate, useLocation } from 'react-router-dom';

/**
 * Several presentational components (Header, Footer, AuthView, CartView...)
 * were built around a `setView('shop' | 'cart' | ...)` callback instead of
 * real URLs. This hook keeps that simple call signature working, but wires
 * it to the real react-router navigator so the address bar, browser
 * back/forward and page refresh all behave like a normal website.
 */
const VIEW_TO_PATH: Record<string, string> = {
  home: '/',
  shop: '/shop',
  cart: '/cart',
  checkout: '/checkout',
  success: '/success',
  account: '/account',
  auth: '/login',
  'forgot-password': '/forgot-password',
};

const PATH_TO_VIEW: Array<[RegExp, string]> = [
  [/^\/$/, 'home'],
  [/^\/shop\/?$/, 'shop'],
  [/^\/cart\/?$/, 'cart'],
  [/^\/checkout\/?$/, 'checkout'],
  [/^\/success\/?$/, 'success'],
  [/^\/account\/?$/, 'account'],
  [/^\/login\/?$/, 'auth'],
  [/^\/forgot-password\/?$/, 'forgot-password'],
  [/^\/product\//, 'detail'],
];

export function useLegacyView() {
  const navigate = useNavigate();
  const location = useLocation();

  const setView = (view: string) => {
    const path = VIEW_TO_PATH[view] ?? '/';
    navigate(path);
  };

  const currentView = (() => {
    const match = PATH_TO_VIEW.find(([re]) => re.test(location.pathname));
    return match ? match[1] : 'home';
  })();

  return { setView, currentView, navigate };
}
