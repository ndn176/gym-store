import { Router } from 'express';
import Order from '../models/Order.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = Router();

// Admin sees every order — including guest checkouts — with full contact
// info from shippingAddress (name, email, phone, address).
router.get('/', requireAdminAuth, async (_req, res) => {
  const orders = await Order.find().sort({ createdAt: -1 });
  res.json({ orders: orders.map((o) => o.toJSON()) });
});

router.patch('/:id/status', requireAdminAuth, async (req, res) => {
  const { status } = req.body || {};
  const allowed = ['Processing', 'Shipped', 'Delivered', 'Cancelled'];
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Trạng thái không hợp lệ.' });
  }

  const order = await Order.findOneAndUpdate({ id: req.params.id }, { status }, { new: true });
  if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
  res.json({ order: order.toJSON() });
});

router.patch('/:id/cancel', requireAdminAuth, async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { id: req.params.id },
    { status: 'Cancelled' },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
  res.json({ order: order.toJSON() });
});

export default router;
