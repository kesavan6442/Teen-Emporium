import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageSquare, ArrowUpRight } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function WhatsAppPopup({ isOpen, onClose, product, selectedSize, selectedColor }) {
  const { siteSettings } = useAppContext();

  if (!isOpen || !product) return null;

  const currentUrl = window.location.href;

  const generateWhatsAppLink = (phoneNumber) => {
    const formattedPrice = product.price.toLocaleString("en-IN");
    const text = `Hello TEENS EMPORIUM,

I would like to order this shoe.

Product Name:
${product.name}

Brand:
${product.brand}

Price:
₹${formattedPrice}

Selected Size:
${selectedSize || "Not Selected"}

Selected Color:
${selectedColor || "Not Selected"}

Product Link:
${currentUrl}

Please provide availability details.`;

    const encodedText = encodeURIComponent(text);
    return `https://wa.me/91${phoneNumber}?text=${encodedText}`;
  };

  const number1 = siteSettings?.whatsappNumber || "6381695564";
  const number2 = siteSettings?.secondaryWhatsappNumber || siteSettings?.whatsappNumber || "6381695564";

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-dark-bg/60 backdrop-blur-sm"
        />

        {/* Popup Card */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 350 }}
          className="relative w-full max-w-md glass-card p-6 rounded-2xl border border-light-border dark:border-dark-border z-10 overflow-hidden glow-orange"
        >
          {/* Decorative orange glowing background blobs */}
          <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border text-light-text dark:text-gray-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Title */}
          <div className="flex items-center space-x-3 mb-5">
            <div className="bg-primary/20 p-2.5 rounded-xl border border-primary/20">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-light-text dark:text-white uppercase tracking-wider">Confirm Your Order</h3>
              <p className="text-xs text-light-muted dark:text-dark-muted">Order directly via WhatsApp instantly</p>
            </div>
          </div>

          {/* Product details recap */}
          <div className="bg-gray-50 dark:bg-dark-bg/40 border border-light-border dark:border-dark-border rounded-xl p-4 mb-6 text-sm">
            <div className="flex space-x-3">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-16 h-16 object-cover rounded-lg border border-light-border dark:border-dark-border"
              />
              <div className="flex-1 min-w-0">
                <span className="text-xs font-bold text-primary uppercase tracking-widest">{product.brand}</span>
                <h4 className="font-bold text-light-text dark:text-white truncate">{product.name}</h4>
                <div className="flex flex-wrap gap-x-3 gap-y-1 mt-1 text-xs font-medium text-light-muted dark:text-dark-muted">
                  <span>Size: <strong className="text-light-text dark:text-white">{selectedSize || "Any"}</strong></span>
                  <span>Color: <strong className="text-light-text dark:text-white">{selectedColor || "Any"}</strong></span>
                </div>
                <p className="text-primary font-black mt-1">₹{product.price.toLocaleString("en-IN")}</p>
              </div>
            </div>
          </div>

          <p className="text-xs text-center text-light-muted dark:text-dark-muted mb-5 leading-relaxed">
            Please choose a WhatsApp agent below. We will receive your pre-filled request and reply back with availability & payment details.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col space-y-3">
            <a
              href={generateWhatsAppLink(number1)}
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="flex items-center justify-between bg-[#25D366] hover:bg-[#20ba59] text-white font-bold py-3.5 px-5 rounded-xl transition-all duration-300 shadow-md shadow-emerald-500/10 active:scale-95 group"
            >
              <div className="flex items-center space-x-3">
                <i className="fa-brands fa-whatsapp text-xl"></i>
                <div className="text-left">
                  <p className="text-sm">Primary WhatsApp</p>
                  <p className="text-[10px] opacity-80 font-normal">Contact: +91 {number1}</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>

            <a
              href={generateWhatsAppLink(number2)}
              target="_blank"
              rel="noreferrer"
              onClick={onClose}
              className="flex items-center justify-between bg-dark-bg dark:bg-white text-white dark:text-dark-bg hover:bg-dark-border dark:hover:bg-neutral-100 font-bold py-3.5 px-5 rounded-xl transition-all duration-300 shadow-md border border-dark-border dark:border-neutral-200 active:scale-95 group"
            >
              <div className="flex items-center space-x-3">
                <i className="fa-brands fa-whatsapp text-xl text-[#25D366]"></i>
                <div className="text-left">
                  <p className="text-sm">Secondary WhatsApp</p>
                  <p className="text-[10px] opacity-80 font-normal">Contact: +91 {number2}</p>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
