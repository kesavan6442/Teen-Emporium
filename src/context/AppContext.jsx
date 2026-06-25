import React, { createContext, useContext, useState, useEffect } from "react";
import {
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  query, 
  where, 
  onSnapshot,
  setDoc,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";
import { db, isMockEnabled } from "../firebase/config";
import { useAuth } from "./AuthContext";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

const INITIAL_PRODUCTS = [
  {
    id: "prod-7",
    name: "Teens VIP Elite Runner 'Classic Grey'",
    brand: "VIP",
    price: 12499,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Heather Grey", "Charcoal"],
    images: [
      "/products/sneaker_pair.png",
      "/products/sneaker_side.png",
      "/products/sneaker_45.png",
      "/products/sneaker_top.png",
      "/products/sneaker_sole.png"
    ],
    description: "Engineered for active lifestyles. The Teens VIP Elite Runner features a classic heather grey mesh upper, premium supportive suede overlays, and a dual-density midsole for ultimate everyday comfort. Features 5 distinct views for absolute verification.",
    stock: 15,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: true,
    createdAt: new Date(Date.now() - 100000).toISOString()
  },
  {
    id: "prod-8",
    name: "Teens Ortho-Comfort Buckle Sandal",
    brand: "Teens",
    price: 3499,
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ["Slate Grey", "Black"],
    images: [
      "/products/sandal_pair.png",
      "/products/sandal_side.png",
      "/products/sandal_45.png",
      "/products/sandal_top.png",
      "/products/sandal_sole.png"
    ],
    description: "Designed for premium recovery and comfort. Features a soft premium strap with an adjustable adjustable metallic buckle, contoured arch support footbed, and high-traction outdoor sole. Perfect for post-workout or casual leisure wear.",
    stock: 20,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    createdAt: new Date(Date.now() - 200000).toISOString()
  },
  {
    id: "prod-1",
    name: "Air Jordan 1 Retro High OG 'Shattered Backboard'",
    brand: "Jordan",
    price: 18999,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Orange/Black/White", "Triple Black"],
    images: [
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=600&auto=format&fit=crop"
    ],
    description: "The Air Jordan 1 Retro High OG 'Shattered Backboard' features premium leather overlays in sail, black, and starfish orange. A classic silhouette re-engineered for the modern luxury sneakerhead. Iconic style meets ultimate comfort.",
    stock: 12,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: true,
    createdAt: new Date(Date.now() - 500000).toISOString()
  },
  {
    id: "prod-2",
    name: "Air Force 1 '07 Premium 'Orange Peel'",
    brand: "Nike",
    price: 9999,
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ["Orange Peel/White", "Pure White"],
    images: [
      "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=600&auto=format&fit=crop"
    ],
    description: "This premium low-top iconic sneaker features top-tier tumble leather, signature perforated toe boxes, and sleek orange swooshes. Perfect for a clean, bold look.",
    stock: 24,
    isNewArrival: true,
    isTrending: false,
    isBestSeller: true,
    createdAt: new Date(Date.now() - 1000000).toISOString()
  },
  {
    id: "prod-3",
    name: "Yeezy Boost 350 V2 'Onyx'",
    brand: "Adidas",
    price: 24999,
    sizes: [8, 9, 10, 11],
    colors: ["Onyx Black", "Core White"],
    images: [
      "https://images.unsplash.com/photo-1587563871167-1ee9c271a8e4?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop"
    ],
    description: "The Adidas Yeezy Boost 350 V2 Onyx features a black Primeknit upper with a matching side stripe and translucent Boost midsole, delivering peak comfort and futuristic style.",
    stock: 8,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: true,
    createdAt: new Date(Date.now() - 2000000).toISOString()
  },
  {
    id: "prod-4",
    name: "RS-X Triple Black Luxury",
    brand: "Puma",
    price: 8499,
    sizes: [7, 8, 9, 10],
    colors: ["Triple Black", "Black/Orange Glow"],
    images: [
      "https://images.unsplash.com/photo-1539185441755-769473a23570?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=600&auto=format&fit=crop"
    ],
    description: "Bold design meets urban performance. Pumas premium cushioning technology combined with an aggressive multi-material design. Set yourself apart from the crowd.",
    stock: 15,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    createdAt: new Date(Date.now() - 3000000).toISOString()
  },
  {
    id: "prod-5",
    name: "Dunk Low Retro 'Panda'",
    brand: "Nike",
    price: 11999,
    sizes: [6, 7, 8, 9, 10, 11, 12],
    colors: ["Black/White", "Grey/White"],
    images: [
      "https://images.unsplash.com/photo-1597045566677-8cf032ed6634?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?q=80&w=600&auto=format&fit=crop"
    ],
    description: "The Nike Dunk Low Retro Panda is a modern staple. Featuring simple clean black leather panels over white leather basis. Durable, stylish, and essential.",
    stock: 5,
    isNewArrival: false,
    isTrending: true,
    isBestSeller: true,
    createdAt: new Date(Date.now() - 4000000).toISOString()
  },
  {
    id: "prod-6",
    name: "Travis Scott x Jordan 1 Low 'Reverse Mocha'",
    brand: "Jordan",
    price: 49999,
    sizes: [7, 8, 9, 10, 11],
    colors: ["Reverse Mocha/Sail/Orange"],
    images: [
      "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?q=80&w=600&auto=format&fit=crop"
    ],
    description: "The ultimate sneaker grail. Made in collaboration with Travis Scott, featuring the iconic oversized backward Swoosh, custom Cactus Jack branding, and luxurious mocha overlays.",
    stock: 3,
    isNewArrival: true,
    isTrending: true,
    isBestSeller: false,
    createdAt: new Date(Date.now() - 5000000).toISOString()
  }
];

const INITIAL_REVIEWS = [
  {
    id: "rev-1",
    productId: "prod-1",
    userId: "user-1",
    userName: "Kesav R.",
    rating: 5,
    comment: "This color scheme is absolutely beautiful. The orange pops so well in dark mode, and the leather feels extremely premium. Best purchase of the year!",
    createdAt: new Date(Date.now() - 80000).toISOString()
  },
  {
    id: "rev-2",
    productId: "prod-1",
    userId: "user-2",
    userName: "Dinesh K.",
    rating: 4,
    comment: "Excellent sneaker. The packaging was top-notch, fits exactly true to size. Ordering via WhatsApp was super fast and convenient.",
    createdAt: new Date(Date.now() - 150000).toISOString()
  },
  {
    id: "rev-3",
    productId: "prod-3",
    userId: "user-3",
    userName: "Sarah T.",
    rating: 5,
    comment: "Yeezys never fail to deliver comfort. It feels like walking on clouds. Teens Emporium is legit and reliable.",
    createdAt: new Date(Date.now() - 200000).toISOString()
  }
];

const INITIAL_SITE_SETTINGS = {
  whatsappNumber: "6381695564",
  secondaryWhatsappNumber: "",
  supportEmail: "support@teensemporium.com",
  address: "Chennai, Tamil Nadu, India"
};

export const AppProvider = ({ children }) => {
  const { currentUser } = useAuth();
  
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [siteSettings, setSiteSettings] = useState(INITIAL_SITE_SETTINGS);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Initialize and Sync data
  useEffect(() => {
    // Sync local wishlist from localStorage
    const savedWishlist = JSON.parse(localStorage.getItem("teens_wishlist") || "[]");
    setWishlist(savedWishlist);

    // Sync cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("teens_cart") || "[]");
    setCart(savedCart);

    const savedSiteSettings = localStorage.getItem("teens_site_settings");
    if (savedSiteSettings) {
      setSiteSettings(JSON.parse(savedSiteSettings));
    } else {
      localStorage.setItem("teens_site_settings", JSON.stringify(INITIAL_SITE_SETTINGS));
      setSiteSettings(INITIAL_SITE_SETTINGS);
    }

    if (isMockEnabled) {
      // Setup mock products and reviews in localStorage
      const localProducts = localStorage.getItem("teens_products");
      if (!localProducts || !JSON.parse(localProducts).some(p => p.id === "prod-7") || JSON.parse(localProducts).find(p => p.id === "prod-7").images.includes("/sneaker_views.png")) {
        localStorage.setItem("teens_products", JSON.stringify(INITIAL_PRODUCTS));
        setProducts(INITIAL_PRODUCTS);
      } else {
        setProducts(JSON.parse(localProducts));
      }

      const localReviews = localStorage.getItem("teens_reviews");
      if (!localReviews) {
        localStorage.setItem("teens_reviews", JSON.stringify(INITIAL_REVIEWS));
        setReviews(INITIAL_REVIEWS);
      } else {
        setReviews(JSON.parse(localReviews));
      }
      setLoadingProducts(false);
    } else {
      // Connect to real Firestore
      const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
        const prodList = [];
        snapshot.forEach((doc) => {
          prodList.push({ id: doc.id, ...doc.data() });
        });
        
        // If firestore is empty, let's auto-initialize it with mock products so it is not empty for demo!
        if (prodList.length === 0) {
          console.log("Firestore products empty. Seeding initial products...");
          INITIAL_PRODUCTS.forEach(async (p) => {
            const { id, ...data } = p;
            await setDoc(doc(db, "products", id), data);
          });
          setProducts(INITIAL_PRODUCTS);
        } else {
          setProducts(prodList);
        }
        setLoadingProducts(false);
      });

      const unsubReviews = onSnapshot(collection(db, "reviews"), (snapshot) => {
        const revList = [];
        snapshot.forEach((doc) => {
          revList.push({ id: doc.id, ...doc.data() });
        });
        if (revList.length === 0) {
          INITIAL_REVIEWS.forEach(async (r) => {
            const { id, ...data } = r;
            await setDoc(doc(db, "reviews", id), data);
          });
          setReviews(INITIAL_REVIEWS);
        } else {
          setReviews(revList);
        }
      });

      const settingsDocRef = doc(db, "settings", "site");
      getDoc(settingsDocRef).then((snapshot) => {
        if (snapshot.exists()) {
          const settings = snapshot.data();
          const nextSettings = { ...INITIAL_SITE_SETTINGS, ...settings };
          setSiteSettings(nextSettings);
          localStorage.setItem("teens_site_settings", JSON.stringify(nextSettings));
        }
      }).catch((err) => console.error("Error loading site settings", err));

      return () => {
        unsubProducts();
        unsubReviews();
      };
    }
  }, []);

  // Sync wishlist from Firestore if authenticated and running on Firebase
  useEffect(() => {
    if (!currentUser) return;
    if (isMockEnabled) return;

    const fetchWishlist = async () => {
      try {
        const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", currentUser.uid)));
        if (!userDoc.empty) {
          const userData = userDoc.docs[0].data();
          if (userData.wishlist) {
            setWishlist(userData.wishlist);
            localStorage.setItem("teens_wishlist", JSON.stringify(userData.wishlist));
          }
        }
      } catch (err) {
        console.error("Error fetching user wishlist:", err);
      }
    };
    fetchWishlist();
  }, [currentUser]);

  // Sync cart & wishlist changes to localStorage
  useEffect(() => {
    localStorage.setItem("teens_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem("teens_site_settings", JSON.stringify(siteSettings));
  }, [siteSettings]);

  const updateSiteSettings = async (updatedFields) => {
    const nextSettings = { ...siteSettings, ...updatedFields };
    setSiteSettings(nextSettings);
    localStorage.setItem("teens_site_settings", JSON.stringify(nextSettings));

    if (!isMockEnabled) {
      try {
        await setDoc(doc(db, "settings", "site"), nextSettings, { merge: true });
      } catch (err) {
        console.error("Error updating site settings", err);
        throw err;
      }
    }
  };

  // Product CRUD Operations (Admin)
  const addProduct = async (productData) => {
    const newProduct = {
      ...productData,
      createdAt: new Date().toISOString()
    };

    if (isMockEnabled) {
      const updated = [...products, { id: "prod-" + Date.now(), ...newProduct }];
      setProducts(updated);
      localStorage.setItem("teens_products", JSON.stringify(updated));
    } else {
      await addDoc(collection(db, "products"), newProduct);
    }
  };

  const updateProduct = async (productId, updatedData) => {
    if (isMockEnabled) {
      const updated = products.map(p => p.id === productId ? { ...p, ...updatedData } : p);
      setProducts(updated);
      localStorage.setItem("teens_products", JSON.stringify(updated));
    } else {
      const docRef = doc(db, "products", productId);
      await updateDoc(docRef, updatedData);
    }
  };

  const deleteProduct = async (productId) => {
    if (isMockEnabled) {
      const updated = products.filter(p => p.id !== productId);
      setProducts(updated);
      localStorage.setItem("teens_products", JSON.stringify(updated));
    } else {
      const docRef = doc(db, "products", productId);
      await deleteDoc(docRef);
    }
  };

  // Review CRUD Operations
  const addReview = async (reviewData) => {
    const newReview = {
      ...reviewData,
      createdAt: new Date().toISOString()
    };

    if (isMockEnabled) {
      const updated = [{ id: "rev-" + Date.now(), ...newReview }, ...reviews];
      setReviews(updated);
      localStorage.setItem("teens_reviews", JSON.stringify(updated));
    } else {
      await addDoc(collection(db, "reviews"), newReview);
    }
  };

  const deleteReview = async (reviewId) => {
    if (isMockEnabled) {
      const updated = reviews.filter(r => r.id !== reviewId);
      setReviews(updated);
      localStorage.setItem("teens_reviews", JSON.stringify(updated));
    } else {
      await deleteDoc(doc(db, "reviews", reviewId));
    }
  };

  // Wishlist actions
  const toggleWishlist = async (productId) => {
    let updatedWishlist = [];
    const isSaved = wishlist.includes(productId);

    if (isSaved) {
      updatedWishlist = wishlist.filter(id => id !== productId);
    } else {
      updatedWishlist = [...wishlist, productId];
    }

    setWishlist(updatedWishlist);
    localStorage.setItem("teens_wishlist", JSON.stringify(updatedWishlist));

    if (currentUser && !isMockEnabled) {
      try {
        const userDocRef = doc(db, "users", currentUser.uid);
        await updateDoc(userDocRef, {
          wishlist: isSaved ? arrayRemove(productId) : arrayUnion(productId)
        });
      } catch (err) {
        console.error("Error updating firestore wishlist:", err);
      }
    }
  };

  // Cart actions
  const addToCart = (product, selectedSize, selectedColor, quantity = 1) => {
    const existingIndex = cart.findIndex(
      item => item.id === product.id && item.size === selectedSize && item.color === selectedColor
    );

    if (existingIndex > -1) {
      const updatedCart = [...cart];
      updatedCart[existingIndex].quantity += quantity;
      setCart(updatedCart);
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        image: product.images[0],
        size: selectedSize,
        color: selectedColor,
        quantity
      }]);
    }
  };

  const removeFromCart = (id, size, color) => {
    const updatedCart = cart.filter(
      item => !(item.id === id && item.size === size && item.color === color)
    );
    setCart(updatedCart);
  };

  const updateCartQuantity = (id, size, color, newQuantity) => {
    if (newQuantity < 1) return;
    const updatedCart = cart.map(
      item => (item.id === id && item.size === size && item.color === color) 
        ? { ...item, quantity: newQuantity } 
        : item
    );
    setCart(updatedCart);
  };

  const clearCart = () => {
    setCart([]);
  };

  // Fetch product ratings helpers
  const getProductRating = (productId) => {
    const prodReviews = reviews.filter(r => r.productId === productId);
    if (prodReviews.length === 0) return { avg: 0, count: 0 };
    const total = prodReviews.reduce((sum, r) => sum + r.rating, 0);
    return {
      avg: parseFloat((total / prodReviews.length).toFixed(1)),
      count: prodReviews.length
    };
  };

  const value = {
    products,
    reviews,
    wishlist,
    cart,
    siteSettings,
    loadingProducts,
    addProduct,
    updateProduct,
    deleteProduct,
    addReview,
    deleteReview,
    toggleWishlist,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    updateSiteSettings,
    getProductRating
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
