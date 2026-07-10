import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const COLLECTIONS = [
  {
    slug: 'Men',
    title: 'MEN',
    description: 'Heavy compound gear built for high-load training — tees, joggers, outerwear cut for movement under strain.',
    image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'Women',
    title: 'WOMEN',
    description: 'Performance silhouettes that hold their shape through every set — precise cuts, premium compression fabrics.',
    image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&q=80&w=1200',
  },
  {
    slug: 'Unisex',
    title: 'UNISEX',
    description: 'Core essentials designed to work for every athlete — oversized fits, neutral tones, everyday training staples.',
    image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&q=80&w=1200',
  },
];

export default function CollectionsPage() {
  return (
    <div className="bg-black text-white min-h-screen font-sans pb-24">
      <div className="border-b border-zinc-900 bg-zinc-950/20 py-16 px-4 text-center">
        <span className="font-mono text-xs tracking-[0.3em] text-zinc-500 uppercase">Explore</span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-white uppercase mt-2">
          Collections
        </h1>
        <p className="text-zinc-500 text-sm mt-4 max-w-xl mx-auto uppercase font-mono tracking-wide">
          Ba dòng sản phẩm chính — chọn dòng phù hợp với bạn để xem toàn bộ sản phẩm.
        </p>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
        {COLLECTIONS.map((c) => (
          <Link
            key={c.slug}
            to={`/shop?collection=${c.slug}`}
            className="group relative h-[420px] overflow-hidden rounded-lg border border-zinc-900 hover:border-zinc-800 transition-all duration-500 block"
          >
            <div className="absolute inset-0 bg-black">
              <img
                src={c.image}
                alt={c.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center opacity-50 group-hover:scale-105 group-hover:opacity-60 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            </div>
            <div className="absolute inset-0 p-7 flex flex-col justify-end">
              <h2 className="font-sans text-2xl font-black tracking-widest text-white mb-2 uppercase">
                {c.title}
              </h2>
              <p className="text-zinc-400 text-xs leading-relaxed max-w-xs mb-5">{c.description}</p>
              <div className="flex items-center space-x-2 text-white font-mono text-xs tracking-widest">
                <span>SHOP {c.title}</span>
                <ArrowRight className="h-3 w-3 transform group-hover:translate-x-1.5 transition-transform duration-300" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
