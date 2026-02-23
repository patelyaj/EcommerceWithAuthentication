import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, X, RotateCcw } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { openForm } from '../redux/Features/productSlice';

import { useNavigate } from 'react-router-dom';
function FilterNavbar() {
    const [searchParams, setSearchParams] = useSearchParams();
    const filterOptions = useSelector((state) => state.product.filterOptions);
    const dispatch = useDispatch();
    const [activeDropdown, setActiveDropdown] = useState(null);
    const dropdownRef = useRef(null);

    const navigate = useNavigate();
    const filters = [
        { key: 'categories', label: 'Category' },
        { key: 'brands', label: 'Brand' },
        // { key: 'tags', label: 'Tag' },
        { key: 'priceRange', label: 'Price' },
        { key: 'ratings', label: 'Rating' },
        { key: 'availability', label: 'Availability' },
    ];

    // Close the filter dropdown if we click anywhere else on the page
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setActiveDropdown(null);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleFilterSelect = (key, value) => {
        const newParams = new URLSearchParams(searchParams);
        
        // If they click a filter they already selected, we change it with new one 
        if (newParams.get(key) === String(value)) {
            newParams.delete(key);
        } else {
            newParams.set(key, value);
        }
        
        setSearchParams(newParams);
        setActiveDropdown(null);
    };

    // Clears everything except the search text so the user can start over
    const handleReset = () => {
        const newParams = new URLSearchParams();
        const currentSearch = searchParams.get('q');
        if (currentSearch) newParams.set('q', currentSearch);
        setSearchParams(newParams);
    };

    const handleAdd = ()=>{
        try {
            dispatch(openForm());
            // navigate('/product/Form');
        } catch (error) {
            console.log("err =",error);
        }
    }
    const activeFilterCount = filters.filter((filter) => {
    const value = searchParams.get(filter.key);

    if (!value) return false;

    const validOptions = filterOptions[filter.key] || [];

    return validOptions
        .map(String)
        .includes(String(value));

    }).length;

    return (
        <div className="w-full bg-gray-50 border-b border-gray-200 py-3 px-5 flex flex-row justify-between">
            <div className="flex items-center gap-3 min-w-max" ref={dropdownRef}>
                
                {filters.map((filter) => {
                    const isActive = searchParams.has(filter.key);
                    const rawValue = searchParams.get(filter.key);

                    // Check if the URL value is actually real based on our data
                    const validOptions = filterOptions[filter.key] || [];
                    const isValidValue = validOptions.map(String).includes(String(rawValue));
                    
                    // The button only turns black and show text if the filter is both present and valid
                    const reallyActive = isActive && isValidValue;

                    return (
                        <div key={filter.key} className="relative">
                            <button
                                onClick={() => setActiveDropdown(activeDropdown === filter.key ? null : filter.key)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                                    border hover:shadow-sm
                                    ${reallyActive 
                                        ? 'bg-gray-900 text-white border-gray-900' 
                                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-300'
                                    }
                                `}
                            >
                                {filter.label}  
                                {reallyActive && <span className="ml-1 text-xs opacity-80">({rawValue})</span>}
                                <ChevronDown size={14} className={`transition-transform ${activeDropdown === filter.key ? 'rotate-180' : ''}`} />
                            </button>

                            {activeDropdown === filter.key && (
                                <div className="z-100 absolute top-full left-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                    <div className="max-h-64 overflow-y-auto p-1">
                                        {filterOptions[filter.key]?.map((option, index) => (
                                            <div
                                                key={index}
                                                onClick={() => handleFilterSelect(filter.key, option)}
                                                className={`
                                                    px-4 py-2.5 text-sm cursor-pointer rounded-lg mx-1 my-0.5 transition-colors
                                                    ${String(rawValue) === String(option) 
                                                        ? 'bg-gray-100 font-semibold text-gray-900' 
                                                        : 'text-gray-600 hover:bg-gray-50'
                                                    }
                                                `}
                                            >
                                                {option} {filter.key === 'ratings' && 'Stars'}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}

               {activeFilterCount > 0 && <div>|</div>}

                {activeFilterCount > 0 && (
                    <button 
                        onClick={handleReset}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                        <RotateCcw size={14} />
                        RESET FILTERS
                        <span className="bg-red-200 text-red-800 text-sm px-1.5 py-0.5 rounded-full">{activeFilterCount}</span>
                    </button>
                )}
            </div>
            <div className=''>
                <button onClick={handleAdd} className="bg-gray-900 hover:bg-white hover:text-gray-900 border hover:border-gray-300 text-white text-sm p-2 rounded shadow-lg shadow-gray-200 active:scale-90">
                        <span className='flex justify-center item-center gap-2'>
                          <div>ADD PRODUCT</div></span>
                      </button>
            </div>
        </div>
    );
}

export default FilterNavbar;