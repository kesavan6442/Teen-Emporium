import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { AppProvider, useAppContext } from "./context/AppContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductDetail from "./pages/ProductDetail";
import Wishlist from "./pages/Wishlist";
import Auth from "./pages/Auth";
import AdminDashboard from "./pages/AdminDashboard";
import { ShoppingBag, X, Trash2, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Sliding Cart Drawer overlay
function CartDrawer({ isOpen, onClose }) {
  const { cart, removeFromCart, updateCartQuantity, clearCart, siteSettings } = useAppContext();
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  // Auto handle checkout WhatsApp orders recap for multi-items in cart!
  const triggerCartWhatsAppOrder = () => {
    const number1 = siteSettings.whatsappNumber;
    const formattedPrice = subtotal.toLocaleString("en-IN");
    
    let itemsText = "";
    cart.forEach((item, i) => {
      itemsText += `\n${i + 1}. Product: ${item.name} (${item.brand})\n   Size: ${item.size} | Color: ${item.color}\n   Qty: ${item.quantity} | Price: ₹${(item.price * item.quantity).toLocaleString("en-IN")}\n`;
    });

    const text = `Hello TEENS EMPORIUM,

I would like to place an order for the following items in my cart.

Items Ordered:
${itemsText}
Total Cart Value:
₹${formattedPrice}

Please check availability and guide me with the payment.`;

    const encodedText = encodeURIComponent(text);
    const link = `https://wa.me/91${number1}?text=${encodedText}`;
    window.open(link, "_blank");
    clearCart();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex justify-end">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-dark-bg/60 backdrop-blur-sm"
        />

        {/* Sliding Panel */}
        <motion.div
          initial={{ x: "100%" }}
          animate={{ x: 0 }}
          exit={{ x: "100%" }}
          transition={{ type: "tween", duration: 0.3 }}
          className="relative w-full max-w-md bg-[#f6f1e8] dark:bg-dark-card p-6 shadow-2xl h-full flex flex-col justify-between"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-light-border dark:border-dark-border">
            <h3 className="font-extrabold text-lg text-light-text dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-primary" />
              <span>Shopping Cart</span>
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border text-light-text dark:text-gray-300 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart items list */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-1">
            {cart.length === 0 ? (
              <div className="text-center py-20 text-light-muted dark:text-dark-muted space-y-3">
                <ShoppingBag className="w-12 h-12 mx-auto opacity-30" />
                <p className="font-bold text-sm uppercase">Your Cart is Empty</p>
                <button
                  onClick={onClose}
                  className="text-xs font-bold text-primary hover:underline uppercase tracking-wide"
                >
                  Start Adding Sneakers
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div 
                  key={`${item.id}-${item.size}-${item.color}`} 
                  className="flex space-x-3 p-3 rounded-xl border border-light-border dark:border-dark-border/50 bg-gray-50/50 dark:bg-dark-bg/25 relative group"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-lg border flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0 pr-6">
                    <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{item.brand}</span>
                    <h4 className="font-bold text-sm text-light-text dark:text-white truncate">{item.name}</h4>
                    <p className="text-[10px] text-light-muted dark:text-dark-muted font-semibold mt-0.5">
                      Size: {item.size} | Color: {item.color}
                    </p>
                    
                    {/* Quantity Selector & Price */}
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded-lg bg-[#f6f1e8] dark:bg-dark-bg">
                        <button
                          onClick={() => updateCartQuantity(item.id, item.size, item.color, item.quantity - 1)}
                          className="px-2 py-0.5 text-light-muted hover:text-primary font-bold"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-bold text-light-text dark:text-white">{item.quantity}</span>
                        <button
                          onClick={() => updateCartQuantity(item.id, item.size, item.color, item.quantity + 1)}
                          className="px-2 py-0.5 text-light-muted hover:text-primary font-bold"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-black text-sm text-light-text dark:text-white">
                        ₹{(item.price * item.quantity).toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id, item.size, item.color)}
                    className="absolute top-3 right-3 p-1 text-red-500 hover:bg-red-500/10 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Checkout controls footer */}
          {cart.length > 0 && (
            <div className="pt-4 border-t border-light-border dark:border-dark-border space-y-4">
              <div className="flex items-center justify-between font-bold text-sm text-light-text dark:text-white">
                <span>Subtotal Value</span>
                <span className="text-xl font-black text-primary">₹{subtotal.toLocaleString("en-IN")}</span>
              </div>
              <p className="text-[11px] text-light-muted dark:text-dark-muted leading-relaxed">
                Order will be generated as a WhatsApp invoice recap to Agent Kesav for instant confirmation & shipment guidance.
              </p>

              <button
                onClick={triggerCartWhatsAppOrder}
                className="w-full bg-primary hover:bg-primary-hover text-white font-extrabold py-3.5 px-4 rounded-xl text-xs tracking-wider uppercase transition-colors flex items-center justify-center space-x-1.5 shadow-md shadow-primary/20"
              >
                <i className="fa-brands fa-whatsapp text-base"></i>
                <span>ORDER VIA WHATSAPP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Layout helper wrapper to check for cart search queries and handle transitions
function AppContent({ toggleTheme, isDark }) {
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Monitor query search param to toggle Cart Drawer
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("cart") === "open") {
      setIsCartOpen(true);
    } else {
      setIsCartOpen(false);
    }
  }, [location.search]);

  const handleCartClose = () => {
    setIsCartOpen(false);
    // Remove cart param from URL
    const params = new URLSearchParams(window.location.search);
    params.delete("cart");
    const newRelativePathQuery = window.location.pathname + (params.toString() ? '?' + params.toString() : '');
    window.history.pushState(null, '', newRelativePathQuery);
  };

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar toggleTheme={toggleTheme} isDark={isDark} />
      
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>

      <Footer />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={handleCartClose} />
    </div>
  );
}

export default function App() {
  const [isDark, setIsDark] = useState(true);

  // Initialize theme
  useEffect(() => {
    const storedTheme = localStorage.getItem("teens_theme");
    if (storedTheme === "light") {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    } else {
      // Default to dark mode for premium luxury aesthetics
      setIsDark(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
      localStorage.setItem("teens_theme", "light");
    } else {
      setIsDark(true);
      document.documentElement.classList.add("dark");
      localStorage.setItem("teens_theme", "dark");
    }
  };

  return (
    <AuthProvider>
      <AppProvider>
        <Router>
          <AppContent toggleTheme={toggleTheme} isDark={isDark} />
        </Router>
      </AppProvider>
    </AuthProvider>
  );
}
