import React from "react";
import { Link } from "react-router-dom";
import { Heart, Star, ShoppingBag, Eye, Layers } from "lucide-react";
import { useAppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

// Check if product has multi-view shots
function hasMultiViews(images = []) {
  return images.length >= 5 && images.some(img =>
    ["side","45","top","pair","sole"].some(k => img.includes(k))
  );
}

export default function ProductCard({ product, index = 0 }) {
  const { wishlist, toggleWishlist, getProductRating, addToCart } = useAppContext();
  const { currentUser } = useAuth();
  
  const isSaved = wishlist.includes(product.id);
  const ratingData = getProductRating(product.id);
  const isMultiView = hasMultiViews(product.images);

  // Determine badge
  let badge = null;
  if (product.isNewArrival) badge = { text: "New", class: "bg-primary text-white" };
  else if (product.isTrending) badge = { text: "Trending", class: "bg-dark-bg dark:bg-white text-white dark:text-dark-bg border border-white/10" };
  else if (product.isBestSeller) badge = { text: "Best Seller", class: "bg-amber-500 text-dark-bg font-bold" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.05 }}
      className="group relative flex flex-col justify-between rounded-2xl glass-card overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/10 border border-light-border dark:border-dark-border"
    >
      {/* Wishlist Heart Toggle */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          toggleWishlist(product.id);
        }}
        className="absolute top-4 right-4 z-10 p-2 rounded-full glass-effect border border-light-border dark:border-white/10 hover:scale-110 active:scale-95 transition-all duration-300 shadow-md group/heart"
        aria-label="Toggle Wishlist"
      >
        <Heart
          className={`w-4.5 h-4.5 transition-all duration-300 ${
            isSaved 
              ? "fill-red-500 text-red-500 scale-110" 
              : "text-light-text dark:text-white group-hover/heart:text-red-500"
          }`}
        />
      </button>

      {/* Badges overlay */}
      {badge && (
        <span className={`absolute top-4 left-4 z-10 text-[10px] uppercase font-black tracking-widest px-2.5 py-1 rounded-full shadow-sm ${badge.class}`}>
          {badge.text}
        </span>
      )}

      {/* 5-Views indicator badge */}
      {isMultiView && (
        <span className="absolute bottom-[40%] left-4 z-10 flex items-center gap-1 bg-dark-bg/70 backdrop-blur-sm border border-primary/30 text-primary text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300">
          <Layers className="w-2.5 h-2.5" />
          5 VIEWS · 3D
        </span>
      )}

      {/* Product Image and Hover Actions */}
      <Link to={`/product/${product.id}`} className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-dark-card border-b border-light-border dark:border-dark-border">
        {/* Main Image */}
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-110"
          loading="lazy"
        />

        {/* Secondary Image on Hover */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-cover object-center opacity-0 transition-opacity duration-700 group-hover:opacity-100"
            loading="lazy"
          />
        )}

        {/* Hover Quick Actions */}
        <div className="absolute inset-0 bg-dark-bg/40 flex items-center justify-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="p-3 bg-[#f6f1e8] dark:bg-dark-bg text-light-text dark:text-white rounded-full hover:bg-primary hover:text-white dark:hover:bg-primary transition-all duration-300 shadow-lg translate-y-4 group-hover:translate-y-0 duration-300">
            <Eye className="w-5 h-5" />
          </div>
        </div>
      </Link>

      {/* Product Details info */}
      <div className="p-5 flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] uppercase font-bold text-primary tracking-widest">
              {product.brand}
            </span>
            {/* Rating */}
            <div className="flex items-center space-x-1">
              <Star className={`w-3 h-3 ${ratingData.count > 0 ? "fill-amber-400 text-amber-400" : "text-gray-400"}`} />
              <span className="text-[11px] font-bold text-light-text dark:text-gray-200">
                {ratingData.count > 0 ? ratingData.avg : "New"}
              </span>
              {ratingData.count > 0 && (
                <span className="text-[10px] text-light-muted dark:text-dark-muted font-medium">
                  ({ratingData.count})
                </span>
              )}
            </div>
          </div>

          <Link to={`/product/${product.id}`} className="hover:text-primary transition-colors">
            <h3 className="font-bold text-sm text-light-text dark:text-white tracking-wide uppercase line-clamp-1">
              {product.name}
            </h3>
          </Link>

          <p className="text-xs text-light-muted dark:text-dark-muted line-clamp-2 mt-1 mb-3">
            {product.description}
          </p>
        </div>

        {/* Price & Cart Add Button */}
        <div className="flex items-center justify-between pt-3 border-t border-light-border dark:border-dark-border/50">
          <div>
            <span className="block text-[9px] uppercase tracking-wider text-light-muted dark:text-dark-muted font-bold">
              Price
            </span>
            <div className="flex items-baseline space-x-1.5">
              <span className="text-base font-black text-light-text dark:text-white">
                ₹{product.price.toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] font-medium text-gray-400 dark:text-gray-500 line-through">
                {(product.originalPrice || Math.round(product.price / 0.15)).toLocaleString("en-IN")}
              </span>
              <span className="text-[10px] font-extrabold text-emerald-600 dark:text-emerald-500">
                ↓{product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 85}%
              </span>
            </div>
          </div>
          <button
            onClick={() => {
              // Add to cart with default size & color
              const defaultSize = product.sizes ? product.sizes[0] : 8;
              const defaultColor = product.colors ? product.colors[0] : "Default";
              addToCart(product, defaultSize, defaultColor, 1);
            }}
            className="flex items-center justify-center p-2.5 rounded-xl bg-primary hover:bg-primary-hover text-white transition-all duration-300 shadow-md shadow-primary/10 active:scale-95 group/btn"
            aria-label="Add to Cart"
          >
            <ShoppingBag className="w-4 h-4 transition-transform group-hover/btn:scale-110" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
