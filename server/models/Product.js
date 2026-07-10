import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    id: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number },
    category: {
      type: String,
      enum: ['Tops', 'Bottoms', 'Outerwear', 'Accessories'],
      required: true,
    },
    collection: { type: String, enum: ['Men', 'Women', 'Unisex'], required: true },
    status: { type: String, enum: ['New In', 'Sale', 'Essentials'] },
    image: { type: String, required: true },
    hoverImage: { type: String },
    images: { type: [String], default: [] },
    description: { type: String, default: '' },
    materials: { type: [String], default: [] },
    care: { type: [String], default: [] },
    sizes: { type: [String], default: [] },
    rating: { type: Number, default: 5 },
    reviewsCount: { type: Number, default: 0 },
    stock: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

export default mongoose.models.Product || mongoose.model('Product', productSchema);
