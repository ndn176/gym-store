import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6 bg-black text-white">
      <p className="font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase mb-4">Error 404</p>
      <h1 className="text-3xl sm:text-4xl font-black uppercase tracking-tight mb-4">
        Trang bạn tìm không tồn tại
      </h1>
      <p className="text-zinc-400 max-w-md mb-8">
        Đường dẫn này không đúng hoặc sản phẩm/trang đã bị gỡ bỏ. Hãy quay lại trang chủ hoặc tiếp tục mua sắm.
      </p>
      <Link
        to="/"
        className="px-6 py-3 bg-white text-black font-mono text-xs uppercase font-bold tracking-wider rounded"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
