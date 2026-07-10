import { Router } from 'express';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { requireCustomerAuth, attachUserIfPresent } from '../middleware/auth.js';

const router = Router();

// Customers only see orders placed while logged in. Guest orders are still
// fully visible to admins (see admin-orders.routes.js) via shippingAddress.
router.get('/', requireCustomerAuth, async (req, res) => {
  const orders = await Order.find({ userEmail: req.user.email }).sort({ createdAt: -1 });
  res.json({ orders: orders.map((o) => o.toJSON()) });
});

// Placing an order does NOT require login — guest checkout is allowed, the
// same way most real storefronts work. If the shopper happens to be logged
// in, the order is also linked to their account so it shows under "My Orders".
router.post('/', attachUserIfPresent, async (req, res) => {
  const order = req.body;
  if (!order?.id || !Array.isArray(order?.items) || order.items.length === 0) {
    return res.status(400).json({ error: 'Dữ liệu đơn hàng không hợp lệ.' });
  }
  if (!order.shippingAddress?.email || !order.shippingAddress?.fullName || !order.shippingAddress?.phone) {
    return res.status(400).json({ error: 'Thiếu thông tin giao hàng.' });
  }

  // Verify stock availability for every line item before committing anything.
  const products = await Product.find({ id: { $in: order.items.map((i) => i.productId) } });
  const stockById = Object.fromEntries(products.map((p) => [p.id, p.stock ?? 0]));

  for (const item of order.items) {
    const available = stockById[item.productId] ?? 0;
    if (available < item.quantity) {
      return res.status(409).json({
        error: `Sản phẩm "${item.productName}" không đủ hàng (còn ${available}, cần ${item.quantity}).`,
      });
    }
  }

  const created = await Order.create({
    ...order,
    userEmail: req.user?.email ?? null,
    status: 'Processing',
  });

  await Promise.all(
    order.items.map((item) =>
      Product.updateOne({ id: item.productId }, { $inc: { stock: -item.quantity } })
    )
  );

  res.status(201).json({ order: created.toJSON() });
});

router.patch('/:id/cancel', requireCustomerAuth, async (req, res) => {
  const order = await Order.findOneAndUpdate(
    { id: req.params.id, userEmail: req.user.email },
    { status: 'Cancelled' },
    { new: true }
  );
  if (!order) return res.status(404).json({ error: 'Không tìm thấy đơn hàng.' });
  res.json({ order: order.toJSON() });
});

export default router;
