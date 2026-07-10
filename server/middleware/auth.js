import { verifyToken } from '../utils/jwt.js';

const CUSTOMER_COOKIE = 'ia_customer_token';
const ADMIN_COOKIE = 'ia_admin_token';

function extractToken(req, cookieName) {
  // Prefer the httpOnly cookie (real browser sessions); fall back to a
  // Bearer header so the API can still be scripted/tested directly.
  if (req.cookies?.[cookieName]) return req.cookies[cookieName];
  const header = req.headers.authorization || '';
  const [scheme, token] = header.split(' ');
  return scheme === 'Bearer' ? token : null;
}

export function requireCustomerAuth(req, res, next) {
  const token = extractToken(req, CUSTOMER_COOKIE);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'customer') {
    return res.status(401).json({ error: 'Bạn cần đăng nhập để thực hiện thao tác này.' });
  }
  req.user = payload; // { role: 'customer', email, name }
  next();
}

export function requireAdminAuth(req, res, next) {
  const token = extractToken(req, ADMIN_COOKIE);
  const payload = token ? verifyToken(token) : null;
  if (!payload || payload.role !== 'admin') {
    return res.status(401).json({ error: 'Phiên quản trị không hợp lệ hoặc đã hết hạn.' });
  }
  req.admin = payload; // { role: 'admin', email, name }
  next();
}

// Đính kèm req.user nếu có phiên khách hàng hợp lệ, nhưng không
// chặn yêu cầu khi nó vắng mặt — dùng để kiểm tra khách.
export function attachUserIfPresent(req, _res, next) {
  const token = extractToken(req, CUSTOMER_COOKIE);
  const payload = token ? verifyToken(token) : null;
  if (payload?.role === 'customer') req.user = payload;
  next();
}

export const COOKIE_NAMES = { CUSTOMER_COOKIE, ADMIN_COOKIE };
