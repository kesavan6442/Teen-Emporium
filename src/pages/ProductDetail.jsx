import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import ReviewSection from "../components/ReviewSection";
import ProductCard from "../components/ProductCard";
import WhatsAppPopup from "../components/WhatsAppPopup";
import ProductViewer from "../components/ProductViewer";
import { 
  Heart, 
  Share2, 
  ShoppingBag, 
  Star, 
  Check,
  TrendingUp
} from "lucide-react";
import { motion } from "framer-motion";

export default function ProductDetail() {
  const { id } = useParams();
  const { products, wishlist, toggleWishlist, getProductRating, addToCart } = useAppContext();

  // Find current product
  const product = useMemo(() => products.find(p => p.id === id), [products, id]);

  // Selection states
  const [selectedSize, setSelectedSize] = useState(product?.sizes ? product.sizes[0] : 8);
  const [selectedColor, setSelectedColor] = useState(product?.colors ? product.colors[0] : "Default");
  const [shareCopied, setShareCopied] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);

  // Cart add toast
  const [addedToast, setAddedToast] = useState(false);

  const ratingData = getProductRating(product?.id || "");
  const isSaved = wishlist.includes(product?.id || "");

  // Similar Products (same brand, excluding current)
  const similarProducts = useMemo(() => {
    if (!product) return [];
    return products
      .filter(p => p.brand === product.brand && p.id !== product.id)
      .slice(0, 4);
  }, [products, product]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  };

  const triggerAddToCart = () => {
    addToCart(product, selectedSize, selectedColor, 1);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 3000);
  };

  // Fallbacks if loading or not found
  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-20 text-center space-y-4">
        <h2 className="text-2xl font-bold text-light-text dark:text-white uppercase">Product Not Found</h2>
        <p className="text-light-muted dark:text-dark-muted">The sneaker you are looking for does not exist or has been removed.</p>
        <Link to="/shop" className="inline-block bg-primary hover:bg-primary-hover text-white px-6 py-2.5 rounded-xl font-bold uppercase tracking-wider text-sm">
          Back to Shop
        </Link>
      </div>
    );
  }

  // Stock status styling
  let stockBadge = { text: "In Stock", class: "bg-emerald-500/10 text-emerald-500 border border-emerald-500/25" };
  if (product.stock <= 0) {
    stockBadge = { text: "Out of Stock", class: "bg-red-500/10 text-red-500 border border-red-500/25" };
  } else if (product.stock <= 5) {
    stockBadge = { text: `Low Stock (${product.stock} left)`, class: "bg-amber-500/10 text-amber-500 border border-amber-500/25" };
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-16">
      
      {/* Product Detail Top Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        
        {/* Left Column: 3D Product Viewer */}
        <div className="lg:col-span-7">
          <ProductViewer
            images={product.images}
            productName={product.name}
            badge={product.isTrending ? "🔥 Trending" : product.isNewArrival ? "✨ New Arrival" : null}
          />
        </div>

        {/* Right Column: Specification details */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Header Info */}
          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold text-primary tracking-widest">
              {product.brand}
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold uppercase text-light-text dark:text-white leading-tight">
              {product.name}
            </h1>
            
            {/* Rating Stars recap */}
            <div className="flex items-center space-x-2 pt-1">
              <div className="flex space-x-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-4 h-4 ${
                      star <= Math.round(ratingData.avg)
                        ? "fill-amber-400 text-amber-400"
                        : "text-gray-300 dark:text-zinc-700"
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-bold text-light-text dark:text-gray-200">
                {ratingData.avg}
              </span>
              <span className="text-xs text-light-muted dark:text-dark-muted font-medium">
                ({ratingData.count} review{ratingData.count !== 1 && "s"})
              </span>
            </div>
          </div>

          <hr className="border-light-border dark:border-dark-border" />

          {/* Pricing & Stock Status */}
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <span className="text-xs text-light-muted dark:text-dark-muted font-bold uppercase tracking-wider">
                Price Drop
              </span>
              <div className="flex items-baseline space-x-2">
                <span className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-500 tracking-tight">
                  ↓{product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 85}%
                </span>
                <span className="text-2xl font-medium text-gray-400 dark:text-gray-500 line-through">
                  {(product.originalPrice || Math.round(product.price / 0.15)).toLocaleString("en-IN")}
                </span>
                <p className="text-3xl font-black text-light-text dark:text-white">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>
              </div>
            </div>
            
            <span className={`text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full ${stockBadge.class}`}>
              {stockBadge.text}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
            {product.description}
          </p>

          {/* Color Selector */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-white">
                Select Colorways
              </span>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`text-xs py-2 px-4 rounded-xl border-2 font-bold transition-all ${
                      selectedColor === color
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-[#0f1425] dark:bg-dark-bg border-[#3d4b75] dark:border-dark-border text-white dark:text-gray-300 hover:border-primary/70 shadow-sm"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size Selector */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-widest text-white">
                Select Size (UK / IN)
              </span>
              <div className="grid grid-cols-5 gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`text-xs py-2.5 font-black rounded-xl border-2 transition-all ${
                      selectedSize === size
                        ? "bg-primary text-white border-primary shadow-sm"
                        : "bg-[#0f1425] dark:bg-dark-bg border-[#3d4b75] dark:border-dark-border text-white dark:text-gray-300 hover:border-primary/70 shadow-sm"
                    }`}
                  >
                    UK {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <hr className="border-light-border dark:border-dark-border" />

          {/* Call to Actions (Wishlist, Share, Buy Now, Cart Add) */}
          <div className="flex flex-col space-y-3">
            
            <div className="flex space-x-3">
              {/* Buy Now (Open WhatsApp Popup) */}
              <button
                disabled={product.stock <= 0}
                onClick={() => setIsWhatsAppOpen(true)}
                className="flex-1 bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-extrabold py-4 px-6 rounded-2xl tracking-wider text-sm uppercase transition-all duration-300 active:scale-95 shadow-md shadow-primary/20 flex items-center justify-center space-x-2 border border-primary/10"
              >
                <i className="fa-brands fa-whatsapp text-lg"></i>
                <span>BUY NOW VIA WHATSAPP</span>
              </button>

              {/* Add to Cart */}
              <button
                disabled={product.stock <= 0}
                onClick={triggerAddToCart}
                className="bg-dark-bg dark:bg-white text-white dark:text-dark-bg hover:bg-dark-border dark:hover:bg-neutral-100 disabled:opacity-50 font-bold p-4 rounded-2xl transition-all duration-300 border border-dark-border dark:border-neutral-200 active:scale-95 flex items-center justify-center"
                aria-label="Add to Cart"
              >
                <ShoppingBag className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Toast message */}
            {addedToast && (
              <div className="text-center py-2 text-xs font-bold text-primary bg-primary/10 border border-primary/25 rounded-lg animate-fade-in">
                ✓ Added to Cart!
              </div>
            )}

            <div className="flex gap-3">
              {/* Wishlist toggle button */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className={`flex-1 flex items-center justify-center space-x-2 border py-3 px-4 rounded-xl text-xs font-bold tracking-wider uppercase transition-colors ${
                  isSaved
                    ? "border-red-500/20 bg-red-500/5 text-red-500"
                    : "bg-[#161b2f] dark:bg-dark-bg border-[#2b3558] dark:border-dark-border hover:border-red-500 hover:text-red-500 text-white dark:text-gray-300 shadow-sm"
                }`}
              >
                <Heart className={`w-4 h-4 ${isSaved ? "fill-red-500" : ""}`} />
                <span>{isSaved ? "Saved to Wishlist" : "Add to Wishlist"}</span>
              </button>

              {/* Share button */}
              <button
                onClick={handleShare}
                className="flex items-center justify-center space-x-2 border border-[#2b3558] dark:border-dark-border hover:border-primary bg-[#161b2f] dark:bg-dark-bg py-3 px-6 rounded-xl text-xs font-bold tracking-wider uppercase text-white dark:text-gray-300 transition-colors shadow-sm"
              >
                {shareCopied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-500" />
                    <span className="text-emerald-500">Copied!</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>Share</span>
                  </>
                )}
              </button>
            </div>

          </div>

        </div>

      </div>

      {/* Review Section */}
      <ReviewSection productId={product.id} />

      {/* Similar Products */}
      {similarProducts.length > 0 && (
        <div className="space-y-6 pt-10 border-t border-light-border dark:border-dark-border">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-primary uppercase tracking-widest">COLLECTIONS</h3>
            <h4 className="text-2xl font-extrabold uppercase text-light-text dark:text-white">
              SIMILAR RELEASES
            </h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {similarProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}

      {/* WhatsApp Modal Trigger */}
      <WhatsAppPopup
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        product={product}
        selectedSize={selectedSize}
        selectedColor={selectedColor}
      />

    </div>
  );
}
