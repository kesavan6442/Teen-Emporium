import React from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { Heart, ShoppingBag, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Wishlist() {
  const { wishlist, products, toggleWishlist, addToCart } = useAppContext();

  // Filter products in wishlist
  const savedSneakers = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8 min-h-[60vh]">
      
      <div>
        <h1 className="text-3xl font-black uppercase text-light-text dark:text-white flex items-center space-x-3">
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <span>My Wishlist</span>
        </h1>
        <p className="text-xs text-light-muted dark:text-dark-muted font-semibold mt-1">
          {savedSneakers.length} sneaker{savedSneakers.length !== 1 && "s"} saved
        </p>
      </div>

      <hr className="border-light-border dark:border-dark-border" />

      {savedSneakers.length === 0 ? (
        <div className="text-center py-20 rounded-3xl border border-dashed border-light-border dark:border-dark-border bg-gray-50/30 dark:bg-dark-bg/10 max-w-2xl mx-auto">
          <Heart className="w-12 h-12 text-light-muted dark:text-dark-muted mx-auto mb-4" />
          <h2 className="text-lg font-bold text-light-text dark:text-white uppercase mb-2">Your Wishlist is Empty</h2>
          <p className="text-sm text-light-muted dark:text-dark-muted mb-6">
            Explore our curated collections of premium sneakers and tap the heart icon to save your favorites here.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover text-white font-bold py-3 px-6 rounded-xl text-sm transition-all active:scale-95 shadow-md shadow-primary/25 border border-primary/10"
          >
            <span>DISCOVER SNEAKERS</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <AnimatePresence>
            {savedSneakers.map((sneaker) => (
              <motion.div
                key={sneaker.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative flex flex-col justify-between rounded-2xl glass-card overflow-hidden transition-all duration-300 border border-light-border dark:border-dark-border hover:shadow-lg"
              >
                {/* Remove button */}
                <button
                  onClick={() => toggleWishlist(sneaker.id)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full glass-effect border border-light-border dark:border-white/10 hover:bg-red-500/10 text-light-text dark:text-white hover:text-red-500 transition-colors"
                  aria-label="Remove from Wishlist"
                >
                  <Trash2 className="w-4.5 h-4.5" />
                </button>

                {/* Sneaker image */}
                <Link to={`/product/${sneaker.id}`} className="block relative aspect-square overflow-hidden bg-gray-100 dark:bg-dark-card border-b border-light-border dark:border-dark-border">
                  <img
                    src={sneaker.images[0]}
                    alt={sneaker.name}
                    className="w-full h-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
                  />
                </Link>

                {/* Details */}
                <div className="p-5 flex flex-col justify-between flex-1">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-primary tracking-widest block mb-1">
                      {sneaker.brand}
                    </span>
                    <Link to={`/product/${sneaker.id}`} className="hover:text-primary transition-colors">
                      <h3 className="font-bold text-sm text-light-text dark:text-white uppercase line-clamp-1">
                        {sneaker.name}
                      </h3>
                    </Link>
                    <p className="text-xs text-light-muted dark:text-dark-muted line-clamp-2 mt-1 mb-3">
                      {sneaker.description}
                    </p>
                  </div>

                  {/* Price and Cart Action */}
                  <div className="flex items-center justify-between pt-3 border-t border-light-border dark:border-dark-border/50">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-light-muted dark:text-dark-muted font-bold block">
                        Price
                      </span>
                      <span className="text-base font-black text-light-text dark:text-white">
                        ₹{sneaker.price.toLocaleString("en-IN")}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        const defaultSize = sneaker.sizes ? sneaker.sizes[0] : 8;
                        const defaultColor = sneaker.colors ? sneaker.colors[0] : "Default";
                        addToCart(sneaker, defaultSize, defaultColor, 1);
                      }}
                      className="flex items-center justify-center space-x-1.5 bg-primary hover:bg-primary-hover text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-all duration-300 active:scale-95 border border-primary/10 shadow-sm"
                    >
                      <ShoppingBag className="w-3.5 h-3.5" />
                      <span>ADD TO CART</span>
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

    </div>
  );
}
