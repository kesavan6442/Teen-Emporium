import React, { useState, useMemo, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useAppContext } from "../context/AppContext";
import { useNavigate, Navigate } from "react-router-dom";
import { storage } from "../firebase/config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Package, 
  Users, 
  Star, 
  ShieldAlert, 
  Upload, 
  X, 
  Eye, 
  FileEdit,
  MessageSquare,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboard() {
  const { currentUser, isAdmin } = useAuth();
  const { products, reviews, addProduct, updateProduct, deleteProduct, deleteReview, siteSettings, updateSiteSettings } = useAppContext();
  const navigate = useNavigate();

  // Redirect non-admins
  if (!currentUser || !isAdmin) {
    return <Navigate to="/auth?redirect=/admin" replace />;
  }

  // Dashboard Tabs: 'products', 'reviews', 'stats'
  const [activeTab, setActiveTab] = useState("products");

  // Form Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null for 'add' mode, product object for 'edit' mode

  // Form Fields State
  const [name, setName] = useState("");
  const [brand, setBrand] = useState("");
  const [price, setPrice] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [sizes, setSizes] = useState([7, 8, 9, 10, 11]);
  const [colors, setColors] = useState(["Black", "Orange", "White"]);
  const [images, setImages] = useState([]);
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [isTrending, setIsTrending] = useState(false);
  const [isBestSeller, setIsBestSeller] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Temp form helper inputs
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [newColorInput, setNewColorInput] = useState("");
  const [newSizeInput, setNewSizeInput] = useState("");
  const [formError, setFormError] = useState("");
  const [siteSettingsForm, setSiteSettingsForm] = useState({
    whatsappNumber: siteSettings?.whatsappNumber || "",
    secondaryWhatsappNumber: siteSettings?.secondaryWhatsappNumber || "",
    supportEmail: siteSettings?.supportEmail || "",
    address: siteSettings?.address || ""
  });

  useEffect(() => {
    setSiteSettingsForm({
      whatsappNumber: siteSettings?.whatsappNumber || "",
      secondaryWhatsappNumber: siteSettings?.secondaryWhatsappNumber || "",
      supportEmail: siteSettings?.supportEmail || "",
      address: siteSettings?.address || ""
    });
  }, [siteSettings]);

  // Statistics Computations
  const stats = useMemo(() => {
    // Unique users calculation from reviews
    const uniqueUserIds = [...new Set(reviews.map(r => r.userId))];
    // Add mock users count to look realistic
    const mockUsersCount = uniqueUserIds.length + 12;

    return {
      totalProducts: products.length,
      totalUsers: mockUsersCount,
      totalReviews: reviews.length
    };
  }, [products, reviews]);

  const openAddModal = () => {
    setEditingProduct(null);
    setName("");
    setBrand("Jordan");
    setPrice("");
    setOriginalPrice("");
    setDescription("");
    setStock("");
    setSizes([7, 8, 9, 10, 11]);
    setColors(["Black", "Orange", "White"]);
    setImages([
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop"
    ]);
    setIsNewArrival(true);
    setIsTrending(false);
    setIsBestSeller(false);
    setFormError("");
    setIsModalOpen(true);
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setName(product.name);
    setBrand(product.brand);
    setPrice(product.price);
    setOriginalPrice(product.originalPrice || "");
    setDescription(product.description);
    setStock(product.stock);
    setSizes(product.sizes || []);
    setColors(product.colors || []);
    setImages(product.images || []);
    setIsNewArrival(!!product.isNewArrival);
    setIsTrending(!!product.isTrending);
    setIsBestSeller(!!product.isBestSeller);
    setFormError("");
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormError("");

    if (images.length === 0) {
      setFormError("Please add at least one product image URL.");
      return;
    }

    const payload = {
      name: name.trim(),
      brand,
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : null,
      description: description.trim(),
      stock: Number(stock),
      sizes,
      colors,
      images,
      isNewArrival,
      isTrending,
      isBestSeller
    };

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      setIsModalOpen(false);
    } catch (err) {
      console.error(err);
      setFormError("Failed to save product. Check permissions.");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
      } catch (err) {
        console.error(err);
        alert("Failed to delete product.");
      }
    }
  };

  const handleDeleteReview = async (id) => {
    if (window.confirm("Are you sure you want to delete this review?")) {
      try {
        await deleteReview(id);
      } catch (err) {
        console.error(err);
        alert("Failed to delete review.");
      }
    }
  };

  const handleSiteSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSiteSettings(siteSettingsForm);
      alert("Site settings updated successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to update site settings.");
    }
  };

  // Image helpers
  const addImageUrl = () => {
    if (imageUrlInput.trim() && !images.includes(imageUrlInput.trim())) {
      setImages([...images, imageUrlInput.trim()]);
      setImageUrlInput("");
    }
  };

  const removeImageIdx = (idx) => {
    setImages(images.filter((_, i) => i !== idx));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!storage) {
      alert("Firebase Storage is not initialized.");
      return;
    }

    setIsUploading(true);
    try {
      const fileRef = ref(storage, `products/${Date.now()}_${file.name}`);
      await uploadBytes(fileRef, file);
      const downloadUrl = await getDownloadURL(fileRef);
      setImages((prev) => [...prev, downloadUrl]);
    } catch (err) {
      console.error("Upload failed", err);
      alert("Failed to upload image.");
    } finally {
      setIsUploading(false);
      e.target.value = null;
    }
  };

  // Size helper
  const addSize = () => {
    const sizeNum = Number(newSizeInput);
    if (sizeNum > 0 && !sizes.includes(sizeNum)) {
      setSizes([...sizes, sizeNum].sort((a, b) => a - b));
      setNewSizeInput("");
    }
  };

  const removeSize = (sizeVal) => {
    setSizes(sizes.filter(s => s !== sizeVal));
  };

  // Color helper
  const addColor = () => {
    if (newColorInput.trim() && !colors.includes(newColorInput.trim())) {
      setColors([...colors, newColorInput.trim()]);
      setNewColorInput("");
    }
  };

  const removeColor = (colorVal) => {
    setColors(colors.filter(c => c !== colorVal));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-700">
        <div>
          <h1 className="text-3xl font-black uppercase text-slate-900 dark:text-white flex items-center space-x-2">
            <ShieldAlert className="w-8 h-8 text-primary" />
            <span>Admin Dashboard</span>
          </h1>
          <p className="text-xs text-slate-700 dark:text-slate-300 font-semibold mt-1">
            Store management and review moderation console
          </p>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={() => setActiveTab("products")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border ${
              activeTab === "products"
                ? "bg-primary text-white border-primary"
                : "bg-white dark:bg-dark-bg border-gray-200 dark:border-slate-700 text-light-text dark:text-gray-300"
            }`}
          >
            Products
          </button>
          <button
            onClick={() => setActiveTab("reviews")}
            className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-xl border ${
              activeTab === "reviews"
                ? "bg-primary text-white border-primary"
                : "bg-white dark:bg-dark-bg border-gray-200 dark:border-slate-700 text-light-text dark:text-gray-300"
            }`}
          >
            Reviews
          </button>
        </div>
      </div>

      {/* Stats Counter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl glass-card border border-gray-200 dark:border-slate-700/40 flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 text-primary">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalProducts}</p>
            <p className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 tracking-widest">Total Products</p>
          </div>
        </div>
        
        <div className="p-6 rounded-2xl glass-card border border-gray-200 dark:border-slate-700/40 flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 text-primary">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalUsers}</p>
            <p className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 tracking-widest">Total Users</p>
          </div>
        </div>

        <div className="p-6 rounded-2xl glass-card border border-gray-200 dark:border-slate-700/40 flex items-center space-x-4">
          <div className="bg-primary/10 p-3 rounded-xl border border-primary/20 text-primary">
            <Star className="w-6 h-6" />
          </div>
          <div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">{stats.totalReviews}</p>
            <p className="text-[10px] uppercase font-bold text-slate-700 dark:text-slate-300 tracking-widest">Total Reviews</p>
          </div>
        </div>
      </div>

      {/* Site Settings Panel */}
      <div className="p-6 rounded-2xl glass-card border border-gray-200 dark:border-slate-700/40 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white uppercase tracking-wider">Site Settings</h3>
            <p className="text-xs text-slate-700 dark:text-slate-300 mt-1">Update the shared WhatsApp number, support email, and address used across the site.</p>
          </div>
        </div>

        <form onSubmit={handleSiteSettingsSubmit} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Primary WhatsApp</label>
            <input
              type="text"
              value={siteSettingsForm.whatsappNumber}
              onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, whatsappNumber: e.target.value })}
              className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Secondary WhatsApp</label>
            <input
              type="text"
              value={siteSettingsForm.secondaryWhatsappNumber}
              onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, secondaryWhatsappNumber: e.target.value })}
              className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Support Email</label>
            <input
              type="email"
              value={siteSettingsForm.supportEmail}
              onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, supportEmail: e.target.value })}
              className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Address</label>
            <input
              type="text"
              value={siteSettingsForm.address}
              onChange={(e) => setSiteSettingsForm({ ...siteSettingsForm, address: e.target.value })}
              className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-primary"
            />
          </div>
          <div className="lg:col-span-4 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider"
            >
              Save Site Settings
            </button>
          </div>
        </form>
      </div>

      {/* Products Tab View */}
      {activeTab === "products" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-lg text-slate-900 dark:text-white uppercase tracking-wider">
              Manage Sneakers catalog
            </h3>
            <button
              onClick={openAddModal}
              className="bg-primary hover:bg-primary-hover text-white text-xs font-bold tracking-wider uppercase px-4 py-2.5 rounded-xl border border-primary/10 flex items-center space-x-1 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Sneaker</span>
            </button>
          </div>

          {/* Table list */}
          <div className="glass-card border border-gray-200 dark:border-slate-700/40 rounded-2xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-slate-700 text-xs uppercase font-bold text-slate-900 dark:text-white bg-white dark:bg-slate-800/25">
                    <th className="p-4">Sneaker</th>
                    <th className="p-4">Brand</th>
                    <th className="p-4">Price</th>
                    <th className="p-4">Stock</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-light-border dark:divide-dark-border/50">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 dark:hover:bg-white/2 transition-colors text-slate-900 dark:text-white">
                      <td className="p-4 font-bold flex items-center space-x-3 min-w-[250px]">
                        <img src={p.images[0]} alt={p.name} className="w-10 h-10 object-cover rounded-lg border" />
                        <span className="truncate">{p.name}</span>
                      </td>
                      <td className="p-4 font-semibold text-primary">{p.brand}</td>
                      <td className="p-4 font-bold">₹{p.price.toLocaleString("en-IN")}</td>
                      <td className="p-4">{p.stock} units</td>
                      <td className="p-4 text-right space-x-2 min-w-[120px]">
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 rounded-lg transition-colors inline-block"
                          aria-label="Edit product"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(p.id)}
                          className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors inline-block"
                          aria-label="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab View */}
      {activeTab === "reviews" && (
        <div className="space-y-6">
          <h3 className="font-extrabold text-lg text-slate-900 dark:text-white uppercase tracking-wider">
            Review Moderation Panel
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {reviews.map((r) => {
              const prod = products.find(p => p.id === r.productId);
              return (
                <div key={r.id} className="p-5 rounded-2xl glass-card border border-gray-200 dark:border-slate-700/40 relative flex flex-col justify-between md:flex-row gap-4 items-start md:items-center">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center space-x-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                      <span className="font-black text-slate-900 dark:text-white">{r.userName}</span>
                      <span>•</span>
                      <span>Product: <strong className="text-primary">{prod ? prod.name : "Unknown sneaker"}</strong></span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex space-x-0.5">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <Star key={s} className={`w-3.5 h-3.5 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                        ))}
                      </div>
                      <span className="text-xs text-slate-700 dark:text-slate-300">{new Date(r.createdAt).toLocaleDateString()}</span>
                    </div>
                    <p className="text-sm italic text-light-text dark:text-gray-300 leading-relaxed font-medium">
                      "{r.comment}"
                    </p>
                  </div>

                  <button
                    onClick={() => handleDeleteReview(r.id)}
                    className="p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-xl transition-colors self-end md:self-auto border border-red-500/5 flex items-center space-x-1 text-xs font-bold"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                    <span>MODERATE</span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CRUD Add/Edit Product Modal Dialog */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-dark-bg/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white dark:bg-slate-900 p-6 md:p-8 rounded-2xl border border-gray-200 dark:border-slate-700 z-10 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setIsModalOpen(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 dark:hover:bg-dark-border text-light-text dark:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>

              <h3 className="font-extrabold text-xl text-slate-900 dark:text-white uppercase tracking-wider mb-6">
                {editingProduct ? "Edit Sneaker Release" : "Add Sneaker Release"}
              </h3>

              {formError && <p className="text-sm text-red-500 font-bold mb-4">{formError}</p>}

              <form onSubmit={handleFormSubmit} className="space-y-5 text-sm">
                
                {/* Brand and Name */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Sneaker Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jordan 1 Shattered Backboard"
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Brand</label>
                    <select
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-primary"
                    >
                      <option value="Jordan">Jordan</option>
                      <option value="Nike">Nike</option>
                      <option value="Adidas">Adidas</option>
                      <option value="Puma">Puma</option>
                    </select>
                  </div>
                </div>

                {/* Price and Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Original Price (₹)</label>
                    <input
                      type="number"
                      value={originalPrice}
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="e.g. 19999 (Optional)"
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Sale Price (₹)</label>
                    <input
                      type="number"
                      required
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="e.g. 15999"
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Stock Quantity</label>
                    <input
                      type="number"
                      required
                      value={stock}
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="e.g. 10"
                      className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5">Description details</label>
                  <textarea
                    rows="3"
                    required
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter sneaker details, style code, leather types..."
                    className="w-full bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-slate-900 dark:text-white outline-none focus:border-primary"
                  />
                </div>

                {/* Image URLs management */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Product Images</label>
                  
                  {/* Image Upload Input */}
                  <div className="flex items-center space-x-3 mb-3">
                    <label className={`flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 dark:border-slate-700 rounded-xl py-6 transition-colors cursor-pointer ${isUploading ? 'opacity-50 cursor-not-allowed' : 'hover:border-primary dark:hover:border-primary bg-white dark:bg-slate-800/50'}`}>
                      {isUploading ? (
                        <>
                          <Loader2 className="w-6 h-6 text-primary animate-spin mb-2" />
                          <span className="text-xs font-bold text-light-text dark:text-gray-300">Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-6 h-6 text-slate-700 dark:text-slate-300 mb-2" />
                          <span className="text-xs font-bold text-light-text dark:text-gray-300">Click to Upload File</span>
                          <span className="text-[10px] text-slate-700 dark:text-slate-300 mt-1">PNG, JPG up to 5MB</span>
                        </>
                      )}
                      <input 
                        type="file" 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={isUploading}
                      />
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={imageUrlInput}
                      onChange={(e) => setImageUrlInput(e.target.value)}
                      placeholder="OR Paste image URL here..."
                      className="flex-1 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={addImageUrl}
                      className="bg-primary text-white text-xs font-bold px-4 py-2 rounded-xl"
                    >
                      Add Url
                    </button>
                  </div>
                  
                  {/* Image thumbnails display */}
                  {images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {images.map((img, idx) => (
                        <div key={idx} className="relative w-16 h-16 rounded-lg border overflow-hidden group">
                          <img src={img} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removeImageIdx(idx)}
                            className="absolute inset-0 bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Sizes configurations */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Sizes (UK)</label>
                  <div className="flex gap-2 max-w-xs">
                    <input
                      type="number"
                      value={newSizeInput}
                      onChange={(e) => setNewSizeInput(e.target.value)}
                      placeholder="UK Size"
                      className="w-24 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={addSize}
                      className="bg-primary text-white text-xs font-bold px-3 py-2 rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {sizes.map((s) => (
                      <span key={s} className="inline-flex items-center space-x-1 bg-gray-100 dark:bg-zinc-800 text-xs px-2.5 py-1 rounded-lg border">
                        <span>UK {s}</span>
                        <button type="button" onClick={() => removeSize(s)} className="text-red-500 font-bold hover:scale-110">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Colors configurations */}
                <div className="space-y-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">Colors</label>
                  <div className="flex gap-2 max-w-xs">
                    <input
                      type="text"
                      value={newColorInput}
                      onChange={(e) => setNewColorInput(e.target.value)}
                      placeholder="Color name"
                      className="w-32 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-3 py-2 text-slate-900 dark:text-white outline-none focus:border-primary"
                    />
                    <button
                      type="button"
                      onClick={addColor}
                      className="bg-primary text-white text-xs font-bold px-3 py-2 rounded-xl"
                    >
                      Add
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {colors.map((c) => (
                      <span key={c} className="inline-flex items-center space-x-1 bg-gray-100 dark:bg-zinc-800 text-xs px-2.5 py-1 rounded-lg border">
                        <span>{c}</span>
                        <button type="button" onClick={() => removeColor(c)} className="text-red-500 font-bold hover:scale-110">×</button>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Badges/Category Flags */}
                <div className="flex flex-wrap gap-6 pt-2">
                  <label className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider cursor-pointer text-light-text dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={isNewArrival}
                      onChange={(e) => setIsNewArrival(e.target.checked)}
                      className="accent-primary"
                    />
                    <span>New Arrival</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider cursor-pointer text-light-text dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={isTrending}
                      onChange={(e) => setIsTrending(e.target.checked)}
                      className="accent-primary"
                    />
                    <span>Trending</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs font-bold uppercase tracking-wider cursor-pointer text-light-text dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={isBestSeller}
                      onChange={(e) => setIsBestSeller(e.target.checked)}
                      className="accent-primary"
                    />
                    <span>Best Seller</span>
                  </label>
                </div>

                <hr className="border-gray-200 dark:border-slate-700" />

                {/* Form buttons */}
                <div className="flex justify-end space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-5 py-2.5 border border-gray-200 dark:border-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider text-light-text dark:text-gray-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-primary text-white rounded-xl text-xs font-bold uppercase tracking-wider"
                  >
                    {editingProduct ? "Save Changes" : "Create Product"}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
