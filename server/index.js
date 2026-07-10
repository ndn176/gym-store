import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import { connectMongo } from './mongo.js';
import authRoutes from './routes/auth.routes.js';
import adminAuthRoutes from './routes/admin-auth.routes.js';
import productsRoutes from './routes/products.routes.js';
import ordersRoutes from './routes/orders.routes.js';
import adminOrdersRoutes from './routes/admin-orders.routes.js';
import contactRoutes from './routes/contact.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => res.json({ ok: true }));

// Customer-facing
app.use('/api/auth', authRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/contact', contactRoutes);

// Admin-only (separate prefix + separate JWT role + separate cookie, see server/middleware/auth.js)
app.use('/api/admin/auth', adminAuthRoutes);
app.use('/api/admin/orders', adminOrdersRoutes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Đã có lỗi xảy ra ở máy chủ.' });
});

async function start() {
  await connectMongo();
  app.listen(PORT, () => {
    console.log(`API server đang chạy tại http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error('Không khởi động được server:', err);
  process.exit(1);
});
