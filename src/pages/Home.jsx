import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import ShoeViewer3D from "../components/ShoeViewer3D";
import ProductCard from "../components/ProductCard";
import { 
  ArrowRight, 
  ChevronRight, 
  Star, 
  Mail, 
  MapPin, 
  Phone, 
  ShieldCheck, 
  Truck, 
  Clock, 
  TrendingUp, 
  Sparkles,
  MessageSquare
} from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { products, reviews, siteSettings } = useAppContext();
  const [email, setEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Filters for collections
  const newArrivals = products.filter(p => p.isNewArrival).slice(0, 3);
  const trending = products.filter(p => p.isTrending).slice(0, 3);
  const bestSellers = products.filter(p => p.isBestSeller).slice(0, 3);
  const featured = products.slice(0, 4);

  const testimonials = [
    {
      name: "Rohit Sharma",
      role: "Verified Sneakerhead",
      stars: 5,
      comment: "Teens Emporium has the best customer support! I placed an order via WhatsApp and received my Yeezys within 3 days. 100% authentic stuff.",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120&auto=format&fit=crop"
    },
    {
      name: "Anjali Mehta",
      role: "Collector",
      stars: 5,
      comment: "Absolutely love the Shattered Backboards I bought from here. The premium packaging and personalization from the team made it a luxury experience.",
      img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120&auto=format&fit=crop"
    },
    {
      name: "Vikram R.",
      role: "Streetwear Enthusiast",
      stars: 5,
      comment: "Ordered via Agent Dinesh. Very professional and fast. He answered all my questions, sent photos of the shoe, and verified sizes. Outstanding!",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120&auto=format&fit=crop"
    }
  ];

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (email.trim()) {
      setNewsletterSubscribed(true);
      setEmail("");
    }
  };

  return (
    <div className="space-y-24 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-10 md:pt-16 px-4 sm:px-8 max-w-7xl mx-auto">
        <div className="absolute top-1/4 left-1/4 w-[320px] h-[320px] bg-primary/10 rounded-full blur-[110px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-[360px] h-[360px] bg-primary/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center space-x-2 bg-primary/10 border border-primary/25 px-3 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.25em] text-primary glow-gold"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Verified luxury drops • WhatsApp concierge</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-black uppercase tracking-tight leading-[0.9] text-light-text dark:text-white"
            >
              TEENS <br />
              <span className="text-gradient-shimmer">EMPORIUM</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base text-light-muted dark:text-dark-muted max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Curated for collectors who want rare sneakers, faster support, and a premium shopping experience from first click to doorstep delivery.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2"
            >
              <Link
                to="/shop"
                className="w-full sm:w-auto flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover text-white font-bold py-4 px-8 rounded-full transition-all duration-300 shadow-lg shadow-primary/25 hover:shadow-primary/45 active:scale-95 group border border-primary/10"
              >
                <span>SHOP ALL SNEAKERS</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
              <a
                href="#choose-us"
                className="w-full sm:w-auto flex items-center justify-center py-4 px-8 border border-light-border dark:border-dark-border hover:border-primary rounded-full font-semibold transition-colors duration-300 bg-white/20 dark:bg-dark-bg/25 backdrop-blur-md"
              >
                LEARN MORE
              </a>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="lg:col-span-6 w-full"
          >
            <div className="rounded-[2rem] border border-primary/10 bg-white/10 dark:bg-dark-bg/20 p-3 shadow-[0_20px_80px_rgba(0,0,0,0.25)] backdrop-blur-sm">
              <ShoeViewer3D />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us benefits */}
      <section id="choose-us" className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-sm font-black text-primary uppercase tracking-widest">BENEFITS</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold uppercase text-light-text dark:text-white">
            WHY SNEAKERHEADS CHOOSE US
          </h3>
          <p className="text-sm text-light-muted dark:text-dark-muted max-w-xl mx-auto">
            We deliver the ultimate buying experience tailored to authentic shoe collectors.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl glass-card border border-light-border dark:border-dark-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center border border-primary/20 mb-6">
              <ShieldCheck className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold text-lg text-light-text dark:text-white mb-2 uppercase tracking-wide">100% Authenticity Check</h4>
            <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
              Every single sneaker is carefully inspected by our sneaker experts before delivery. Authenticity is completely guaranteed.
            </p>
          </div>

          <div className="p-8 rounded-2xl glass-card border border-light-border dark:border-dark-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center border border-primary/20 mb-6">
              <MessageSquare className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold text-lg text-light-text dark:text-white mb-2 uppercase tracking-wide">WhatsApp Order Flow</h4>
            <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
              No complex forms or checkout delays. Connect directly to our personal curators, request custom photos/sizing support, and pay securely.
            </p>
          </div>

          <div className="p-8 rounded-2xl glass-card border border-light-border dark:border-dark-border/40 hover:border-primary/30 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5">
            <div className="bg-primary/10 w-12 h-12 rounded-xl flex items-center justify-center border border-primary/20 mb-6">
              <Truck className="w-6 h-6 text-primary" />
            </div>
            <h4 className="font-bold text-lg text-light-text dark:text-white mb-2 uppercase tracking-wide">Fast Pan-India Shipping</h4>
            <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
              Express door-to-door delivery across India. Fully tracked shipments with insurance, so your luxury grails arrive perfectly safe.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between mb-12 gap-4">
          <div className="text-center sm:text-left space-y-2">
            <h2 className="text-sm font-black text-primary uppercase tracking-widest">EXCLUSIVE</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold uppercase text-light-text dark:text-white">
              FEATURED RELEASES
            </h3>
          </div>
          <Link
            to="/shop"
            className="flex items-center space-x-1 font-bold text-sm text-primary hover:text-primary-hover tracking-wider uppercase"
          >
            <span>View All Sneakers</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map((product, idx) => (
            <ProductCard key={product.id} product={product} index={idx} />
          ))}
        </div>
      </section>

      {/* Collections Section (Tabs for New Arrivals, Trending, Best Sellers) */}
      <section className="bg-light-bg dark:bg-dark-card/50 py-20 border-y border-light-border dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-16">
          <div className="text-center space-y-3">
            <h2 className="text-sm font-black text-primary uppercase tracking-widest">COLLECTIONS</h2>
            <h3 className="text-3xl sm:text-4xl font-extrabold uppercase text-light-text dark:text-white">
              EXPLORE OUR SECTIONS
            </h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* New Arrivals Panel */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-light-border dark:border-dark-border pb-3">
                <Clock className="w-5 h-5 text-primary" />
                <h4 className="font-extrabold text-lg text-light-text dark:text-white uppercase tracking-wider">
                  New Arrivals
                </h4>
              </div>
              <div className="space-y-4">
                {newArrivals.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white dark:hover:bg-dark-card transition-all duration-300 border border-transparent hover:border-light-border dark:hover:border-dark-border/40 group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-light-border dark:bg-dark-border"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{product.brand}</span>
                      <h5 className="font-bold text-sm text-light-text dark:text-white truncate group-hover:text-primary transition-colors">
                        {product.name}
                      </h5>
                      <p className="text-sm font-black text-light-text dark:text-gray-300">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Trending Panel */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-light-border dark:border-dark-border pb-3">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h4 className="font-extrabold text-lg text-light-text dark:text-white uppercase tracking-wider">
                  Trending Now
                </h4>
              </div>
              <div className="space-y-4">
                {trending.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white dark:hover:bg-dark-card transition-all duration-300 border border-transparent hover:border-light-border dark:hover:border-dark-border/40 group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-light-border dark:bg-dark-border"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{product.brand}</span>
                      <h5 className="font-bold text-sm text-light-text dark:text-white truncate group-hover:text-primary transition-colors">
                        {product.name}
                      </h5>
                      <p className="text-sm font-black text-light-text dark:text-gray-300">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Best Sellers Panel */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 border-b border-light-border dark:border-dark-border pb-3">
                <Star className="w-5 h-5 text-primary fill-primary" />
                <h4 className="font-extrabold text-lg text-light-text dark:text-white uppercase tracking-wider">
                  Best Sellers
                </h4>
              </div>
              <div className="space-y-4">
                {bestSellers.map((product) => (
                  <Link
                    key={product.id}
                    to={`/product/${product.id}`}
                    className="flex items-center space-x-4 p-3 rounded-xl hover:bg-white dark:hover:bg-dark-card transition-all duration-300 border border-transparent hover:border-light-border dark:hover:border-dark-border/40 group"
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-light-border dark:bg-dark-border"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] uppercase font-bold text-primary tracking-widest">{product.brand}</span>
                      <h5 className="font-bold text-sm text-light-text dark:text-white truncate group-hover:text-primary transition-colors">
                        {product.name}
                      </h5>
                      <p className="text-sm font-black text-light-text dark:text-gray-300">
                        ₹{product.price.toLocaleString("en-IN")}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-sm font-black text-primary uppercase tracking-widest">FEEDBACK</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold uppercase text-light-text dark:text-white">
            WHAT OUR CUSTOMERS SAY
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="p-6 rounded-2xl glass-card border border-light-border dark:border-dark-border/40 flex flex-col justify-between"
            >
              <div>
                <div className="flex space-x-0.5 mb-4">
                  {[...Array(t.stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-sm text-light-text/90 dark:text-gray-200 leading-relaxed italic mb-6">
                  "{t.comment}"
                </p>
              </div>

              <div className="flex items-center space-x-3 pt-4 border-t border-light-border dark:border-dark-border/50">
                <img
                  src={t.img}
                  alt={t.name}
                  className="w-10 h-10 rounded-full object-cover border border-primary/20"
                />
                <div>
                  <h4 className="font-bold text-sm text-light-text dark:text-white">{t.name}</h4>
                  <p className="text-[10px] text-primary uppercase font-bold tracking-widest">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section className="max-w-4xl mx-auto px-4 sm:px-8">
        <div className="p-10 rounded-3xl glass-card border border-light-border dark:border-dark-border/40 text-center space-y-6 relative overflow-hidden glow-orange">
          {/* Decorative glowing gradient blur */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/8 rounded-full blur-[100px] pointer-events-none" />

          <h3 className="text-3xl font-extrabold uppercase tracking-tight text-light-text dark:text-white">
            GET THE LATEST DROPS & DEALS
          </h3>
          <p className="text-sm text-light-muted dark:text-dark-muted max-w-lg mx-auto">
            Subscribe to our newsletter list and be the first to know about new restocks, rare drops, and exclusive WhatsApp-only discount codes.
          </p>

          {newsletterSubscribed ? (
            <motion.p
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-emerald-500 font-bold text-sm uppercase tracking-wider"
            >
              ✓ Thank you! You have subscribed to Teens Emporium.
            </motion.p>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto pt-2">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-[#f7f3eb] dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl px-4 py-3 text-sm outline-none focus:border-primary text-[#111827] dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
              />
              <button
                type="submit"
                className="bg-primary hover:bg-primary-hover text-white font-bold px-6 py-3 rounded-xl text-sm transition-all duration-300 active:scale-95 border border-primary/10 flex items-center justify-center space-x-1.5"
              >
                <Mail className="w-4 h-4" />
                <span>SUBSCRIBE</span>
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center space-y-3 mb-16">
          <h2 className="text-sm font-black text-primary uppercase tracking-widest">SUPPORT</h2>
          <h3 className="text-3xl sm:text-4xl font-extrabold uppercase text-light-text dark:text-white">
            GET IN TOUCH WITH US
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Contact Details */}
          <div className="lg:col-span-5 space-y-6">
            <div className="p-6 rounded-2xl glass-card border border-light-border dark:border-dark-border/40 space-y-6">
              <h4 className="font-extrabold text-base text-light-text dark:text-white uppercase tracking-wider mb-2">
                Teens Emporium HQ
              </h4>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 flex-shrink-0">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-light-text dark:text-white mb-0.5">Address Location</h5>
                  <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">
                    Teens Emporium, Chennai, Tamil Nadu, India.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 flex-shrink-0">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-light-text dark:text-white mb-0.5">Email Support</h5>
                  <p className="text-xs text-light-muted dark:text-dark-muted">
                    {siteSettings.supportEmail}
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-primary/10 p-2.5 rounded-xl border border-primary/20 flex-shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h5 className="font-bold text-sm text-light-text dark:text-white mb-0.5">WhatsApp Hotlines</h5>
                  <div className="text-xs text-light-muted dark:text-dark-muted space-y-1">
                    <p className="flex items-center space-x-1">
                      <span className="font-bold text-light-text dark:text-white">+91 {siteSettings.whatsappNumber}</span>
                      <span>(Primary)</span>
                    </p>
                    {siteSettings.secondaryWhatsappNumber ? (
                      <p className="flex items-center space-x-1">
                        <span className="font-bold text-light-text dark:text-white">+91 {siteSettings.secondaryWhatsappNumber}</span>
                        <span>(Secondary)</span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form details or Map fallback */}
          <div className="lg:col-span-7">
            <div className="p-6 rounded-2xl glass-card border border-light-border dark:border-dark-border/40 h-full flex flex-col justify-between">
              <h4 className="font-extrabold text-base text-light-text dark:text-white uppercase tracking-wider mb-4">
                Quick Enquiry
              </h4>
              <form onSubmit={(e) => { e.preventDefault(); alert("Enquiry message simulated. Thank you!"); }} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    className="w-full bg-[#ffffff] text-[#0f172a] border border-[#0f172a] rounded-xl p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500 shadow-sm"
                  />
                  <input
                    type="email"
                    required
                    placeholder="Your Email"
                    className="w-full bg-[#ffffff] text-[#0f172a] border border-[#0f172a] rounded-xl p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500 shadow-sm"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Subject"
                  className="w-full bg-[#ffffff] text-[#0f172a] border border-[#0f172a] rounded-xl p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500 shadow-sm"
                />
                <textarea
                  rows="4"
                  required
                  placeholder="Your Message..."
                  className="w-full bg-[#ffffff] text-[#0f172a] border border-[#0f172a] rounded-xl p-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 placeholder:text-slate-500 shadow-sm"
                />
                <button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary-hover text-white font-bold py-3.5 px-6 rounded-xl text-sm transition-colors shadow-md shadow-primary/20"
                >
                  SEND MESSAGE
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
