import { useParams } from 'react-router-dom';
import NotFoundPage from './NotFoundPage';

const CONTENT: Record<string, { title: string; body: string[] }> = {
  'sizing-guide': {
    title: 'HƯỚNG DẪN CHỌN SIZE',
    body: [
      'Tất cả sản phẩm của Iron & Aesthetic được cắt theo form chuẩn vận động (athletic fit) — ôm vừa ở vai và ngực, rộng rãi ở vùng vận động để không cản trở khi tập nặng.',
      'Nếu bạn đang phân vân giữa hai size, chúng tôi khuyên chọn size lớn hơn đối với áo hoodie và áo khoác, và chọn đúng số đo vòng eo đối với quần legging/jogger.',
      'Bảng size chi tiết theo từng sản phẩm được hiển thị ngay tại trang chi tiết sản phẩm, mục "SIZE CHART".',
    ],
  },
  'shipping-policy': {
    title: 'CHÍNH SÁCH VẬN CHUYỂN',
    body: [
      'Đơn hàng được xử lý trong vòng 1–2 ngày làm việc kể từ khi đặt hàng thành công.',
      'Thời gian giao hàng dự kiến: 2–4 ngày làm việc đối với khu vực nội thành, 4–7 ngày đối với các tỉnh thành khác.',
      'Bạn sẽ nhận được thông báo cập nhật trạng thái đơn hàng qua trang "Tài khoản của tôi" (nếu đã đăng nhập khi đặt hàng).',
    ],
  },
  'returns-exchanges': {
    title: 'ĐỔI TRẢ HÀNG',
    body: [
      'Chúng tôi chấp nhận đổi/trả trong vòng 14 ngày kể từ ngày nhận hàng, với điều kiện sản phẩm còn nguyên tem mác, chưa qua sử dụng.',
      'Để yêu cầu đổi/trả, vui lòng liên hệ qua trang Contact kèm theo mã đơn hàng của bạn.',
      'Phí vận chuyển đổi trả do lỗi từ phía Iron & Aesthetic sẽ được hoàn lại toàn bộ.',
    ],
  },
  'privacy-policy': {
    title: 'CHÍNH SÁCH BẢO MẬT',
    body: [
      'Chúng tôi chỉ thu thập thông tin cần thiết để xử lý đơn hàng của bạn: họ tên, email, số điện thoại và địa chỉ giao hàng.',
      'Thông tin thanh toán không được lưu trữ trên hệ thống của chúng tôi.',
      'Chúng tôi không chia sẻ dữ liệu cá nhân của bạn cho bên thứ ba ngoài mục đích vận chuyển đơn hàng.',
    ],
  },
  'terms-of-service': {
    title: 'ĐIỀU KHOẢN DỊCH VỤ',
    body: [
      'Bằng việc đặt hàng trên Iron & Aesthetic, bạn xác nhận thông tin cung cấp là chính xác và đầy đủ.',
      'Giá sản phẩm có thể thay đổi mà không cần báo trước; giá áp dụng là giá tại thời điểm đặt hàng.',
      'Iron & Aesthetic có quyền từ chối hoặc huỷ đơn hàng trong trường hợp phát hiện gian lận hoặc thông tin không hợp lệ.',
    ],
  },
  accessibility: {
    title: 'KHẢ NĂNG TIẾP CẬN',
    body: [
      'Chúng tôi mong muốn website có thể truy cập được với mọi người dùng, bao gồm người khuyết tật.',
      'Nếu bạn gặp khó khăn khi sử dụng bất kỳ tính năng nào trên trang, vui lòng liên hệ với chúng tôi qua trang Contact để được hỗ trợ.',
    ],
  },
};

export default function InfoPage() {
  const { slug } = useParams<{ slug: string }>();
  const entry = slug ? CONTENT[slug] : undefined;

  if (!entry) return <NotFoundPage />;

  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <div className="border-b border-zinc-900 bg-zinc-950/20 py-16 px-4 text-center">
        <span className="font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase">Support</span>
        <h1 className="text-3xl md:text-5xl font-black tracking-tight text-white uppercase mt-2">
          {entry.title}
        </h1>
      </div>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
        {entry.body.map((p, i) => (
          <p key={i} className="text-zinc-400 text-sm leading-relaxed">
            {p}
          </p>
        ))}
      </div>
    </div>
  );
}
