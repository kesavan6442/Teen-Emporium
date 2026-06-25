import React from "react";
import { Link } from "react-router-dom";
import { Send, Phone, MapPin, Mail, Award, CheckCircle, ShieldCheck } from "lucide-react";
import { useAppContext } from "../context/AppContext";

export default function Footer() {
  const { siteSettings = { supportEmail: "support@teensemporium.com", whatsappNumber: "6381695564", secondaryWhatsappNumber: "" } } = useAppContext();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#161b2f] dark:bg-dark-bg border-t border-light-border dark:border-dark-border text-white dark:text-gray-300 transition-colors duration-300">
      {/* Banner benefits */}
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-8 border-b border-[#2b3558] dark:border-dark-border grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full border border-primary/20">
            <Award className="w-6 h-6 text-primary-dark dark:text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white">100% Authentic Sneakers</h4>
            <p className="text-xs text-gray-300">Verified premium sneakers from verified suppliers.</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full border border-primary/20">
            <Phone className="w-6 h-6 text-primary-dark dark:text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white">WhatsApp Fast Order</h4>
            <p className="text-xs text-gray-300">Order directly with our premium personal shoppers.</p>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-full border border-primary/20">
            <ShieldCheck className="w-6 h-6 text-primary-dark dark:text-primary" />
          </div>
          <div>
            <h4 className="font-bold text-sm uppercase tracking-wider text-white">Secure Transactions</h4>
            <p className="text-xs text-gray-300">Direct verification and assistance before pay.</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand Column */}
        <div className="space-y-4">
          <Link to="/" className="inline-block font-black text-2xl tracking-wider">
            <span className="text-white">TEENS</span>
            <span className="ml-1 text-primary">EMPORIUM</span>
          </Link>
          <p className="text-sm text-gray-300">
            The ultimate destination for luxury streetwear and high-end sneaker culture. Elevate your footwear game with exclusive releases.
          </p>
          <div className="flex space-x-4">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-light-border dark:bg-dark-border flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <i className="fa-brands fa-instagram text-sm"></i>
            </a>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-light-border dark:bg-dark-border flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <i className="fa-brands fa-facebook-f text-sm"></i>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="w-9 h-9 rounded-full bg-light-border dark:bg-dark-border flex items-center justify-center hover:bg-primary hover:text-white transition-colors">
              <i className="fa-brands fa-twitter text-sm"></i>
            </a>
          </div>
        </div>

        {/* Collections */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest text-white mb-4">Collections</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link to="/shop?brand=Jordan" className="hover:text-primary transition-colors">Air Jordan Retro</Link>
            </li>
            <li>
              <Link to="/shop?brand=Nike" className="hover:text-primary transition-colors">Nike Dunk & Air Force</Link>
            </li>
            <li>
              <Link to="/shop?brand=Adidas" className="hover:text-primary transition-colors">Yeezy Collection</Link>
            </li>
            <li>
              <Link to="/shop?brand=Puma" className="hover:text-primary transition-colors">Puma RS Series</Link>
            </li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold text-sm uppercase tracking-widest text-white mb-4">Quick Links</h3>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>
              <Link to="/shop" className="hover:text-primary transition-colors">Shop All Sneakers</Link>
            </li>
            <li>
              <Link to="/wishlist" className="hover:text-primary transition-colors">Your Wishlist</Link>
            </li>
            <li>
              <Link to="/auth" className="hover:text-primary transition-colors">My Profile</Link>
            </li>
            <li>
              <a href="#contact" className="hover:text-primary transition-colors">Contact Support</a>
            </li>
          </ul>
        </div>

        {/* Contacts */}
        <div className="space-y-3">
          <h3 className="font-bold text-sm uppercase tracking-widest text-white mb-4">Contact Info</h3>
          
          <div className="flex items-start space-x-2 text-sm text-gray-300">
            <MapPin className="w-4 h-4 text-primary-dark dark:text-primary mt-1 flex-shrink-0" />
            <span>Chennai, Tamil Nadu, India</span>
          </div>

          <div className="flex items-start space-x-2 text-sm text-gray-300">
            <Mail className="w-4 h-4 text-primary-dark dark:text-primary mt-0.5 flex-shrink-0" />
            <span>{siteSettings.supportEmail}</span>
          </div>

          <div className="flex items-start space-x-2 text-sm text-gray-300">
            <Phone className="w-4 h-4 text-primary-dark dark:text-primary mt-0.5 flex-shrink-0" />
            <div className="flex flex-col">
              <span>+91 {siteSettings.whatsappNumber}</span>
              {siteSettings.secondaryWhatsappNumber ? <span>+91 {siteSettings.secondaryWhatsappNumber}</span> : null}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-[#12172a] dark:bg-navy-950 py-6 px-4 sm:px-8 text-center text-xs text-gray-300 border-t border-[#2b3558] dark:border-dark-border">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {currentYear} TEENS EMPORIUM. All Rights Reserved. Built for premium sneaker enthusiasts.</p>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-primary transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
