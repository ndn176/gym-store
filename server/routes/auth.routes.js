import { Router } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { signToken } from '../utils/jwt.js';
import { requireCustomerAuth, COOKIE_NAMES } from '../middleware/auth.js';
import { setAuthCookie, clearAuthCookie } from '../utils/cookies.js';
import { sendPasswordResetCodeEmail } from '../utils/mailer.js';

const router = Router();
const RESET_CODE_TTL_MS = 10 * 60 * 1000; // 10 minutes

function hashCode(code) {
  return crypto.createHash('sha256').update(code).digest('hex');
}

router.post('/register', async (req, res) => {
  const { name, email, phone, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Thiếu tên, email hoặc mật khẩu.' });
  }

  const existing = await User.findOne({ email: email.toLowerCase() });
  if (existing) {
    return res.status(409).json({ error: 'Email này đã được đăng ký.' });
  }

  const user = await User.create({
    name,
    email,
    phone: phone || '',
    passwordHash: bcrypt.hashSync(password, 10),
  });

  const token = signToken({ role: 'customer', email: user.email, name: user.name });
  setAuthCookie(res, COOKIE_NAMES.CUSTOMER_COOKIE, token);
  res.status(201).json({ user: user.toJSON() });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: 'Thiếu email hoặc mật khẩu.' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase() });
  if (!user || !bcrypt.compareSync(password, user.passwordHash)) {
    return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng.' });
  }

  const token = signToken({ role: 'customer', email: user.email, name: user.name });
  setAuthCookie(res, COOKIE_NAMES.CUSTOMER_COOKIE, token);
  res.json({ user: user.toJSON() });
});

router.post('/logout', (_req, res) => {
  clearAuthCookie(res, COOKIE_NAMES.CUSTOMER_COOKIE);
  res.status(204).end();
});

router.get('/me', requireCustomerAuth, async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
  res.json({ user: user.toJSON() });
});

router.put('/me', requireCustomerAuth, async (req, res) => {
  const { name, phone, birthday, gender } = req.body || {};
  const user = await User.findOneAndUpdate(
    { email: req.user.email },
    { $set: { ...(name && { name }), ...(phone !== undefined && { phone }), ...(birthday !== undefined && { birthday }), ...(gender !== undefined && { gender }) } },
    { new: true }
  );
  if (!user) return res.status(404).json({ error: 'Không tìm thấy người dùng.' });
  res.json({ user: user.toJSON() });
});

// ---- Forgot / reset password (real email, 6-digit code) ----

router.post('/forgot-password', async (req, res) => {
  const { email } = req.body || {};
  if (!email) return res.status(400).json({ error: 'Vui lòng nhập email.' });

  const user = await User.findOne({ email: String(email).toLowerCase() });

  // Always respond the same way whether or not the account exists, so the
  // API doesn't leak which emails are registered.
  if (user) {
    const code = String(crypto.randomInt(0, 1000000)).padStart(6, '0');
    user.resetCodeHash = hashCode(code);
    user.resetCodeExpires = new Date(Date.now() + RESET_CODE_TTL_MS);
    await user.save();
    await sendPasswordResetCodeEmail(user.email, code);
  }

  res.json({ message: 'Nếu email tồn tại, mã xác minh đã được gửi tới hộp thư của bạn.' });
});

router.post('/verify-reset-code', async (req, res) => {
  const { email, code } = req.body || {};
  if (!email || !code) return res.status(400).json({ error: 'Thiếu email hoặc mã xác minh.' });

  const user = await User.findOne({ email: String(email).toLowerCase() });
  const valid =
    user?.resetCodeHash &&
    user.resetCodeExpires &&
    user.resetCodeExpires.getTime() > Date.now() &&
    user.resetCodeHash === hashCode(code);

  if (!valid) {
    return res.status(400).json({ error: 'Mã xác minh không đúng hoặc đã hết hạn.' });
  }
  res.json({ valid: true });
});

router.post('/reset-password', async (req, res) => {
  const { email, code, password } = req.body || {};
  if (!email || !code || !password) {
    return res.status(400).json({ error: 'Thiếu thông tin đặt lại mật khẩu.' });
  }

  const user = await User.findOne({ email: String(email).toLowerCase() });
  const valid =
    user?.resetCodeHash &&
    user.resetCodeExpires &&
    user.resetCodeExpires.getTime() > Date.now() &&
    user.resetCodeHash === hashCode(code);

  if (!valid) {
    return res.status(400).json({ error: 'Mã xác minh không đúng hoặc đã hết hạn.' });
  }

  user.passwordHash = bcrypt.hashSync(password, 10);
  user.resetCodeHash = null;
  user.resetCodeExpires = null;
  await user.save();

  res.json({ message: 'Đặt lại mật khẩu thành công.' });
});

export default router;
