// src/pages/Shop.js
import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import ProductCard from "../components/ProductCard";

/* ───────────── icons ───────────── */
const Icon = ({ children, className = "" }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`w-5 h-5 ${className}`}>
    {children}
  </svg>
);
const FilterIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 1 1-3 0m3 0a1.5 1.5 0 1 0-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m-9.75 0h9.75" />
  </Icon>
);
const SearchIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </Icon>
);
const XIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </Icon>
);
const TagIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
  </Icon>
);
const ChevronLeftIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
  </Icon>
);
const ChevronRightIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
  </Icon>
);
const BookIcon = (p) => (
  <Icon {...p}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
  </Icon>
);

/* ───────────── active filter chip ───────────── */
const FilterChip = ({ label, onRemove }) => (
  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-primary/5 text-primary text-xs font-semibold border border-primary/10">
    {label}
    <button onClick={onRemove} className="ml-0.5 hover:bg-primary/10 rounded-full p-0.5 transition-colors">
      <XIcon className="w-3 h-3" />
    </button>
  </span>
);

/* ───────────── main component ───────────── */
const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const initialFilters = {
    brand: "",
    category: "",
    discounted: false,
    minPrice: 0,
    maxPrice: 2000,
    page: 1,
    limit: 9,
  };

  const [filters, setFilters] = useState(initialFilters);

  const fetchProducts = useCallback(async (customFilters = filters) => {
    setLoading(true);
    try {
      const params = { ...customFilters };
      Object.keys(params).forEach((key) => {
        if (params[key] === "" || params[key] === 0 || params[key] === false) delete params[key];
      });
      if (searchTerm) params.q = searchTerm;

      const res = await axios.get(`${process.env.REACT_APP_API_URL}/products`, { params });
      const activeProducts = res.data.data.filter((p) => p.isActive === true);
      setProducts(activeProducts || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm]);

  useEffect(() => {
    const fetchCategoriesAndBrands = async () => {
      try {
        const [categoriesRes, brandsRes] = await Promise.all([
          axios.get(`${process.env.REACT_APP_API_URL}/products/categories`),
          axios.get(`${process.env.REACT_APP_API_URL}/products/brands`),
        ]);
        setCategories(categoriesRes.data || []);
        setBrands(brandsRes.data || []);
      } catch (err) {
        console.error("Failed to fetch categories or brands:", err);
      }
    };
    fetchCategoriesAndBrands();
  }, []);

  useEffect(() => {
    const params = Object.fromEntries(searchParams);
    setFilters({
      category: params.category || "",
      brand: params.brand || "",
      minPrice: params.minPrice ? Number(params.minPrice) : 0,
      maxPrice: params.maxPrice ? Number(params.maxPrice) : 2000,
      page: params.page ? Number(params.page) : 1,
      limit: params.limit ? Number(params.limit) : 9,
      discounted: params.discounted === "true",
    });
  }, [searchParams]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => fetchProducts(), 500);
    return () => clearTimeout(delayDebounceFn);
  }, [fetchProducts]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = type === "checkbox" ? checked : value;
    const updatedFilters = { ...filters, [name]: val };
    if (name !== "page") updatedFilters.page = 1;
    setFilters(updatedFilters);

    const updatedParams = new URLSearchParams(searchParams);
    if (val && val !== "" && val !== 0 && val !== false) {
      updatedParams.set(name, val);
    } else {
      updatedParams.delete(name);
    }
    setSearchParams(updatedParams);
  };

  const clearFilter = (name) => {
    const updatedFilters = { ...filters, [name]: initialFilters[name], page: 1 };
    setFilters(updatedFilters);
    const updatedParams = new URLSearchParams(searchParams);
    updatedParams.delete(name);
    setSearchParams(updatedParams);
  };

  const clearAllFilters = () => {
    setFilters(initialFilters);
    setSearchTerm("");
    setSearchParams({});
  };

  const activeFilterCount = [
    filters.category,
    filters.brand,
    filters.discounted,
    searchTerm,
  ].filter(Boolean).length;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 min-h-screen py-8 sm:py-12">
      {/* ───── Header ───── */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Shop Notebooks
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Explore our full range and find the format that fits your workflow.
        </p>
      </div>

      {/* ───── Search + Filter bar ───── */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        {/* Search */}
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notebooks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-gray-100 transition-colors"
            >
              <XIcon className="w-3.5 h-3.5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Filter toggle */}
        <button
          onClick={() => setShowFilters((prev) => !prev)}
          className={`
                        inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                        ${showFilters
              ? "bg-primary text-white shadow-md shadow-primary/20"
              : "bg-white text-gray-700 border border-gray-200 hover:border-primary hover:text-primary"
            }
                    `}
        >
          <FilterIcon className="w-4 h-4" />
          Filters
          {activeFilterCount > 0 && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${showFilters ? "bg-white/20" : "bg-primary text-white"}`}>
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* ───── Filter panel ───── */}
      <div
        className={`overflow-hidden transition-all duration-300 ${showFilters ? "max-h-[400px] opacity-100 mb-6" : "max-h-0 opacity-0"}`}
      >
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Category */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Category</label>
              <select
                name="category"
                onChange={handleChange}
                value={filters.category}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat, i) => (
                  <option key={i} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Brand</label>
              <select
                name="brand"
                onChange={handleChange}
                value={filters.brand}
                className="w-full px-3.5 py-2.5 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none"
              >
                <option value="">All Brands</option>
                {brands.map((brand, i) => (
                  <option key={i} value={brand}>{brand}</option>
                ))}
              </select>
            </div>

            {/* Discounted */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Discount</label>
              <button
                onClick={() => {
                  const newDiscounted = !filters.discounted;
                  const updatedParams = new URLSearchParams(searchParams);
                  if (newDiscounted) updatedParams.set("discounted", "true");
                  else updatedParams.delete("discounted");
                  setSearchParams(updatedParams);
                  setFilters((prev) => ({ ...prev, discounted: newDiscounted, page: 1 }));
                }}
                className={`
                                    w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                                    ${filters.discounted
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:border-primary hover:text-primary"
                  }
                                `}
              >
                <TagIcon className="w-4 h-4" />
                {filters.discounted ? "On Sale" : "All Prices"}
              </button>
            </div>

            {/* Clear all */}
            <div className="flex items-end">
              <button
                onClick={clearAllFilters}
                className="w-full px-3.5 py-2.5 rounded-xl text-sm font-medium text-gray-500 border border-gray-200 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-all"
              >
                Clear All
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ───── Active filter chips ───── */}
      {activeFilterCount > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="text-xs text-gray-400 font-medium">Active:</span>
          {filters.category && (
            <FilterChip label={filters.category} onRemove={() => clearFilter("category")} />
          )}
          {filters.brand && (
            <FilterChip label={filters.brand} onRemove={() => clearFilter("brand")} />
          )}
          {filters.discounted && (
            <FilterChip label="On Sale" onRemove={() => clearFilter("discounted")} />
          )}
          {searchTerm && (
            <FilterChip label={`"${searchTerm}"`} onRemove={() => setSearchTerm("")} />
          )}
        </div>
      )}

      {/* ───── Results count ───── */}
      {!loading && (
        <p className="text-xs text-gray-400 font-medium mb-4">
          {products.length} {products.length === 1 ? "notebook" : "notebooks"} found
          {filters.page > 1 && ` — Page ${filters.page}`}
        </p>
      )}

      {/* ───── Products grid ───── */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="aspect-[4/5] bg-gray-100 animate-pulse" />
              <div className="p-4 space-y-2.5">
                <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-3/4 bg-gray-100 rounded animate-pulse" />
                <div className="h-4 w-1/2 bg-gray-100 rounded animate-pulse" />
                <div className="flex justify-between items-end pt-2">
                  <div className="h-5 w-20 bg-gray-100 rounded animate-pulse" />
                  <div className="w-9 h-9 bg-gray-100 rounded-xl animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <BookIcon className="w-7 h-7 text-gray-400" />
          </div>
          <h3 className="text-base font-bold text-gray-900 mb-1">No notebooks found</h3>
          <p className="text-sm text-gray-500 mb-4">Try adjusting your filters or search term.</p>
          <button
            onClick={clearAllFilters}
            className="text-sm text-primary font-medium hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}

      {/* ───── Pagination ───── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1.5 mt-12">
          <button
            disabled={filters.page <= 1}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page - 1 }))}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ChevronLeftIcon className="w-4 h-4" />
          </button>

          {Array.from({ length: totalPages }, (_, i) => {
            const page = i + 1;
            const current = filters.page === page;
            // Show limited pages
            if (totalPages > 7 && Math.abs(page - filters.page) > 2 && page !== 1 && page !== totalPages) {
              if (page === filters.page - 3 || page === filters.page + 3) {
                return <span key={page} className="w-10 h-10 flex items-center justify-center text-gray-400 text-sm">…</span>;
              }
              return null;
            }
            return (
              <button
                key={page}
                onClick={() => setFilters((prev) => ({ ...prev, page }))}
                className={`
                                    w-10 h-10 rounded-xl text-sm font-semibold transition-all duration-200
                                    ${current
                    ? "bg-primary text-white shadow-md shadow-primary/20"
                    : "text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-primary hover:text-primary"
                  }
                                `}
              >
                {page}
              </button>
            );
          })}

          <button
            disabled={filters.page >= totalPages}
            onClick={() => setFilters((prev) => ({ ...prev, page: prev.page + 1 }))}
            className="w-10 h-10 rounded-xl flex items-center justify-center border border-gray-200 text-gray-500 hover:border-primary hover:text-primary disabled:opacity-30 disabled:pointer-events-none transition-all"
          >
            <ChevronRightIcon className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;