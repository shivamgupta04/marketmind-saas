import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  bulletPoints: [{ type: String }],
  suggestedPrice: { type: Number },
  imageQuery: { type: String }, // The product name identified by the vision model
}, { timestamps: true });

const Product = mongoose.model('Product', productSchema);
export default Product;
