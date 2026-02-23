import './App.css'
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Pages/PublicPages/Login';
import Signup from './Pages/PublicPages/Signup';
import Home from './Pages/PublicPages/Home';
// import Dashboard from './Pages/PrivatePages/Dashboard';
import PrivateRoute from './Components/routes/PrivateRoute';
import PublicRoute from './Components/routes/PublicRoute';
import Navbar from './Components/Navbar';
import HomePage from './Pages/PrivatePages/HomePage';
import FilterNavbar from './Components/FilterNavbar';
import ProductForm from './Pages/PrivatePages/ProductForm';
import { useSelector } from 'react-redux';
function App() {
const { isFormOpen } = useSelector(state => state.product);
  return (
    <>
      <BrowserRouter>
      <Routes>

        {/* PUBLIC */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={ <Home/>} />
        </Route>

        {/* PRIVATE */}
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={
            <>
              <Navbar />
              <FilterNavbar/>
              <HomePage />
              
            {/* Modal */}
      {isFormOpen && <ProductForm />}
            </>
          } />
          <Route path="/product/Form" element={<ProductForm/>}></Route>
        </Route>

      </Routes>
    </BrowserRouter>
    </>
  )
}

export default App; 