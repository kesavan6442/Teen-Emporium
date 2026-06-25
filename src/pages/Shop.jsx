import React, { useState, useMemo, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../components/ProductCard";
import { 
  Search, 
  SlidersHorizontal, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Star 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

export default function Shop() {
  const { products, getProductRating } = useAppContext();
  const location = useLocation();

  // Filters State
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [maxPrice, setMaxPrice] = useState(60000);
  const [selectedRating, setSelectedRating] = useState(0);
  const [selectedTag, setSelectedTag] = useState("all"); // 'all', 'new', 'trending', 'best'
  
  // Sort State
  const [sortBy, setSortBy] = useState("newest"); // 'newest', 'price-low', 'price-high', 'rating'
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Mobile Filter Drawer toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync initial brand filter from home collections if present in search query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const brandParam = params.get("brand");
    if (brandParam) {
      setSelectedBrands([brandParam]);
    }
  }, [location.search]);

  // Unique lists from products for filters
  const brands = useMemo(() => [...new Set(products.map(p => p.brand))], [products]);
  
  const sizes = useMemo(() => {
    const allSizes = products.flatMap(p => p.sizes || []);
    return [...new Set(allSizes)].sort((a, b) => a - b);
  }, [products]);

  const colors = useMemo(() => {
    const allColors = products.flatMap(p => p.colors || []).map(c => {
      // normalize colors: e.g. "Orange/Black/White" to separate words or just display as list
      if (c.includes("/")) return c.split("/");
      return c;
    }).flat();
    return [...new Set(allColors.map(c => c.trim()))];
  }, [products]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBrands, selectedSizes, selectedColors, maxPrice, selectedRating, selectedTag, sortBy]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Search Term filter
        const matchesSearch = 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase());
          
        // Brand filter
        const matchesBrand = selectedBrands.length === 0 || selectedBrands.includes(p.brand);
        
        // Size filter
        const matchesSize = selectedSizes.length === 0 || (p.sizes && p.sizes.some(s => selectedSizes.includes(s)));
        
        // Color filter
        const matchesColor = selectedColors.length === 0 || (p.colors && p.colors.some(c => 
          selectedColors.some(sc => c.toLowerCase().includes(sc.toLowerCase()))
        ));
        
        // Price filter
        const matchesPrice = p.price <= maxPrice;
        
        // Rating filter
        const ratingData = getProductRating(p.id);
        const matchesRating = selectedRating === 0 || ratingData.avg >= selectedRating;
        
        // Tag filter
        let matchesTag = true;
        if (selectedTag === "new") matchesTag = p.isNewArrival;
        else if (selectedTag === "trending") matchesTag = p.isTrending;
        else if (selectedTag === "best") matchesTag = p.isBestSeller;

        return matchesSearch && matchesBrand && matchesSize && matchesColor && matchesPrice && matchesRating && matchesTag;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === "price-low") {
          return a.price - b.price;
        }
        if (sortBy === "price-high") {
          return b.price - a.price;
        }
        if (sortBy === "rating") {
          return getProductRating(b.id).avg - getProductRating(a.id).avg;
        }
        return 0;
      });
  }, [products, searchTerm, selectedBrands, selectedSizes, selectedColors, maxPrice, selectedRating, selectedTag, sortBy]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const toggleBrand = (brand) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const toggleSize = (size) => {
    setSelectedSizes(prev => 
      prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]
    );
  };

  const toggleColor = (color) => {
    setSelectedColors(prev => 
      prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedBrands([]);
    setSelectedSizes([]);
    setSelectedColors([]);
    setMaxPrice(60000);
    setSelectedRating(0);
    setSelectedTag("all");
    setSortBy("newest");
  };

  const FilterSidebarContent = () => (
    <div className="space-y-6">
      {/* Reset Header */}
      <div className="flex items-center justify-between pb-4 border-b border-light-border dark:border-dark-border">
        <h4 className="font-extrabold text-sm uppercase tracking-widest text-light-text dark:text-white">Filters</h4>
        <button 
          onClick={resetFilters}
          className="text-xs font-bold text-primary hover:text-primary-hover uppercase tracking-wider transition-colors"
        >
          Clear All
        </button>
      </div>

      {/* Collection Tags */}
      <div className="space-y-2">
        <h5 className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted">Collection</h5>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "All Drops" },
            { id: "new", label: "New Arrivals" },
            { id: "trending", label: "Trending" },
            { id: "best", label: "Best Sellers" }
          ].map((tag) => (
            <button
              key={tag.id}
              onClick={() => setSelectedTag(tag.id)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                selectedTag === tag.id
                  ? "bg-primary text-white border-primary"
                  : "bg-white dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text dark:text-gray-300 hover:border-primary/50"
              }`}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>

      {/* Brands check list */}
      <div className="space-y-2">
        <h5 className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted">Brands</h5>
        <div className="space-y-2">
          {brands.map((brand) => (
            <label key={brand} className="flex items-center space-x-2 text-sm text-light-text dark:text-gray-300 cursor-pointer">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => toggleBrand(brand)}
                className="accent-primary rounded text-white focus:ring-0 focus:ring-offset-0"
              />
              <span>{brand}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Slider */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted">
          <span>Max Price</span>
          <span className="text-primary font-black">₹{maxPrice.toLocaleString("en-IN")}</span>
        </div>
        <input
          type="range"
          min="5000"
          max="60000"
          step="1000"
          value={maxPrice}
          onChange={(e) => setMaxPrice(Number(e.target.value))}
          className="w-full accent-primary bg-gray-200 dark:bg-dark-border h-1 rounded-lg cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-light-muted dark:text-dark-muted font-semibold">
          <span>₹5,000</span>
          <span>₹60,000</span>
        </div>
      </div>

      {/* Sizes Selection grid */}
      <div className="space-y-2">
        <h5 className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted">Sizes (UK)</h5>
        <div className="grid grid-cols-4 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => toggleSize(size)}
              className={`text-xs py-2 font-bold rounded-lg border transition-all ${
                selectedSizes.includes(size)
                  ? "bg-primary text-white border-primary"
                  : "bg-white dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text dark:text-gray-300 hover:border-primary/50"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Selection grid */}
      <div className="space-y-2">
        <h5 className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted">Colors</h5>
        <div className="flex flex-wrap gap-2">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => toggleColor(color)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                selectedColors.includes(color)
                  ? "bg-primary text-white border-primary"
                  : "bg-white dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text dark:text-gray-300 hover:border-primary/50"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Ratings filter */}
      <div className="space-y-2">
        <h5 className="text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted">Min Rating</h5>
        <div className="flex items-center space-x-1.5">
          {[0, 3, 4, 5].map((stars) => (
            <button
              key={stars}
              onClick={() => setSelectedRating(stars)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-all flex items-center space-x-1 ${
                selectedRating === stars
                  ? "bg-primary text-white border-primary"
                  : "bg-white dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text dark:text-gray-300 hover:border-primary/50"
              }`}
            >
              {stars === 0 ? (
                <span>All Ratings</span>
              ) : (
                <>
                  <span>{stars}+</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400 inline" />
                </>
              )}
            </button>
          ))}
        </div>
      </div>

    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Header and Search block */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-6 border-b border-light-border dark:border-dark-border">
        <div>
          <h1 className="text-3xl font-black uppercase text-light-text dark:text-white">Shop Sneakers</h1>
          <p className="text-xs text-light-muted dark:text-dark-muted font-semibold mt-1">
            Showing {filteredProducts.length} sneakers
          </p>
        </div>

        <div className="flex flex-1 max-w-lg items-center gap-3">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search Jordan, Yeezy, Nike..."
              className="w-full bg-white dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl pl-10 pr-4 py-3 text-sm outline-none focus:border-primary text-light-text dark:text-white"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm("")} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-light-text dark:hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort selection */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-white dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary text-light-text dark:text-white"
          >
            <option value="newest">Newest Drops</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>

          {/* Mobile Filter Button */}
          <button
            onClick={() => setShowMobileFilters(true)}
            className="md:hidden p-3 bg-white dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl text-light-text dark:text-gray-300"
            aria-label="Show Filters"
          >
            <SlidersHorizontal className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Sidebar Filters */}
        <aside className="hidden md:block md:col-span-3 p-6 rounded-2xl glass-card border border-light-border dark:border-dark-border/40 sticky top-28 max-h-[80vh] overflow-y-auto">
          <FilterSidebarContent />
        </aside>

        {/* Product Grid and Pagination */}
        <main className="md:col-span-9 space-y-10">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 rounded-2xl border border-dashed border-light-border dark:border-dark-border bg-gray-50/30 dark:bg-dark-bg/10">
              <p className="text-light-muted dark:text-dark-muted font-bold text-lg">No sneakers matches your filters.</p>
              <button 
                onClick={resetFilters} 
                className="mt-4 bg-primary hover:bg-primary-hover text-white px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <>
              {/* Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Pagination controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-2 pt-6">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    className="p-2 rounded-lg border border-light-border dark:border-dark-border disabled:opacity-50 text-light-text dark:text-gray-300 hover:border-primary transition-colors bg-white dark:bg-dark-bg"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {[...Array(totalPages)].map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentPage(idx + 1)}
                      className={`w-9 h-9 font-bold text-sm rounded-lg border transition-all ${
                        currentPage === idx + 1
                          ? "bg-primary text-white border-primary"
                          : "bg-white dark:bg-dark-bg border-light-border dark:border-dark-border text-light-text dark:text-gray-300 hover:border-primary/50"
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    className="p-2 rounded-lg border border-light-border dark:border-dark-border disabled:opacity-50 text-light-text dark:text-gray-300 hover:border-primary transition-colors bg-white dark:bg-dark-bg"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {showMobileFilters && (
          <div className="fixed inset-0 z-50 flex justify-end md:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMobileFilters(false)}
              className="absolute inset-0 bg-dark-bg/60 backdrop-blur-sm"
            />

            {/* Sidebar content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
              className="relative w-full max-w-xs bg-white dark:bg-dark-card p-6 shadow-2xl h-full flex flex-col justify-between overflow-y-auto"
            >
              <div>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border text-light-text dark:text-gray-300"
                >
                  <X className="w-5 h-5" />
                </button>
                <div className="pt-6">
                  <FilterSidebarContent />
                </div>
              </div>

              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3 rounded-xl mt-6 uppercase tracking-wider text-sm shadow-md"
              >
                Apply Filters
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
