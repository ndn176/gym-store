import { Router } from 'express';
import ContactMessage from '../models/ContactMessage.js';

const router = Router();

router.post('/', async (req, res) => {
  const { name, email, subject, message } = req.body || {};
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Vui lòng nhập đầy đủ tên, email và nội dung.' });
  }

  await ContactMessage.create({ name, email, subject, message });
  res.status(201).json({ message: 'Đã gửi! Đội ngũ hỗ trợ sẽ phản hồi bạn sớm nhất.' });
});

export default router;
