import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

import { connectMongo } from './mongo.js';
import Product from './models/Product.js';
import Order from './models/Order.js';
import User from './models/User.js';
import Admin from './models/Admin.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function seedProducts() {
  const count = await Product.countDocuments();
  if (count > 0) {
    console.log(`[seed] products: đã có ${count} sản phẩm, bỏ qua.`);
    return;
  }
  const file = path.join(__dirname, 'data', 'products.json');
  const products = JSON.parse(fs.readFileSync(file, 'utf-8'));
  await Product.insertMany(products);
  console.log(`[seed] products: đã thêm ${products.length} sản phẩm.`);
}

async function seedDemoUser() {
  const existing = await User.findOne({ email: 'john.doe@ironandaesthetic.com' });
  if (existing) {
    console.log('[seed] demo customer: đã tồn tại, bỏ qua.');
    return;
  }
  await User.create({
    name: 'John Doe',
    email: 'john.doe@ironandaesthetic.com',
    phone: '+1 (555) 019-2834',
    birthday: '1995-10-24',
    gender: 'Male',
    passwordHash: bcrypt.hashSync('password123', 10),
  });
  console.log('[seed] demo customer tạo thành công: john.doe@ironandaesthetic.com / password123');
}

async function seedDemoAdmin() {
  const existing = await Admin.findOne({ email: 'admin@ironandaesthetic.com' });
  if (existing) {
    console.log('[seed] demo admin: đã tồn tại, bỏ qua.');
    return;
  }
  await Admin.create({
    name: 'Staff Administrator',
    email: 'admin@ironandaesthetic.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
  });
  console.log('[seed] demo admin tạo thành công: admin@ironandaesthetic.com / admin123');
}

async function seedDemoOrders() {
  const count = await Order.countDocuments();
  if (count > 0) {
    console.log(`[seed] orders: đã có ${count} đơn hàng, bỏ qua.`);
    return;
  }
  const file = path.join(__dirname, 'data', 'orders.seed.json');
  if (!fs.existsSync(file)) return;
  const orders = JSON.parse(fs.readFileSync(file, 'utf-8'));
  const withOwner = orders.map((o) => ({ ...o, userEmail: 'john.doe@ironandaesthetic.com' }));
  await Order.insertMany(withOwner);
  console.log(`[seed] orders: đã thêm ${orders.length} đơn hàng mẫu.`);
}

async function main() {
  await connectMongo();
  await seedProducts();
  await seedDemoUser();
  await seedDemoAdmin();
  await seedDemoOrders();
  console.log('[seed] Hoàn tất.');
  process.exit(0);
}

main().catch((err) => {
  console.error('[seed] Lỗi:', err);
  process.exit(1);
});
