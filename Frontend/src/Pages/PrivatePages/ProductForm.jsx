import { useDispatch, useSelector } from "react-redux";
// import { addProduct, updateProduct, closeForm } from "../redux/productSlice"; // Adjust path
import { addProduct , updateProduct , closeForm } from "../../redux/Features/productSlice";
// import './ProductForm.css';
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as Yup from "yup";

function ProductForm() {
  const dispatch = useDispatch();
  // Grab state from Redux
  const { isFormOpen, editData, loading } = useSelector((state) => state.product);  
  const navigate = useNavigate();

  // Default empty state aligned with Mongoose schema
  const defaultState = {
    title: "",
    brand: "",
    category: "",
    price: "",
    discountPercentage: "",
    rating: "",
    availabilityStatus: "In Stock",
    thumbnail: "",
    description: "",
  };

  const validationSchema = Yup.object({
    title: Yup.string().min(3, "Title must be at least 3 characters").required("Title is required"),
    brand: Yup.string().min(3, "Brand must be at least 3 characters").required("Brand is required"),
    category: Yup.string().min(3, "Category must be at least 3 characters").required("Category is required"),
    price: Yup.number().typeError("Price must be a number").positive("Price must be greater than 0").required("Price is required"),
    discountPercentage: Yup.number() .typeError("Discount must be a number").max(100, "Maximum value is 100").min(0, "Minimum value is 0").required("discount is required enter 0 if no discount"),
    rating: Yup.number().typeError("Rating must be a number").min(0, "Minimum value is 0").max(5, "Maximum value is 5").required("rating is required enter 0 if no rating"),
    thumbnail: Yup.string().url("Thumbnail must be valid URL").required("Thumbnail is required"),
    description: Yup.string().min(10, "Description must be at least 10 characters").required("Description is required"),
    availabilityStatus: Yup.string().required("Availability is required")
  });

  const formik = useFormik({
    initialValues: editData || defaultState,
    enableReinitialize: true,
    validationSchema,
    onSubmit: async (values) => {

      // Formatting numbers before sending
      const formattedData = {
        ...values,
        price: Number(values.price),
        discountPercentage: Number(values.discountPercentage) || 0,
        rating: Number(values.rating) || 0,
      };

      try {
        if (editData) {
          // Dispatch the Update Thunk (make sure to pass the _id from MongoDB)
          await dispatch(updateProduct({ id: editData._id, productData: formattedData })).unwrap();
        } else {
          // Dispatch the Add Thunk
          await dispatch(addProduct(formattedData)).unwrap();
        }

        // Close the form after submission
        dispatch(closeForm());

      } catch (error) {
        console.log(error);
      }
    },
  });

  // If Redux says form is closed, render nothing
  if (!isFormOpen) return null;

  // Prevent e, E, +, - in number inputs
  const blockInvalidChars = (e) => {
    if (["e", "E", "+", "-","."].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div 
      className="form-overlay fixed inset-0 bg-black/50 z-50 flex justify-center items-center" 
      onClick={() => dispatch(closeForm())}
    >      
      <div 
        className="form-card bg-white p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} /* <--- THIS IS THE FIX */
      >
        <h2 className="text-xl font-bold mb-4">
          {editData ? "Edit Product Details" : "Add New Product"}
        </h2>        
        
        <form onSubmit={formik.handleSubmit} className="form-content space-y-4">
          
          <div className="input-row grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="block text-sm font-medium">Title</label>
              <input
                type="text"
                {...formik.getFieldProps("title")}
                className={`w-full border p-2 rounded ${
                  formik.touched.title && formik.errors.title ? "border-red-500" : ""
                }`}
              />
              {formik.touched.title && formik.errors.title && (
                <p className="text-red-500 text-sm">{formik.errors.title}</p>
              )}
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium">Brand</label>
              <input
                type="text"
                {...formik.getFieldProps("brand")}
                className={`w-full border p-2 rounded ${
                  formik.touched.brand && formik.errors.brand ? "border-red-500" : ""
                }`}
              />
              {formik.touched.brand && formik.errors.brand && (
                <p className="text-red-500 text-sm">{formik.errors.brand}</p>
              )}
            </div>
          </div>

          <div className="input-row grid grid-cols-3 gap-4">
            <div className="input-group">
              <label className="block text-sm font-medium">Price ($)</label>
              <input
                type="number"
                {...formik.getFieldProps("price")}
                onKeyDown={blockInvalidChars}
                className={`w-full border p-2 rounded ${
                  formik.touched.price && formik.errors.price ? "border-red-500" : ""
                }`}
              />
              {formik.touched.price && formik.errors.price && (
                <p className="text-red-500 text-sm">{formik.errors.price}</p>
              )}
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium">Discount (%)</label>
              <input
                type="number"
                {...formik.getFieldProps("discountPercentage")}
                onKeyDown={blockInvalidChars}
                className={`w-full border p-2 rounded ${
                  formik.touched.discountPercentage && formik.errors.discountPercentage
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.discountPercentage && formik.errors.discountPercentage && (
                <p className="text-red-500 text-sm">
                  {formik.errors.discountPercentage}
                </p>
              )}
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium">Rating (0-5)</label>
              <input
                type="number"
                {...formik.getFieldProps("rating")}
                onKeyDown={blockInvalidChars}
                className={`w-full border p-2 rounded ${
                  formik.touched.rating && formik.errors.rating
                    ? "border-red-500"
                    : ""
                }`}
              />
              {formik.touched.rating && formik.errors.rating && (
                <p className="text-red-500 text-sm">
                  {formik.errors.rating}
                </p>
              )}
            </div>
          </div>

          <div className="input-row grid grid-cols-2 gap-4">
            <div className="input-group">
              <label className="block text-sm font-medium">Category</label>
              <input
                type="text"
                {...formik.getFieldProps("category")}
                className={`w-full border p-2 rounded ${
                  formik.touched.category && formik.errors.category ? "border-red-500" : ""
                }`}
              />
              {formik.touched.category && formik.errors.category && (
                <p className="text-red-500 text-sm">{formik.errors.category}</p>
              )}
            </div>

            <div className="input-group">
              <label className="block text-sm font-medium">Availability</label>
              <select
                {...formik.getFieldProps("availabilityStatus")}
                className="w-full border p-2 rounded"
              >
                <option value="In Stock">In Stock</option>
                <option value="Low Stock">Low Stock</option>
                <option value="Out of Stock">Out of Stock</option>
              </select>
            </div>
          </div>

          <div className="input-group">
            <label className="block text-sm font-medium">Thumbnail URL</label>
            <input
              type="url"
              {...formik.getFieldProps("thumbnail")}
              className={`w-full border p-2 rounded ${
                formik.touched.thumbnail && formik.errors.thumbnail ? "border-red-500" : ""
              }`}
            />
              {formik.touched.thumbnail && formik.errors.thumbnail && (
                <p className="text-red-500 text-sm">{formik.errors.thumbnail}</p>
              )}
          </div>

          <div className="input-group">
            <label className="block text-sm font-medium">Description</label>
            <textarea
              rows="3"
              {...formik.getFieldProps("description")}
              className={`w-full border p-2 rounded ${
                formik.touched.description && formik.errors.description ? "border-red-500" : ""
              }`}
            />
              {formik.touched.description && formik.errors.description && (
                <p className="text-red-500 text-sm">{formik.errors.description}</p>
              )}
          </div>

          <div className="form-actions flex justify-end gap-3 mt-4">
            <button
              type="button"
              className="cancel-btn px-4 py-2 border rounded"
              onClick={() => {
                dispatch(closeForm())
                navigate('/dashboard');
              }}
            >
              Cancel
            </button>
            
            <button
              type="submit"
              className="submit-btn px-4 py-2 bg-blue-600 text-white rounded"
              disabled={loading || !formik.isValid}
            >
              {editData ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div >
  );
}

export default ProductForm;