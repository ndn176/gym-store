import { Router } from 'express';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';
import { signToken } from '../utils/jwt.js';
import { requireAdminAuth, COOKIE_NAMES } from '../middleware/auth.js';
import { setAuthCookie, clearAuthCookie } from '../utils/cookies.js';

const router = Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Thiếu email hoặc mật khẩu.' });
  }

  const admin = await Admin.findOne({ email: String(email).toLowerCase() });
  if (!admin || !bcrypt.compareSync(password, admin.passwordHash)) {
    return res.status(401).json({ error: 'Email hoặc mật khẩu quản trị không đúng.' });
  }

  const token = signToken({ role: 'admin', email: admin.email, name: admin.name });
  setAuthCookie(res, COOKIE_NAMES.ADMIN_COOKIE, token);
  res.json({ admin: { name: admin.name, email: admin.email } });
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res, COOKIE_NAMES.ADMIN_COOKIE);
  res.status(204).end();
});

router.get('/me', requireAdminAuth, (req, res) => {
  res.json({ admin: { email: req.admin.email, name: req.admin.name } });
});

export default router;
