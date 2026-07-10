import { Link } from 'react-router-dom';

export default function OurStoryPage() {
  return (
    <div className="bg-black text-white min-h-screen font-sans">
      <section className="py-28 text-center px-4 border-b border-zinc-900">
        <span className="font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase">Our Story</span>
        <h1 className="font-sans text-4xl md:text-6xl font-black tracking-[0.05em] text-white uppercase mt-4 mb-6 leading-tight max-w-3xl mx-auto">
          FORM DICTATES FUNCTION.<br />AESTHETIC COMMANDS RESPECT.
        </h1>
        <p className="text-zinc-500 text-sm tracking-wide leading-relaxed font-light max-w-xl mx-auto">
          We reject the disposable, the noisy, the over-designed. Our training gear is stripped of
          excess and built for pure athletic leverage.
        </p>
      </section>

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-16">
        <div>
          <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">2021 — Khởi đầu</span>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase mt-2 mb-4">
            Sinh ra từ phòng gym, không phải từ bàn thiết kế
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Iron & Aesthetic bắt đầu từ một nhóm nhỏ những người tập luyện sức mạnh, không hài lòng với
            trang phục tập gym trên thị trường — hoặc quá mỏng manh để chịu được cường độ tập nặng, hoặc
            được thiết kế cho mọi hoạt động ngoại trừ việc nâng tạ. Chúng tôi bắt đầu may từng mẫu thử
            trong một xưởng nhỏ, kiểm tra độ bền qua chính những buổi squat và deadlift của mình.
          </p>
        </div>

        <div>
          <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">Chất liệu</span>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase mt-2 mb-4">
            Từng đường may đều có lý do
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Mỗi sản phẩm được thử nghiệm qua hàng trăm giờ tập luyện cường độ cao trước khi ra mắt. Chỉ
            may cường lực cao, form dáng tối ưu cho tư thế nâng tạ, và vải hiệu năng chịu được ma sát,
            mồ hôi và giãn nở liên tục — không đánh đổi giữa độ bền và thẩm mỹ.
          </p>
        </div>

        <div>
          <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">Hôm nay</span>
          <h2 className="text-2xl md:text-3xl font-black text-white uppercase mt-2 mb-4">
            Đồng hành cùng cộng đồng thể hình nghiêm túc
          </h2>
          <p className="text-zinc-400 text-sm leading-relaxed">
            Từ một xưởng nhỏ, Iron & Aesthetic hiện phục vụ cộng đồng vận động viên sức mạnh trên toàn
            quốc — vẫn giữ nguyên triết lý ban đầu: tối giản, bền bỉ, và được thiết kế cho hiệu năng thật
            sự chứ không chỉ để chụp ảnh.
          </p>
        </div>
      </section>

      <section className="text-center py-16 border-t border-zinc-900">
        <Link
          to="/shop"
          className="inline-flex items-center px-8 py-4 bg-white text-black font-mono text-xs font-bold tracking-[0.2em] uppercase rounded hover:bg-zinc-200 transition-colors"
        >
          Khám phá sản phẩm
        </Link>
      </section>
    </div>
  );
}
