const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_name: { type: String, required: true },
  user: {
    type: String,
    ref: 'User',
    required: true,
  },
  description: { type: String, default: '' },
  price: { type: Number, required: true },
  category: { type: String, required: true },
//   images: { type: [String], default: [] },
//   brand: { type: String, default: '' },
//   availability: { type: Boolean, default: true },
//   quantity: { type: Number, default: 0 },
//   SKU: { type: String, default: '' },
//   weight: { type: Number, default: 0 },
//   dimensions: {
//     height: { type: Number, default: 0 },
//     width: { type: Number, default: 0 },
//     depth: { type: Number, default: 0 },
//   },
//   tags: { type: [String], default: [] },
//   variants: [
//     {
//       size: { type: String, default: '' },
//       color: { type: String, default: '' },
//       price: { type: Number, default: 0 },
//       availability: { type: Boolean, default: true },
//     },
//   ],
//   condition: { type: String, default: '' },
//   shippingInfo: { type: String, default: '' },
//   reviews: [
//     {
//       user: { type: String, default: '' },
//       rating: { type: Number, default: 0 },
//       comment: { type: String, default: '' },
//     },
//   ],
//   warrantyInfo: { type: String, default: '' },
//   customAttributes: { type: mongoose.Schema.Types.Mixed, default: {} },
//   url: { type: String, default: '' },
//   status: {
//     type: String,
//     enum: ['published', 'draft', 'archived'],
//     default: 'draft',
//   },
//   isFeatured: { type: Boolean, default: false },
//   salesHistory: [
//     {
//       date: { type: Date, default: new Date() },
//       quantitySold: { type: Number, default: 0 },
//     },
//   ],
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
