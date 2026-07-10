import React, { useState, useEffect } from 'react';
import { Star, ShieldAlert, ShoppingBag, Plus, Minus, ChevronDown, ChevronUp, Check } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailViewProps {
  products: Product[];
  productId: string;
  onAddToCart: (product: Product, size: string, quantity: number) => void;
  onSelectProduct: (id: string) => void;
}

export default function ProductDetailView({
  products,
  productId,
  onAddToCart,
  onSelectProduct,
}: ProductDetailViewProps) {
  const product = products.find((p) => p.id === productId) || products[0];
  const isSoldOut = (product.stock ?? 0) <= 0;

  const [activeImg, setActiveImg] = useState(product.image);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  // Accordion Toggles
  const [openSection, setOpenSection] = useState<'desc' | 'materials' | 'shipping' | null>('desc');

  // Reset states when product changes
  useEffect(() => {
    setActiveImg(product.image);
    setSelectedSize(product.sizes[0] || 'M');
    setQuantity(1);
    setAdded(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [productId, product]);

  const handleAdd = () => {
    onAddToCart(product, selectedSize, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const toggleAccordion = (section: 'desc' | 'materials' | 'shipping') => {
    setOpenSection(openSection === section ? null : section);
  };

  // Recommendations: products from the same category or different ones
  const recommendations = products.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <div className="bg-black text-white min-h-screen font-sans pb-24">
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex space-x-2 text-xs font-mono text-zinc-500 uppercase tracking-widest">
          <span>HOME</span>
          <span className="text-zinc-700">/</span>
          <span>{product.category}</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300">{product.name}</span>
        </nav>
      </div>

      {/* Main Details Panel */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Left Column: Image Gallery (Grid-6) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="aspect-square w-full overflow-hidden rounded-lg bg-zinc-900 border border-zinc-900 relative">
              <img
                src={activeImg}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="h-full w-full object-cover object-center transition-all duration-300"
              />
            </div>
            
            {/* Gallery Thumbnails */}
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((imgUrl, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImg(imgUrl)}
                  className={`aspect-square w-20 flex-shrink-0 overflow-hidden rounded bg-zinc-900 border transition-all ${
                    activeImg === imgUrl ? 'border-white scale-98' : 'border-zinc-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={imgUrl} alt={`angle-${idx}`} referrerPolicy="no-referrer" className="h-full w-full object-cover object-center" />
                </button>
              ))}
            </div>
          </div>

          {/* Right Column: Checkout Controls (Grid-5) */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              
              {/* Product Heading */}
              <div>
                <span className="font-mono text-xs tracking-widest text-zinc-500 uppercase">
                  {product.category} / {product.collection}
                </span>
                <h1 className="text-2xl md:text-4xl font-black tracking-tight text-white uppercase mt-1 leading-tight">
                  {product.name}
                </h1>
                {isSoldOut && (
                  <span className="inline-block mt-2 px-2.5 py-1 bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-[10px] font-bold tracking-widest uppercase rounded">
                    SOLD OUT
                  </span>
                )}
                
                {/* Rating & Reviews */}
                <div className="flex items-center space-x-3 mt-3">
                  <div className="flex items-center text-white">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(product.rating) ? 'fill-white text-white' : 'text-zinc-700'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="font-mono text-xs text-zinc-500 uppercase tracking-wider">
                    {product.rating.toFixed(1)} / {product.reviewsCount} REVIEWS
                  </span>
                </div>
              </div>

              {/* Price Details */}
              <div className="flex items-baseline space-x-3">
                <span className="font-mono text-2xl font-bold text-white">
                  ${product.price.toFixed(2)}
                </span>
                {product.originalPrice && (
                  <span className="font-mono text-lg text-zinc-600 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Size Selector */}
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase font-semibold">
                    SELECT SIZE
                  </span>
                  <a href="#" className="font-mono text-[10px] tracking-widest text-zinc-500 hover:text-white uppercase underline">
                    SIZE CHART
                  </a>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`h-11 px-5 font-mono text-xs tracking-widest uppercase transition-all duration-200 border rounded ${
                        selectedSize === size
                          ? 'bg-white text-black border-white font-bold'
                          : 'border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Counter */}
              <div className="space-y-3">
                <span className="font-mono text-xs tracking-widest text-zinc-400 uppercase font-semibold block">
                  QUANTITY
                </span>
                <div className="inline-flex items-center border border-zinc-800 bg-black h-11 px-2 rounded">
                  <button
                    onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="font-mono text-sm font-bold text-center w-12 text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-1 text-zinc-400 hover:text-white"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Primary Add to Bag Button */}
              <button
                onClick={handleAdd}
                disabled={isSoldOut}
                className={`w-full py-4 font-mono text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 rounded flex items-center justify-center space-x-3 ${
                  isSoldOut
                    ? 'bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800'
                    : added
                    ? 'bg-emerald-600 text-white cursor-pointer'
                    : 'bg-white text-black hover:bg-zinc-200 cursor-pointer'
                }`}
              >
                {isSoldOut ? (
                  <span>HẾT HÀNG</span>
                ) : added ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>ADDED TO BAG</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="h-4 w-4" />
                    <span>ADD TO BAG</span>
                  </>
                )}
              </button>

              {/* Sub-Info Accordion Stack */}
              <div className="border-t border-zinc-900 pt-4 space-y-4">
                {/* Description */}
                <div className="border-b border-zinc-900 pb-4">
                  <button
                    onClick={() => toggleAccordion('desc')}
                    className="w-full flex justify-between items-center text-left py-2 hover:text-zinc-300"
                  >
                    <span className="font-mono text-xs tracking-widest uppercase font-semibold text-white">
                      DESCRIPTION
                    </span>
                    {openSection === 'desc' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {openSection === 'desc' && (
                    <p className="text-zinc-400 text-xs md:text-sm tracking-wide leading-relaxed mt-2 pl-1 font-light">
                      {product.description}
                    </p>
                  )}
                </div>

                {/* Materials & Care */}
                <div className="border-b border-zinc-900 pb-4">
                  <button
                    onClick={() => toggleAccordion('materials')}
                    className="w-full flex justify-between items-center text-left py-2 hover:text-zinc-300"
                  >
                    <span className="font-mono text-xs tracking-widest uppercase font-semibold text-white">
                      MATERIAL & CARE
                    </span>
                    {openSection === 'materials' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {openSection === 'materials' && (
                    <div className="mt-2 pl-1 space-y-3">
                      <div>
                        <h4 className="text-xs font-mono text-zinc-300 font-bold mb-1 uppercase tracking-wider">FABRICATION DETAILS:</h4>
                        <ul className="list-disc list-inside text-zinc-400 text-xs space-y-1">
                          {product.materials.map((m, idx) => <li key={idx}>{m}</li>)}
                        </ul>
                      </div>
                      <div>
                        <h4 className="text-xs font-mono text-zinc-300 font-bold mb-1 uppercase tracking-wider">CARE INSTRUCTIONS:</h4>
                        <ul className="list-disc list-inside text-zinc-400 text-xs space-y-1">
                          {product.care.map((c, idx) => <li key={idx}>{c}</li>)}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>

                {/* Shipping & Returns */}
                <div className="border-b border-zinc-900 pb-4">
                  <button
                    onClick={() => toggleAccordion('shipping')}
                    className="w-full flex justify-between items-center text-left py-2 hover:text-zinc-300"
                  >
                    <span className="font-mono text-xs tracking-widest uppercase font-semibold text-white">
                      SHIPPING & RETURNS
                    </span>
                    {openSection === 'shipping' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                  </button>
                  {openSection === 'shipping' && (
                    <p className="text-zinc-400 text-xs md:text-sm tracking-wide leading-relaxed mt-2 pl-1 font-light">
                      Free Standard Shipping on orders over $150. Fast express delivery methods are calculated at checkout. Easy 30-day return policy for unused, tagged gear.
                    </p>
                  )}
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Recommended Section ("You Might Also Like") */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-zinc-900 mt-24">
        <h2 className="font-sans text-2xl font-extrabold tracking-tight text-white uppercase mb-12 text-center sm:text-left">
          YOU MIGHT ALSO LIKE
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommendations.map((rec) => (
            <div
              key={rec.id}
              onClick={() => onSelectProduct(rec.id)}
              className="group flex flex-col cursor-pointer border border-zinc-900 hover:border-zinc-800 bg-zinc-950 p-4 transition-all duration-300 rounded-lg"
            >
              <div className="aspect-square w-full overflow-hidden rounded bg-zinc-900 mb-4 relative">
                <img src={rec.image} alt={rec.name} referrerPolicy="no-referrer" className="h-full w-full object-cover object-center group-hover:scale-102 transition-transform duration-500" />
              </div>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase">{rec.category}</span>
                  <h3 className="font-bold text-sm text-white group-hover:text-zinc-300 transition-colors leading-tight mt-0.5 line-clamp-1">{rec.name}</h3>
                </div>
                <div className="font-mono text-sm text-white mt-3 pt-3 border-t border-zinc-900">
                  ${rec.price.toFixed(2)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}
