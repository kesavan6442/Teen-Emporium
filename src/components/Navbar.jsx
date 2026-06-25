import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  LogOut, 
  Settings, 
  ChevronDown 
} from "lucide-react";

export default function Navbar({ toggleTheme, isDark }) {
  const { currentUser, isAdmin, logout } = useAuth();
  const { wishlist, cart } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      setProfileDropdown(false);
      navigate("/auth");
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Shop", path: "/shop" },
  ];

  // Close menus on route change
  useEffect(() => {
    setIsOpen(false);
    setProfileDropdown(false);
  }, [location]);

  return (
    <nav className="sticky top-0 z-50 glass-effect transition-all duration-300 border-b border-light-border dark:border-dark-border py-4 px-4 sm:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center space-x-2.5 font-black text-2xl tracking-wider select-none group">
          <span className="text-light-text dark:text-white tracking-[0.15em]">TEENS</span>
          <span className="relative px-2.5 py-0.5 rounded-lg border text-sm align-middle font-black tracking-[0.2em]"
            style={{ background: "linear-gradient(135deg,rgba(201,168,76,0.12),rgba(201,168,76,0.04))", borderColor: "rgba(201,168,76,0.25)" }}
          >
            <span className="text-gradient-gold glow-gold">EMPORIUM</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold tracking-wide uppercase transition-colors hover:text-primary ${
                location.pathname === link.path 
                  ? "active-nav-link text-primary" 
                  : "text-light-text/80 dark:text-gray-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
          {isAdmin && (
            <Link
              to="/admin"
              className={`text-sm font-bold tracking-wide uppercase text-primary/90 hover:text-primary flex items-center space-x-1 border border-primary/20 bg-primary/5 px-2.5 py-1 rounded`}
            >
              <Settings className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          )}
        </div>

        {/* Actions (Theme, Wishlist, Cart, Profile) */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-light-text dark:text-gray-300"
            aria-label="Toggle Theme"
          >
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Wishlist Link */}
          <Link
            to="/wishlist"
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-light-text dark:text-gray-300"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center animate-bounce-slow">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Cart Icon / Cart Link */}
          <Link
            to="/shop?cart=open"
            className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border transition-colors text-light-text dark:text-gray-300"
          >
            <ShoppingBag className="w-5 h-5" />
            {cart.reduce((sum, item) => sum + item.quantity, 0) > 0 && (
              <span className="absolute -top-1 -right-1 bg-dark-bg dark:bg-white text-white dark:text-dark-bg text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            )}
          </Link>

          {/* User Profile / Login dropdown */}
          <div className="relative">
            {currentUser ? (
              <div>
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center space-x-2 text-sm font-medium focus:outline-none hover:text-primary text-light-text dark:text-gray-300 border border-light-border dark:border-dark-border rounded-full px-3 py-1.5 bg-light-card dark:bg-dark-card"
                >
                  <User className="w-4 h-4 text-primary" />
                  <span className="max-w-[100px] truncate">{currentUser.displayName || "User"}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                </button>

                {profileDropdown && (
                  <div className="absolute right-0 mt-2 w-48 glass-card border border-light-border dark:border-dark-border rounded-lg shadow-xl py-2 z-50 animate-fade-in">
                    <div className="px-4 py-2 border-b border-light-border dark:border-dark-border">
                      <p className="text-xs text-light-muted dark:text-dark-muted">Logged in as</p>
                      <p className="text-sm font-semibold truncate text-light-text dark:text-white">
                        {currentUser.email}
                      </p>
                    </div>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="flex items-center space-x-2 px-4 py-2 text-sm text-light-text dark:text-gray-200 hover:bg-primary/10 hover:text-primary transition-colors"
                        onClick={() => setProfileDropdown(false)}
                      >
                        <Settings className="w-4 h-4" />
                        <span>Admin Panel</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-2 px-4 py-2 text-sm text-red-500 hover:bg-red-500/10 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="flex items-center space-x-2 text-sm font-semibold text-white bg-primary hover:bg-primary-hover px-4 py-2 rounded-full transition-all duration-300 shadow-md shadow-primary/20 border border-primary/10 active:scale-95"
              >
                <User className="w-4 h-4" />
                <span>Log In</span>
              </Link>
            )}
          </div>
        </div>

        {/* Mobile menu and action toggles */}
        <div className="flex items-center space-x-4 md:hidden">
          {/* Mobile Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border text-light-text dark:text-gray-300"
          >
            {isDark ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* Wishlist Mobile */}
          <Link
            to="/wishlist"
            className="relative p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border text-light-text dark:text-gray-300"
          >
            <Heart className="w-5 h-5" />
            {wishlist.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center">
                {wishlist.length}
              </span>
            )}
          </Link>

          {/* Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border text-light-text dark:text-gray-300"
            aria-label="Toggle Menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 glass-card border border-light-border dark:border-dark-border rounded-xl p-4 space-y-4 animate-slide-up">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-base font-semibold px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === link.path
                    ? "bg-primary/10 text-primary border border-primary/20"
                    : "text-light-text dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-dark-border"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className="text-base font-bold text-primary px-3 py-2 rounded-lg bg-primary/5 border border-primary/10 flex items-center space-x-2"
              >
                <Settings className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
          </div>

          <hr className="border-light-border dark:border-dark-border" />

          {/* User state in Mobile Menu */}
          <div>
            {currentUser ? (
              <div className="space-y-3 px-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/20 p-2 rounded-full">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold truncate text-light-text dark:text-white">
                      {currentUser.displayName || "User"}
                    </p>
                    <p className="text-xs text-light-muted dark:text-dark-muted truncate">
                      {currentUser.email}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link
                    to="/shop?cart=open"
                    className="flex items-center justify-center space-x-1 py-2 px-3 border border-light-border dark:border-dark-border rounded-lg text-sm text-light-text dark:text-gray-300 bg-light-card dark:bg-dark-card"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center justify-center space-x-1 py-2 px-3 border border-red-500/20 bg-red-500/5 text-red-500 rounded-lg text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Log Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="px-3">
                <Link
                  to="/auth"
                  className="flex items-center justify-center space-x-2 bg-primary hover:bg-primary-hover text-white text-center py-2.5 rounded-lg font-semibold shadow-md shadow-primary/20"
                >
                  <User className="w-4 h-4" />
                  <span>Log In / Sign Up</span>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
