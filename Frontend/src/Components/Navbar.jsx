import React, { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, X } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useDispatch,useSelector } from "react-redux";
import { logoutUser } from "../redux/Features/authSlice";
function Navbar() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();
  const user = useSelector((state)=>state.auth);

  const [searchInput, setSearchInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const searchRef = useRef(null);

  // Close suggestion box when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Sync input value with URL
  useEffect(() => {
    const query = searchParams.get("q") || "";

    setSearchInput(query);
    setIsTyping(false);
    setShowSuggestions(false);
  }, [searchParams]);

  // debouncing here //
  // Fetch search suggestions when user types
  useEffect(() => {
    if (!isTyping) return;

    if (!searchInput.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get(
          `https://dummyjson.com/products/search?q=${searchInput}&limit=5`
        );

        setSuggestions(res.data.products);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Suggestion Error:", err);
      }
    };

    const timer = setTimeout(fetchSuggestions, 400);

    return () => clearTimeout(timer);
  }, [searchInput, isTyping]);




  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
    setIsTyping(true);
    setShowSuggestions(true);
  };

//   Main Execution Point
  const executeSearch = (query) => {
    setIsTyping(false);
    setShowSuggestions(false);

    const params = new URLSearchParams(searchParams);

    if (query.trim()) {
      params.set("q", query);
    } else {
      params.delete("q");
    }

    setSearchParams(params);
  };

  const handleSuggestionClick = (title) => {
    setSearchInput(title);
    executeSearch(title);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSuggestions([]);
    executeSearch("");
  };

  const handleLogout = async ()=>{
      const res = await dispatch(logoutUser());
      console.log("logout response",res);
  }

  return (
    <div className="w-full bg-gray-900 flex justify-between items-center py-3 px-5 text-white">

      {/* Logo */}
      <div
        className="text-xl font-bold cursor-pointer"
        onClick={() => navigate("/")}
      >
        E-COMMERCE
      </div>

      {/* Search Bar */}
      <div
        className="flex-grow max-w-xl relative"
        ref={searchRef}
      >
        <div className="flex items-center bg-white rounded">

          <Search size={20} className="text-gray-400 ml-3" />

          <input
            type="text"
            placeholder="SEARCH PRODUCTS..."
            className="border-none outline-none text-gray-900 ml-2 p-2 flex-grow"
            value={searchInput}
            onChange={handleSearchChange}

            onKeyDown={(e) => {
              if (e.key === "Enter") {
                executeSearch(searchInput);
              }
            }}
          />

          {/* Clear Button */}
          {searchInput && (
            <button
              onClick={clearSearch}
              className="text-gray-400 hover:text-gray-600 mr-2"
            >
              <X size={18} />
            </button>
          )}

          {/* Search Button */}
          <button
            onClick={() => executeSearch(searchInput)}
            className="bg-blue-500 hover:bg-blue-700 text-white px-5 py-3 rounded-r font-bold"
          >
            SEARCH
          </button>
        </div>

        {/* Suggestions */}
        {showSuggestions && suggestions.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-xl rounded-b mt-1 z-50 overflow-hidden">

            {suggestions.map((item) => (
              <div
                key={item.id}
                className="px-4 py-3 hover:bg-gray-100 cursor-pointer text-gray-800"
                onClick={() =>
                  handleSuggestionClick(item.title)
                }
              >
                {item.title}
              </div>
            ))}

          </div>
        )}
      </div>

      {/* Cart */}
      <div className="flex flex-row gap-4">
        <div>
          <h1>{user.username}</h1>
        </div>
        <div>
            <button onClick={handleLogout}>logout</button>
        </div>
        <div>
          <button className="relative p-2 hover:bg-gray-800 rounded-full">
            <ShoppingCart size={24} />
          </button>
        </div>
      </div>

    </div>
  );
}

export default Navbar;
