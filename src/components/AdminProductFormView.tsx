import React, { useState, useEffect } from 'react';
import { ShoppingBag, ArrowLeft, Image as ImageIcon, Check } from 'lucide-react';
import { Product } from '../types';

interface AdminProductFormViewProps {
  editingProduct: Product | null;
  onSaveProduct: (product: Product, initialStock: number) => void;
  onCancel: () => void;
  onShowToast: (msg: string) => void;
}

export default function AdminProductFormView({
  editingProduct,
  onSaveProduct,
  onCancel,
  onShowToast
}: AdminProductFormViewProps) {
  // Setup fields state
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  const [category, setCategory] = useState<'Tops' | 'Bottoms' | 'Outerwear' | 'Accessories'>('Tops');
  const [collection, setCollection] = useState<'Men' | 'Women' | 'Unisex'>('Unisex');
  const [status, setStatus] = useState<string>(''); // empty means none
  const [image, setImage] = useState('');
  const [hoverImage, setHoverImage] = useState('');
  const [description, setDescription] = useState('');
  const [materialsText, setMaterialsText] = useState('');
  const [careText, setCareText] = useState('');
  const [selectedSizes, setSelectedSizes] = useState<string[]>(['M']);
  const [stock, setStock] = useState('50'); // Initial stock level for new products

  const sizeOptions = ['S', 'M', 'L', 'XL', 'XXL', 'S/M', 'L/XL', 'One Size'];

  // Initialize fields if editing
  useEffect(() => {
    if (editingProduct) {
      setId(editingProduct.id);
      setName(editingProduct.name);
      setPrice(editingProduct.price.toString());
      setOriginalPrice(editingProduct.originalPrice?.toString() || '');
      setCategory(editingProduct.category);
      setCollection(editingProduct.collection);
      setStatus(editingProduct.status || '');
      setImage(editingProduct.image);
      setHoverImage(editingProduct.hoverImage || '');
      setDescription(editingProduct.description);
      setMaterialsText(editingProduct.materials.join(', '));
      setCareText(editingProduct.care.join(', '));
      setSelectedSizes(editingProduct.sizes);
    } else {
      // Clear fields for new product
      setId('');
      setName('');
      setPrice('');
      setOriginalPrice('');
      setCategory('Tops');
      setCollection('Unisex');
      setStatus('');
      setImage('https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800');
      setHoverImage('');
      setDescription('');
      setMaterialsText('88% Premium Polyester, 12% Spandex matrix');
      setCareText('Machine wash cold, air dry only');
      setSelectedSizes(['M', 'L', 'XL']);
      setStock('50');
    }
  }, [editingProduct]);

  // Handle sizes selection
  const handleSizeToggle = (size: string) => {
    setSelectedSizes(prev =>
      prev.includes(size) ? prev.filter(x => x !== size) : [...prev, size]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Standard Client-Side Validation
    if (!id.trim()) {
      onShowToast('VALIDATION ERROR: PRODUCT ID IS REQUIRED.');
      return;
    }
    if (!name.trim()) {
      onShowToast('VALIDATION ERROR: PRODUCT NAME IS REQUIRED.');
      return;
    }
    const parsedPrice = parseFloat(price);
    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      onShowToast('VALIDATION ERROR: PRICE MUST BE A POSITIVE NUMBER.');
      return;
    }
    if (!image.trim()) {
      onShowToast('VALIDATION ERROR: CORE IMAGE URL IS REQUIRED.');
      return;
    }
    if (selectedSizes.length === 0) {
      onShowToast('VALIDATION ERROR: AT LEAST ONE SIZE MUST BE AVAILABLE.');
      return;
    }

    const parsedStock = parseInt(stock);
    const validatedStock = isNaN(parsedStock) || parsedStock < 0 ? 0 : parsedStock;

    // Build product object
    const finalProduct: Product = {
      id: id.trim().toLowerCase().replace(/\s+/g, '-'),
      name: name.trim(),
      price: parsedPrice,
      originalPrice: originalPrice.trim() ? parseFloat(originalPrice) : undefined,
      category,
      collection,
      status: status ? (status as any) : undefined,
      image: image.trim(),
      hoverImage: hoverImage.trim() ? hoverImage.trim() : undefined,
      images: [
        image.trim(),
        ...(hoverImage.trim() ? [hoverImage.trim()] : [])
      ],
      description: description.trim() || `${name.trim()} - Premium athletic gear created for raw performance. Built to withstand standard lifting postures with elegant structural aesthetics.`,
      materials: materialsText.split(',').map(x => x.trim()).filter(Boolean),
      care: careText.split(',').map(x => x.trim()).filter(Boolean),
      sizes: selectedSizes,
      rating: editingProduct ? editingProduct.rating : 5.0,
      reviewsCount: editingProduct ? editingProduct.reviewsCount : 0
    };

    onSaveProduct(finalProduct, validatedStock);
    onShowToast(
      editingProduct
        ? `UPDATED PRODUCT CONFIG: ${finalProduct.name.toUpperCase()}`
        : `LAUNCHED NEW PIECE SECURELY: ${finalProduct.name.toUpperCase()}`
    );
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Back link */}
      <button
        onClick={onCancel}
        className="flex items-center space-x-2 text-zinc-500 hover:text-white font-mono text-xs tracking-widest uppercase transition-all duration-150 cursor-pointer mb-2"
      >
        <ArrowLeft className="h-4 w-4" />
        <span>BACK TO CATALOG</span>
      </button>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Left column: Form inputs (Grid-8) */}
        <div className="md:col-span-8 bg-zinc-950 border border-zinc-900 rounded-lg p-6 space-y-6">
          <div className="border-b border-zinc-900 pb-4">
            <h3 className="font-sans text-md font-extrabold tracking-wider text-white uppercase">
              {editingProduct ? 'EDIT ATHLETIC GARMENT' : 'CATALOGUE NEW PIECE'}
            </h3>
            <p className="font-mono text-[9px] text-zinc-500 uppercase tracking-widest mt-1">
              {editingProduct ? 'MODIFIYING EXISTING ITEM ARTIFACT CONFIG' : 'INJECTING NEW APEX APPAREL ARTIFACT'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* ID Field */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                PRODUCT SKU ID <span className="text-zinc-650">(URL PATH KEY)</span>
              </label>
              <input
                type="text"
                disabled={!!editingProduct}
                value={id}
                onChange={(e) => setId(e.target.value)}
                placeholder="e.g. core-oversized-tee"
                required
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono text-white p-3 focus:outline-none rounded uppercase tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
              />
            </div>

            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                PRODUCT NAME
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Core Oversized Tee"
                required
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-sans text-white p-3 focus:outline-none rounded uppercase tracking-wide"
              />
            </div>

            {/* Price Field */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                RETAIL PRICE ($ USD)
              </label>
              <input
                type="number"
                step="0.01"
                min="1"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="e.g. 64.00"
                required
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono text-white p-3 focus:outline-none rounded uppercase"
              />
            </div>

            {/* Original Price Field */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                ORIGINAL RETAIL <span className="text-zinc-650">(FOR SALE BADGING)</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
                placeholder="Leave blank if not on sale"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono text-white p-3 focus:outline-none rounded uppercase"
              />
            </div>

            {/* Category Dropdown */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                CATEGORY CLASSIFICATION
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono text-white p-3 focus:outline-none rounded uppercase cursor-pointer"
              >
                <option value="Tops">TOPS</option>
                <option value="Bottoms">BOTTOMS</option>
                <option value="Outerwear">OUTERWEAR</option>
                <option value="Accessories">ACCESSORIES</option>
              </select>
            </div>

            {/* Collection Dropdown */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                TARGET AUDIENCE COLLECTION
              </label>
              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value as any)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono text-white p-3 focus:outline-none rounded uppercase cursor-pointer"
              >
                <option value="Men">MEN</option>
                <option value="Women">WOMEN</option>
                <option value="Unisex">UNISEX</option>
              </select>
            </div>

            {/* Status Dropdown */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                VISUAL BADGE STATUS
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono text-white p-3 focus:outline-none rounded uppercase cursor-pointer"
              >
                <option value="">NONE / STANDARD</option>
                <option value="New In">NEW IN</option>
                <option value="Sale">SALE</option>
                <option value="Essentials">ESSENTIALS</option>
              </select>
            </div>

            {/* Initial Stock level */}
            <div className="space-y-1.5">
              <label className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
                INITIAL STOCK UNITS
              </label>
              <input
                type="number"
                min="0"
                disabled={!!editingProduct}
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                placeholder="e.g. 50"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono text-white p-3 focus:outline-none rounded uppercase disabled:opacity-40"
              />
            </div>
          </div>

          {/* Primary image url */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              PRIMARY IMAGE URL
            </label>
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              required
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono text-white p-3 focus:outline-none rounded"
            />
          </div>

          {/* Hover image url */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              HOVER ANGLE IMAGE URL <span className="text-zinc-650">(OPTIONAL alternate view)</span>
            </label>
            <input
              type="text"
              value={hoverImage}
              onChange={(e) => setHoverImage(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono text-white p-3 focus:outline-none rounded"
            />
          </div>

          {/* Sizes Options */}
          <div className="space-y-3">
            <span className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              AVAILABLE SIZES
            </span>
            <div className="flex flex-wrap gap-2">
              {sizeOptions.map((sz) => {
                const isSelected = selectedSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => handleSizeToggle(sz)}
                    className={`h-10 px-4 font-mono text-xs tracking-wider rounded uppercase transition-all duration-150 border ${
                      isSelected
                        ? 'bg-white text-black border-white font-extrabold shadow-md'
                        : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-white hover:border-zinc-600'
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Materials & Fabrication */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              MATERIALS & COMPOSITION <span className="text-zinc-650">(COMMA-SEPARATED VALUES)</span>
            </label>
            <input
              type="text"
              value={materialsText}
              onChange={(e) => setMaterialsText(e.target.value)}
              placeholder="e.g. 88% Recycled Polyester, 12% Elastane, anti-odor microthread"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono text-white p-3 focus:outline-none rounded uppercase tracking-wide"
            />
          </div>

          {/* Care Instructions */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              CARE INSTRUCTIONS <span className="text-zinc-650">(COMMA-SEPARATED VALUES)</span>
            </label>
            <input
              type="text"
              value={careText}
              onChange={(e) => setCareText(e.target.value)}
              placeholder="e.g. Machine wash cold, Wash separate inside out, Air dry only"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-mono text-white p-3 focus:outline-none rounded uppercase tracking-wide"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-mono text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">
              PRODUCT NARRATIVE DESCRIPTION
            </label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detail the garment's cut, fabrics, weight, performance properties, and styling posture..."
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-white text-xs font-sans text-white p-3 focus:outline-none rounded uppercase tracking-wide leading-relaxed resize-y"
            />
          </div>
        </div>

        {/* Right column: Previews / Save controls (Grid-4) */}
        <div className="md:col-span-4 space-y-6">
          {/* Action container */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5 space-y-4">
            <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase font-bold">COMMIT ACTIONS</span>
            
            <button
              type="submit"
              className="w-full py-4 bg-white hover:bg-zinc-200 text-black font-mono text-xs font-bold tracking-[0.15em] uppercase rounded flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg"
            >
              <Check className="h-4.5 w-4.5" />
              <span>SAVE CONFIG TO CORE</span>
            </button>

            <button
              type="button"
              onClick={onCancel}
              className="w-full py-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white font-mono text-xs tracking-widest uppercase rounded transition-all cursor-pointer"
            >
              CANCEL MODIFICATIONS
            </button>
          </div>

          {/* Card Preview Panel */}
          <div className="bg-zinc-950 border border-zinc-900 rounded-lg p-5">
            <span className="font-mono text-[9px] tracking-widest text-zinc-500 uppercase font-bold block mb-4">LIVE CATALOG VISUAL CARD</span>
            <div className="border border-zinc-900 p-4 bg-zinc-900/10 rounded">
              <div className="aspect-square bg-zinc-900 rounded overflow-hidden relative mb-4 border border-zinc-900/60">
                {image.trim() ? (
                  <img
                    src={image}
                    alt="Preview"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-cover object-center"
                    onError={(e) => {
                      (e.target as any).src = 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=800';
                    }}
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-zinc-700 font-mono text-[9px] uppercase tracking-wider space-y-2">
                    <ImageIcon className="h-8 w-8 text-zinc-800" />
                    <span>AWAITING IMAGE INGESTION</span>
                  </div>
                )}
                {status && (
                  <span className="absolute top-2.5 left-2.5 z-10 bg-white text-black font-mono text-[8px] font-bold tracking-widest px-2.5 py-1 uppercase rounded-sm">
                    {status}
                  </span>
                )}
              </div>
              <div className="flex justify-between items-start mb-0.5">
                <span className="font-mono text-[8px] tracking-widest text-zinc-500 uppercase">{category || 'CATEGORY'}</span>
                <span className="font-mono text-[8px] tracking-wider text-zinc-600 uppercase">PREVIEW</span>
              </div>
              <h4 className="font-bold text-xs text-white uppercase tracking-tight leading-snug line-clamp-1 truncate">
                {name || 'UNNAMED PIECE'}
              </h4>
              <div className="flex items-baseline space-x-2 mt-2 pt-2 border-t border-zinc-900/50">
                <span className="font-mono text-xs font-bold text-white">${price ? parseFloat(price).toFixed(2) : '0.00'}</span>
                {originalPrice && (
                  <span className="font-mono text-[9px] text-zinc-650 line-through">${parseFloat(originalPrice).toFixed(2)}</span>
                )}
              </div>
            </div>
          </div>
        </div>

      </form>
    </div>
  );
}
