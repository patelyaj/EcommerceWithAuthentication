// models/product.model.js

import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  thumbnail: String,
  title: String,
  brand: String,
  category: String,
  rating: Number,
  description: String,
  price: Number,
  discountPercentage: Number,
  availabilityStatus: String
});

export default mongoose.model("Product", productSchema);