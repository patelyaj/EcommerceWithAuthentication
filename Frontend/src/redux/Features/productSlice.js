import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

/* =========================
   FETCH FILTER OPTIONS
========================= */
export const fetchFilterOptions = createAsyncThunk(
  "product/fetchFilterOptions",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/products/filters",
        { withCredentials: true }
      );
      return res.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch filter options"
      );
    }
  }
);

/* =========================
   FETCH PRODUCTS
========================= */
export const fetchProducts = createAsyncThunk(
  "products/getProducts",
  async ({ params, limit = 10, page = 1 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "http://localhost:5000/products/getProducts",
        {
          params: {
            ...params,
            page,
            limit,
          },
          withCredentials: true,
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

/* =========================
   ADD PRODUCT
========================= */
export const addProduct = createAsyncThunk(
  "products/addProduct",
  async (productData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/products/addProduct",
        productData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors ||
          error.response?.data?.error ||
          "Failed to add product"
      );
    }
  }
);

/* =========================
   UPDATE PRODUCT
========================= */
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(
        `http://localhost:5000/products/editProduct/${id}`,
        productData,
        { withCredentials: true }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors ||
          error.response?.data?.error ||
          "Failed to update product"
      );
    }
  }
);

/* =========================
   HELPER FUNCTION
========================= */
const mergeFilterOptions = (state, products) => {
  const categories = new Set(state.filterOptions.categories);
  const brands = new Set(state.filterOptions.brands);
  const tags = new Set(state.filterOptions.tags);

  products.forEach((p) => {
    if (p.category) categories.add(p.category);
    if (p.brand) brands.add(p.brand);

    if (Array.isArray(p.tags)) {
      p.tags.forEach((tag) => tags.add(tag));
    }
  });

  state.filterOptions.categories = [...categories];
  state.filterOptions.brands = [...brands];
  state.filterOptions.tags = [...tags];
};

/* =========================
   SLICE
========================= */
const productSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    filterOptions: {
      categories: [],
      brands: [],
      tags: [],
      priceRange: ["0-50", "50-100", "100-500", "500-1000", "1000+"],
      ratings: [5, 4, 3, 2, 1],
      availability: ["In Stock", "Low Stock", "Out of Stock"],
    },

    loading: false,
    error: null,
    isFormOpen: false,
    editData: null,

    totalPages: 1,
    totalProducts: 0,
  },

  reducers: {
    openForm: (state, action) => {
      state.isFormOpen = true;
      state.editData = action.payload || null;
    },
    closeForm: (state) => {
      state.isFormOpen = false;
      state.editData = null;
    },
  },

  extraReducers: (builder) => {
    builder

      /* ===== FETCH FILTER OPTIONS ===== */
      .addCase(fetchFilterOptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFilterOptions.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const { categories = [], brands = [], tags = [] } =
          action.payload || {};

        state.filterOptions.categories = categories;
        state.filterOptions.brands = brands;
        state.filterOptions.tags = tags;
      })
      .addCase(fetchFilterOptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== FETCH PRODUCTS ===== */
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.products = action.payload.products || [];
        state.totalPages = action.payload.totalPages || 1;
        state.totalProducts = action.payload.totalProducts || 0;

        mergeFilterOptions(state, state.products);
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== ADD PRODUCT ===== */
      .addCase(addProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (state.products.length < 10) {
          state.products.unshift(action.payload);
        }

        mergeFilterOptions(state, [action.payload]);

        state.isFormOpen = false;
        state.editData = null;
      })
      .addCase(addProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      /* ===== UPDATE PRODUCT ===== */
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        const updatedProduct = action.payload;
        const index = state.products.findIndex(
          (p) => p._id === updatedProduct._id
        );

        if (index !== -1) {
          state.products[index] = updatedProduct;
        }

        mergeFilterOptions(state, [updatedProduct]);

        state.isFormOpen = false;
        state.editData = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { openForm, closeForm } = productSlice.actions;
export default productSlice.reducer;