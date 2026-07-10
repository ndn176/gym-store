import { Router } from 'express';
import Product from '../models/Product.js';
import { requireAdminAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  const products = await Product.find().sort({ createdAt: 1 });
  res.json({ products: products.map((p) => p.toJSON()) });
});

router.get('/:id', async (req, res) => {
  const product = await Product.findOne({ id: req.params.id });
  if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
  res.json({ product: product.toJSON() });
});

// ---- Admin-only write operations ----
router.post('/', requireAdminAuth, async (req, res) => {
  const payload = req.body;
  if (!payload?.id || !payload?.name) {
    return res.status(400).json({ error: 'Thiếu id hoặc tên sản phẩm.' });
  }

  const existing = await Product.findOne({ id: payload.id });
  if (existing) {
    return res.status(409).json({ error: 'Mã sản phẩm (id) đã tồn tại.' });
  }

  const product = await Product.create({ stock: 0, ...payload });
  res.status(201).json({ product: product.toJSON() });
});

router.put('/:id', requireAdminAuth, async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { id: req.params.id },
    { ...req.body, id: req.params.id },
    { new: true }
  );
  if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
  res.json({ product: product.toJSON() });
});

router.delete('/:id', requireAdminAuth, async (req, res) => {
  const result = await Product.deleteOne({ id: req.params.id });
  if (result.deletedCount === 0) {
    return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
  }
  res.status(204).end();
});

router.patch('/:id/stock', requireAdminAuth, async (req, res) => {
  const { stock } = req.body || {};
  if (typeof stock !== 'number' || stock < 0) {
    return res.status(400).json({ error: 'Số lượng tồn kho không hợp lệ.' });
  }

  const product = await Product.findOneAndUpdate(
    { id: req.params.id },
    { stock },
    { new: true }
  );
  if (!product) return res.status(404).json({ error: 'Không tìm thấy sản phẩm.' });
  res.json({ product: product.toJSON() });
});

export default router;
