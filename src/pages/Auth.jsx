import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  ShoppingBag,
  Heart,
  KeyRound,
  LogOut,
  Edit2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Auth() {
  const { 
    currentUser, 
    login, 
    signup, 
    googleLogin, 
    resetPassword, 
    updateDisplayName, 
    isAdmin 
  } = useAuth();

  const { wishlist, cart } = useAppContext();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  // Auth Modes: 'login', 'signup', 'forgot'
  const [mode, setMode] = useState("login");

  // Inputs State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [newName, setNewName] = useState("");
  
  // Feedback State
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Clear feedback on mode change
  useEffect(() => {
    setError("");
    setMessage("");
  }, [mode]);

  const handleGoogleSignIn = async () => {
    setError("");
    setLoading(true);
    try {
      await googleLogin();
      navigate(redirect);
    } catch (err) {
      console.error(err);
      setError("Google Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "login") {
        await login(email, password);
        navigate(redirect);
      } else if (mode === "signup") {
        await signup(name, email, password);
        navigate(redirect);
      } else if (mode === "forgot") {
        await resetPassword(email);
        setMessage("Password reset instructions sent to your email!");
      }
    } catch (err) {
      console.error(err);
      setError(err.message || "Authentication process failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    setError("");
    try {
      await updateDisplayName(newName.trim());
      setIsEditingProfile(false);
      setMessage("Profile display name updated successfully!");
    } catch (err) {
      console.error(err);
      setError("Failed to update profile name.");
    } finally {
      setLoading(false);
    }
  };

  // If already logged in, show Profile Page
  if (currentUser) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8 min-h-[70vh] flex flex-col justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card border border-light-border dark:border-dark-border/40 rounded-3xl p-8 md:p-12 relative overflow-hidden glow-orange"
        >
          {/* Background glowing blob */}
          <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Col: Account Info */}
            <div className="md:col-span-5 space-y-6 text-center md:text-left">
              <div className="mx-auto md:mx-0 w-24 h-24 rounded-full bg-primary/15 border-2 border-primary/20 flex items-center justify-center">
                <User className="w-12 h-12 text-primary" />
              </div>

              <div className="space-y-1">
                {isEditingProfile ? (
                  <form onSubmit={handleUpdateName} className="space-y-2">
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      placeholder="Display Name"
                      className="bg-white dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl px-3 py-2 text-sm text-light-text dark:text-white outline-none focus:border-primary w-full"
                    />
                    <div className="flex space-x-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-primary hover:bg-primary-hover text-white text-xs px-3 py-1.5 rounded-lg font-bold"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsEditingProfile(false)}
                        className="bg-gray-200 dark:bg-dark-border text-light-text dark:text-gray-300 text-xs px-3 py-1.5 rounded-lg"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <h2 className="text-2xl font-black text-light-text dark:text-white flex items-center justify-center md:justify-start space-x-2 uppercase">
                    <span>{currentUser.displayName || "Teens Customer"}</span>
                    <button 
                      onClick={() => {
                        setNewName(currentUser.displayName || "");
                        setIsEditingProfile(true);
                      }}
                      className="p-1 text-light-muted dark:text-dark-muted hover:text-primary transition-colors"
                      aria-label="Edit Profile Name"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </h2>
                )}
                <p className="text-sm text-light-muted dark:text-dark-muted font-medium">{currentUser.email}</p>
                <div className="pt-2 flex justify-center md:justify-start">
                  <span className="text-[10px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20 text-primary">
                    {isAdmin ? "Admin Account" : "Premium Member"}
                  </span>
                </div>
              </div>

              {message && <p className="text-xs text-emerald-500 font-semibold">{message}</p>}
              {error && <p className="text-xs text-red-500 font-semibold">{error}</p>}
            </div>

            {/* Right Col: Stats & Dashboard shortcuts */}
            <div className="md:col-span-7 space-y-6">
              <h3 className="font-extrabold text-base text-light-text dark:text-white uppercase tracking-wider">
                My Dashboard Statistics
              </h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/10 text-center">
                  <Heart className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xl font-black text-light-text dark:text-white">{wishlist.length}</p>
                  <p className="text-[10px] uppercase font-bold text-light-muted dark:text-dark-muted tracking-wider">Wishlist Items</p>
                </div>
                <div className="p-4 rounded-xl border border-light-border dark:border-dark-border bg-gray-50/50 dark:bg-dark-bg/10 text-center">
                  <ShoppingBag className="w-5 h-5 text-primary mx-auto mb-2" />
                  <p className="text-xl font-black text-light-text dark:text-white">{cart.reduce((s, i) => s + i.quantity, 0)}</p>
                  <p className="text-[10px] uppercase font-bold text-light-muted dark:text-dark-muted tracking-wider">Cart Items</p>
                </div>
              </div>

              <div className="flex flex-col space-y-3 pt-2">
                <Link
                  to="/shop"
                  className="w-full text-center bg-primary hover:bg-primary-hover text-white py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-colors"
                >
                  Shop Sneakers
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    className="w-full text-center bg-transparent border border-primary/20 hover:border-primary/50 text-primary py-3.5 rounded-xl font-bold text-sm tracking-wider uppercase transition-colors flex items-center justify-center space-x-1.5"
                  >
                    <ShieldCheck className="w-4.5 h-4.5" />
                    <span>Go to Admin Panel</span>
                  </Link>
                )}
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    );
  }

  // Auth Forms
  return (
    <div className="max-w-md mx-auto px-4 py-16 min-h-[80vh] flex flex-col justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="glass-card border border-light-border dark:border-dark-border/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden glow-orange"
      >
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />

        {/* Title */}
        <div className="text-center space-y-1 mb-8">
          <h2 className="font-black text-2xl uppercase tracking-wider text-light-text dark:text-white">
            {mode === "login" && "Welcome Back"}
            {mode === "signup" && "Create Account"}
            {mode === "forgot" && "Reset Password"}
          </h2>
          <p className="text-xs text-light-muted dark:text-dark-muted">
            {mode === "login" && "Log in to your Teens account"}
            {mode === "signup" && "Sign up to buy premium sneakers"}
            {mode === "forgot" && "Receive reset instructions via email"}
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/25 text-red-500 text-xs font-semibold rounded-xl text-center mb-6 animate-fade-in">
            {error}
          </div>
        )}

        {message && (
          <div className="p-3 bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-xs font-semibold rounded-xl text-center mb-6 animate-fade-in">
            {message}
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleAuthSubmit} className="space-y-4">
          
          {mode === "signup" && (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Dinesh Kumar"
                  className="w-full bg-white dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl pl-10 pr-4 py-3 text-sm text-light-text dark:text-white outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl pl-10 pr-4 py-3 text-sm text-light-text dark:text-white outline-none focus:border-primary"
              />
            </div>
          </div>

          {mode !== "forgot" && (
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-light-muted dark:text-dark-muted">
                  Password
                </label>
                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-[11px] font-bold text-primary hover:underline uppercase tracking-wide"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white dark:bg-dark-bg border border-light-border dark:border-dark-border rounded-xl pl-10 pr-4 py-3 text-sm text-light-text dark:text-white outline-none focus:border-primary"
                />
              </div>
            </div>
          )}

          {/* Form Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary-hover disabled:opacity-50 text-white font-bold py-3.5 rounded-xl text-sm tracking-wider uppercase transition-colors shadow-md shadow-primary/20 flex items-center justify-center space-x-1.5"
          >
            {loading ? (
              <span>Processing...</span>
            ) : (
              <>
                <span>
                  {mode === "login" && "Log In"}
                  {mode === "signup" && "Sign Up"}
                  {mode === "forgot" && "Send Reset Link"}
                </span>
                <ArrowRight className="w-4.5 h-4.5" />
              </>
            )}
          </button>

        </form>

        {/* Divider for third party logins */}
        {mode !== "forgot" && (
          <div className="space-y-4 pt-6">
            <div className="flex items-center my-4">
              <hr className="flex-1 border-light-border dark:border-dark-border" />
              <span className="text-[10px] font-bold text-light-muted dark:text-dark-muted px-3 uppercase tracking-wider">
                Or Continue With
              </span>
              <hr className="flex-1 border-light-border dark:border-dark-border" />
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2 border border-light-border dark:border-dark-border bg-white dark:bg-dark-bg text-light-text dark:text-gray-300 py-3 rounded-xl text-sm font-bold transition-all hover:bg-gray-50 dark:hover:bg-dark-card"
            >
              <i className="fa-brands fa-google text-primary text-base"></i>
              <span>Google Account</span>
            </button>
          </div>
        )}

        {/* Toggle auth mode links */}
        <div className="text-center pt-6 text-xs text-light-muted dark:text-dark-muted font-medium">
          {mode === "login" && (
            <p>
              Don't have an account?{" "}
              <button 
                onClick={() => setMode("signup")} 
                className="text-primary font-bold hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}
          {mode === "signup" && (
            <p>
              Already have an account?{" "}
              <button 
                onClick={() => setMode("login")} 
                className="text-primary font-bold hover:underline"
              >
                Log In
              </button>
            </p>
          )}
          {mode === "forgot" && (
            <button 
              onClick={() => setMode("login")} 
              className="text-primary font-bold hover:underline flex items-center justify-center mx-auto space-x-1"
            >
              <KeyRound className="w-3.5 h-3.5 inline" />
              <span>Back to Login</span>
            </button>
          )}
        </div>

      </motion.div>
    </div>
  );
}
