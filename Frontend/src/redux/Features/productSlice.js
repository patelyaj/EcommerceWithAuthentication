  import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
  import axios from "axios";

  export const fetchProducts = createAsyncThunk(
    "products/getProducts",
    async ({params,limit=10,page=1}, { rejectWithValue }) => {
      try {
        const response = await axios.get(`http://localhost:5000/products/getProducts`, {
          params : {
            ...params,
            page,
            limit
          },
          withCredentials: true
        });
        return response.data;
      } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to fetch products");
      }
    }
  );

  export const addProduct = createAsyncThunk("products/addProduct", async (productData, { rejectWithValue }) => {
    try { 
      const response = await axios.post('http://localhost:5000/products/addProduct', productData, {
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || error.response?.data?.error || "Failed to add product"
      );
    }
  });

  export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, productData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`http://localhost:5000/products/editProduct/${id}`, productData, {
        withCredentials: true 
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors || error.response?.data?.error || "Failed to update product"
      );
    }
  });

  // --- HELPER FUNCTION TO MERGE FILTERS ---
  // This prevents filters from vanishing when we restrict the product list
  const mergeFilterOptions = (state, products) => {
    state.filterOptions.categories = [
      ...new Set([...state.filterOptions.categories, ...products.map(p => p.category)])
    ].filter(Boolean);

    state.filterOptions.brands = [
      ...new Set([...state.filterOptions.brands, ...products.map(p => p.brand)])
    ].filter(Boolean);

    state.filterOptions.tags = [
      ...new Set([...state.filterOptions.tags, ...products.map(p => p.tags).flat()])
    ].filter(Boolean);
  };

  const productSlice = createSlice({
      name: 'product',
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
          loading: null,
          error: null,
          isFormOpen: false,
          editData: null,

          totalPages: 1, // Start with 1 so the UI has a default 30/10 = 30 pages
          totalProducts: 0, // 30 products
      },
      reducers: {
          openForm: (state, action) => {
              state.isFormOpen = true;
              state.editData = action.payload || null; 
          },
          closeForm: (state) => {
              state.isFormOpen = false;
              state.editData = null;
          }
      },
      extraReducers: (builder) => {
          builder
              .addCase(fetchProducts.pending, (state) => {
                  state.loading = true;
                  state.error = null;
              })
              .addCase(fetchProducts.fulfilled, (state, action) => {
                  state.loading = false;
                  state.products = action.payload.products;

                  state.totalPages = action.payload.totalPages;
                  state.totalProducts = action.payload.totalProducts;

                  mergeFilterOptions(state, action.payload.products);
              })
              .addCase(fetchProducts.rejected, (state, action) => {
                  state.loading = false;
                  state.error = action.payload;
              })
              // Add Product
              .addCase(addProduct.pending, (state) => {
                state.loading = true;
              })
              .addCase(addProduct.fulfilled, (state, action) => {
                state.loading = false;
                state.products.unshift(action.payload); // Add to UI list
                
                // NEW: Update filter dropdowns immediately without a refresh!
                mergeFilterOptions(state, [action.payload]);

                state.isFormOpen = false;
                state.editData = null;
              })
              .addCase(addProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              })
              // Update Product
              .addCase(updateProduct.pending, (state) => {
                state.loading = true;
              })
              .addCase(updateProduct.fulfilled, (state, action) => {
                state.loading = false;
                const updatedProduct = action.payload;
                const index = state.products.findIndex((p) => p._id === updatedProduct._id);
                if (index !== -1) {
                  state.products[index] = updatedProduct;
                }
                
                // NEW: Update filter dropdowns dynamically if category/brand changed
                mergeFilterOptions(state, [updatedProduct]);

                state.isFormOpen = false;
                state.editData = null;
              })
              .addCase(updateProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
              });
      }
  });

  export const { openForm, closeForm } = productSlice.actions;
  export default productSlice.reducer;