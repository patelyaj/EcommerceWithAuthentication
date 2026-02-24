// models/product.model.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  thumbnail: String,
  title: { type: String, index: true },
  brand: { type: String, index: true },
  category: { type: String, index: true },
  rating: Number,
  description: String,
  price: { type: Number, index: true },
  discountPercentage: Number,
  availabilityStatus: { type: String, index: true }
});

productSchema.index({
  category: 1,
  brand: 1,
  price: 1,
  availabilityStatus: 1
});

productSchema.index({
  title: "text",
  description: "text",
  brand: "text",
  category: "text"
}, {
  // Weights determine priority (Title match is more important than description match)
  weights: {
    title: 10,
    brand: 5,
    category: 5,
    description: 1
  }
});

export default mongoose.model("Product", productSchema);