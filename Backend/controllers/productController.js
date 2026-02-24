import Product from '../models/productModel.js';
import { productValidationSchema } from '../validators/productValidation.js';

//get products
export const getProducts = async (req, res) => {
  try {

    const {
      q,
      categories,
      brands,
      availability,
      ratings,
      priceRange,
      page,
      limit
    } = req.query;

    let query = {};

    // Search
    if (q) {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
        { brand: { $regex: q, $options: "i" } },
        { category: { $regex: q, $options: "i" } }
      ];
    }

    // Category
    if (categories) {
      query.category = { $in: categories.split(",") };
    }

    // Brand
    if (brands) {
      query.brand = { $in: brands.split(",") };
    }

    // Availability
    if (availability) {
      query.availabilityStatus = { $in: availability.split(",") };
    }

    // Rating
    if (ratings) {
      query.rating = { $gte: Math.min(...ratings.split(",").map(Number)) };
    }

    // Price
    if (priceRange) {
      const ranges = priceRange.split(",");

      query.$or = ranges.map((r) => {
        if (r === "1000+") {
          return { price: { $gte: 1000 } };
        }

        const [min, max] = r.split("-").map(Number);

        return { price: { $gte: min, $lte: max } };
      });
    }

    // pagination
    // ================= PAGINATION LOGIC =================
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get data and total count in parallel for performance
    const [products, totalProducts] = await Promise.all([
      Product.find(query).skip(skip).limit(parseInt(limit)),
      Product.countDocuments(query)
    ]);


    // const products = await Product.find(query);

    return res.status(200).json({
      products,
      totalPages: Math.ceil(totalProducts / limit), // limit = 10 so total pages = 30/10 than 3 pages
      totalProducts, // 30 products
      // currentPage: parseInt(page) //
    });

  } catch (error) {
    console.error("getProducts error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch products"
    });
  }
};

// addd
export const addProduct = async (req, res) => {
  try {
    console.log("backend api reached");
    console.log("api body",req.body);
    //  validator add schema
    const parsedData = productValidationSchema.safeParse(req.body);


    // xtra
    console.log("reahed to parse");
    if (!parsedData.success) {
      return res.status(400).json({
        errors: parsedData.error.issues.map((err) => ({
            field: err.path.join('.'),
            message: err.message
        })),
      });
    }
    console.log("failed to parse")

    const validProductData = parsedData.data;
    const newProduct = new Product(validProductData);

    await newProduct.save();
    console.log("product saved to db");

    res.status(201).json(
        // message: "Product added successfully", 
        // product: 
        newProduct 
    );

  } catch (error) {
    console.error("Error in addProduct:", error);
    res.status(500).json({ error: "Internal Server Error while adding product" });
  }
};

// edit 
export const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Product ID is required." });
    }
//  validator same as add
    const parsedData = productValidationSchema.safeParse(req.body);


    // xtra 
    if (!parsedData.success) {
      return res.status(400).json({
        errors: parsedData.error.errors.map((err) => ({
            field: err.path.join('.'),
            message: err.message
        })),
      });
    }

    const validUpdates = parsedData.data;

    const updatedProduct = await Product.findByIdAndUpdate(id, validUpdates, { new: true });

    if (!updatedProduct) {
      return res.status(404).json({ error: "Product not found." });
    }

    res.status(200).json(
        // message: "Product updated successfully", 
        // product: 
        updatedProduct 
    );

  } catch (error) {
    console.error("Error in editProduct:", error);
    if (error.name === 'CastError') {
        return res.status(400).json({ error: "Invalid product ID format." });
    }
    res.status(500).json({ error: "Internal Server Error while updating product" });
  }
};

export const getFilters = async (req, res) => {
  try {
    const [categories, brands, availability] = await Promise.all([
      Product.distinct("category"),
      Product.distinct("brand"),
      Product.distinct("availabilityStatus")
    ]);

    res.status(200).json({
      categories,
      brands,
      availability,
      ratings: [1, 2, 3, 4, 5],
      priceRange: ["0-100", "100-500", "500-1000", "1000+"]
    });

  } catch (error) {
    console.error("getFilterOptions error:", error);
    res.status(500).json({ message: "Failed to fetch filter options" });
  }
};