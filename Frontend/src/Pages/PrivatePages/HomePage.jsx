import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, openForm } from "../../redux/Features/productSlice";
import { Star, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react";
import { useSearchParams } from "react-router-dom";

function HomePage() {
  const dispatch = useDispatch();

  // Redux state
  const { products, loading, error, totalPages } = useSelector(
    (state) => state.product
  );

  // URL params (filters/search)
  const [searchParams] = useSearchParams();

  // Pagination (Frontend controls page)
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  // ================= FETCH PRODUCTS =================
  useEffect(() => {
    const params = Object.fromEntries([...searchParams]);

    dispatch(
      fetchProducts({
        params,
        limit: limit,
        page: currentPage,
      })
    );
  }, [dispatch, searchParams, currentPage,limit]);

  // Reset page when filters/ search change // also manual search 
  useEffect(() => {
    setCurrentPage(1);
  }, [searchParams]);

  // ================= PAGE CHANGE =================
  const handlePageChange = (page) => {
    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // ================= STAR RENDER =================
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        size={14}
        className={
          i < Math.round(rating)
            ? "fill-yellow-400 text-yellow-400"
            : "fill-gray-200 text-gray-200"
        }
      />
    ));
  };

  // ================= LOADING / ERROR =================
  if (loading) {
    return (
      <div className="text-center py-20 text-gray-600 text-lg">
        Loading products...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 text-red-600 text-lg">
        {error}
      </div>
    );
  }

  // ================= UI =================
  return (
    <div className="bg-gray-100 py-5">
      <div className="mx-auto px-4">
        {/* ================= PRODUCTS GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {products.length === 0 && (
            <p className="col-span-full text-center text-gray-500 py-20">
              No products found
            </p>
          )}

          {products.map((product) => {
            const originalPrice = (
              product.price /
              (1 - product.discountPercentage / 100)
            ).toFixed(2);

            return (
              <div
                key={product._id}
                className="bg-white rounded shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* ================= IMAGE ================= */}
                <div className="relative h-40 bg-gray-50 p-2">
                  <img
                    src={product.thumbnail}
                    alt={product.title}
                    className="w-full h-full object-contain hover:scale-110 transition-all"
                  />

                  {/* Availability */}
                  <span
                    className={`absolute top-3 left-3 p-1.5 rounded text-xs font-bold uppercase border
                      ${
                        product.availabilityStatus === "In Stock"
                          ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                          : "bg-red-100 text-red-700 border-red-200"
                      }`}
                  >
                    {product.availabilityStatus}
                  </span>

                  {/* Discount */}
                  <span className="absolute top-3 right-3 bg-gray-900 text-white text-xs font-bold px-2 py-1 rounded">
                    -{product.discountPercentage}%
                  </span>
                </div>

                {/* ================= CONTENT ================= */}
                <div className="p-4 flex flex-col flex-grow">
                  {/* Brand / Category */}
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-600 uppercase">
                      {product.brand || "Generic"}
                    </span>

                    <span className="text-xs text-gray-400 capitalize">
                      {product.category}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-gray-900 font-semibold text-lg mb-2"
                    title={product.title}
                  >
                    {product.title}
                  </h3>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {renderStars(product.rating)}
                    <span className="text-xs text-gray-400">
                      ({product.rating})
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-gray-500 text-xs mb-4 h-10">
                    {product.description}
                  </p>

                  {/* ================= PRICE + ACTION ================= */}
                  <div className="flex items-end justify-between mt-auto">
                    <div>
                      <span className="text-xs text-gray-400 line-through">
                        ${originalPrice}
                      </span>

                      <div className="text-2xl font-bold text-gray-900">
                        ${product.price}
                      </div>
                    </div>

                    <div className="gap-5 flex flex-row">
                      <button
                        onClick={() => dispatch(openForm(product))}
                        className="bg-gray-900 hover:bg-white hover:text-gray-900 border hover:border-gray-300 text-white text-sm px-3 py-2 rounded shadow active:scale-95 transition-all"
                      >
                        <span className="flex items-center gap-2">
                          Edit
                        </span>
                      </button>

                      <button className="bg-gray-900 hover:bg-white hover:text-gray-900 border hover:border-gray-300 text-white text-sm px-3 py-2 rounded shadow active:scale-95 transition-all">
                        <span className="flex items-center gap-2">
                          ADD TO CART
                          <ShoppingCart size={18} />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ================= PAGINATION ================= */}
        {totalPages > 1 && (
        <div className="flex justify-between items-center mt-10 pb-5">

          {/* Empty div for spacing (left side) */}
          <div />

          {/* ================= PAGINATION BUTTONS ================= */}
          <div className="flex items-center gap-2">
            {/* Prev */}
            <button
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
              className="p-2 rounded border bg-white disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronLeft size={20} />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => handlePageChange(i + 1)}
                className={`px-4 py-2 rounded border text-sm font-bold transition-all
                  ${
                    currentPage === i + 1
                      ? "bg-gray-900 text-white border-gray-900"
                      : "bg-white text-gray-700 hover:border-gray-400"
                  }`}
              >
                {i + 1}
              </button>
            ))}

            {/* Next */}
            <button
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
              className="p-2 rounded border bg-white disabled:opacity-50 hover:bg-gray-50"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* ================= LIMIT DROPDOWN ================= */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">limit:</span>

            <select
              value={limit}
              onChange={(e) => {const newLimit = Number(e.target.value);
                setCurrentPage(1);
                setLimit(newLimit);
            }}
              className="border rounded px-2 py-1 bg-white text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>
        </div>
      )}
      </div>
    </div>
  );
}

export default HomePage;