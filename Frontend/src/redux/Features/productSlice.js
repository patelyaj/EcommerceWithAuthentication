import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Modified to accept a 'query' argument
export const fetchProducts = createAsyncThunk(
  "products/getProducts",
  async (params, { rejectWithValue }) => {
    try {

      const response = await axios.get(
        "http://localhost:5000/products/getProducts",
        {
          params, // ???
          withCredentials: true
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

export const addProduct = createAsyncThunk("products/addProduct", async (productData, { rejectWithValue }) => {
  try { 
    // Assuming you need credentials (cookies) for your verifyToken middleware
    console.log("thunk called");
    const response = await axios.post('http://localhost:5000/products/addProduct', productData, {
      withCredentials: true 
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    // return rejectWithValue(error.response?.data?.error || "Failed to add product");
    return rejectWithValue(
      error.response?.data?.errors || 
      error.response?.data?.error || 
      "Failed to add product"
    );
  }
});

export const updateProduct = createAsyncThunk("products/updateProduct", async ({ id, productData }, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`http://localhost:5000/products/editProduct/${id}`, productData, {
      withCredentials: true 
    });
    console.log(response.data);
    return response.data;
  } catch (error) {
    // return rejectWithValue(error.response?.data?.error || "Failed to update product");
    return rejectWithValue(
      error.response?.data?.errors || 
      error.response?.data?.error || 
      "Failed to add product"
    );
  }
});


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
            availability: ["In Stock", "Low Stock", "Out of Stock"]
        },
        loading: null,
        error: null,
        isFormOpen: false,
        editData: null
    },
    reducers: {
      // NEW: Actions to open and close the form
        openForm: (state, action) => {
            state.isFormOpen = true;
            // If an object is passed, we are editing. If undefined, we are adding.
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
                const products  = action.payload.products;
                state.products = products

                state.filterOptions.categories = [
                    ...new Set(products.map(p => p.category))
                ];  

                console.log("categories",state.filterOptions.categories);
              
                state.filterOptions.brands = [
                    ...new Set(products.map(p => p.brand).filter(Boolean))
                ];
                console.log("brands",state.filterOptions.brands)

              
                state.filterOptions.tags = [
                  ...new Set(products.map(p => p.tags).flat().filter(Boolean))
                  // ...new Set(products.map(p => p.tags).filter(Boolean))
                ];
                        console.log("tags",state.filterOptions.tags )
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            //add
            .addCase(addProduct.pending, (state) => {
              state.loading = true;
            })

            .addCase(addProduct.fulfilled, (state, action) => {
              state.loading = false;

              // Add new product to list
              state.products.unshift(action.payload);

              state.isFormOpen = false;
              state.editData = null;
            })

            .addCase(addProduct.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })


            // ================= UPDATE =================
            .addCase(updateProduct.pending, (state) => {
              state.loading = true;
            })

            .addCase(updateProduct.fulfilled, (state, action) => {
              state.loading = false;

              const updatedProduct = action.payload;

              const index = state.products.findIndex(
                (p) => p._id === updatedProduct._id
              );

              if (index !== -1) {
                state.products[index] = updatedProduct;
              }

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