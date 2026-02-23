import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const userFromStorage = localStorage.getItem('userInfo') ? JSON.parse(localStorage.getItem('userInfo')) : null;

export const loginUser = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post('http://localhost:5000/users/login', userData,{withCredentials:true});  

      console.log('login',data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      return data;
      
    } catch (err) {
      // return rejectWithValue(err.response?.data?.message || 'Login failed');
      // return rejectWithValue(`Login failed ${err}`);
      const errorMessage = err.response?.data?.error || "Login failed"; 
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      console.log("thunk called");
      const { data } = await axios.post('http://localhost:5000/users/signup', userData,{withCredentials:true});
      console.log("regis",data);
      localStorage.setItem('userInfo', JSON.stringify(data));

      return data;
    } catch (err) {
      // return rejectWithValue(err.response?.data?.message || 'Signup failed');
      // return rejectWithValue(`Signup failed ${err}`);
      const errorMessage = err.response?.data?.error || "Signup failed";
  return rejectWithValue(errorMessage);
    }
  }
);

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async(_,{rejectWithValue})=>{
    try {
      const {data} = await axios.post('http://localhost:5000/users/logout', {} , {withCredentials:true});
      console.log('logout res',data.message);
      return data;
    } catch (error) {
      return rejectWithValue(`logout failed ${error}`);
    }
  }
)

// mainn
const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: userFromStorage, // Initialize from LocalStorage
    isAuthenticated: !!userFromStorage,
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    
    // Non-async reducers
    // logout: (state) => {
    //   localStorage.removeItem('userInfo');
    //   state.user = null;
    //   state.success = false;
    //   state.error = null;
    //   state.isAuthenticated = false;
    // },

    // resetError: (state) => {
    //   state.error = null;
    // }
  },

  extraReducers: (builder) => {
    builder
      // --- Login Handlers ---
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        console.log(state.error);
      })
      // --- Register Handlers ---
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
        console.log(state.error);
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
    })
    
    .addCase(logoutUser.fulfilled, (state) => {
        localStorage.removeItem('userInfo');
        state.user = null;
        state.success = false;
        state.error = null;
        state.isAuthenticated = false;
    })
    
    .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        // FORCE LOGOUT even if backend failed
        state.user = null;
        state.isAuthenticated = false;
        localStorage.removeItem("userInfo");
        
        // We track the error just for debugging, but we don't stop the user
        state.error = action.payload;
    })
  },
});


export default authSlice.reducer;
export const { clearStatus } = authSlice.actions;