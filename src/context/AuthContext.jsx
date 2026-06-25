import React, { createContext, useContext, useState, useEffect } from "react";
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile
} from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { auth, db, googleProvider, isMockEnabled } from "../firebase/config";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  // MOCK Auth implementation
  const mockLogin = async (email, password) => {
    // Demo account check
    if (email === "admin@teensemporium.com" && password === "admin123") {
      const adminUser = { uid: "admin-uid", email, displayName: "Teens Admin", isMock: true };
      localStorage.setItem("teens_mock_user", JSON.stringify(adminUser));
      setCurrentUser(adminUser);
      setIsAdmin(true);
      return adminUser;
    }

    const mockUsers = JSON.parse(localStorage.getItem("teens_mock_users") || "[]");
    const user = mockUsers.find(u => u.email === email && u.password === password);
    if (!user) throw new Error("Invalid email or password.");
    
    const loggedUser = { uid: user.uid, email: user.email, displayName: user.name, isMock: true };
    localStorage.setItem("teens_mock_user", JSON.stringify(loggedUser));
    setCurrentUser(loggedUser);
    setIsAdmin(false);
    return loggedUser;
  };

  const mockSignup = async (name, email, password) => {
    const mockUsers = JSON.parse(localStorage.getItem("teens_mock_users") || "[]");
    if (mockUsers.some(u => u.email === email)) throw new Error("Email already in use.");
    
    const newUser = { uid: "user-" + Date.now(), name, email, password };
    mockUsers.push(newUser);
    localStorage.setItem("teens_mock_users", JSON.stringify(mockUsers));
    
    const loggedUser = { uid: newUser.uid, email: newUser.email, displayName: newUser.name, isMock: true };
    localStorage.setItem("teens_mock_user", JSON.stringify(loggedUser));
    setCurrentUser(loggedUser);
    setIsAdmin(false);
    return loggedUser;
  };

  const mockGoogleLogin = async () => {
    const googleUser = { uid: "google-" + Date.now(), email: "googleuser@gmail.com", displayName: "Google Guest User", isMock: true };
    localStorage.setItem("teens_mock_user", JSON.stringify(googleUser));
    setCurrentUser(googleUser);
    setIsAdmin(false);
    return googleUser;
  };

  const mockLogout = async () => {
    localStorage.removeItem("teens_mock_user");
    setCurrentUser(null);
    setIsAdmin(false);
  };

  const mockResetPassword = async (email) => {
    console.log(`Mock: Password reset email sent to ${email}`);
  };

  const mockUpdateProfile = async (displayName) => {
    if (currentUser) {
      const updated = { ...currentUser, displayName };
      localStorage.setItem("teens_mock_user", JSON.stringify(updated));
      setCurrentUser(updated);
    }
  };

  // Main login/signup actions redirecting to either real Firebase or Mock
  const login = (email, password) => {
    if (isMockEnabled) return mockLogin(email, password);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signup = async (name, email, password) => {
    if (isMockEnabled) return mockSignup(name, email, password);
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: name });
    // Write user profile to Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      uid: userCredential.user.uid,
      name,
      email,
      wishlist: [],
      createdAt: new Date().toISOString()
    });
    return userCredential.user;
  };

  const googleLogin = async () => {
    if (isMockEnabled) return mockGoogleLogin();
    const userCredential = await signInWithPopup(auth, googleProvider);
    const user = userCredential.user;
    
    // Check if user document already exists, if not write it
    const userDocRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userDocRef);
    if (!userDoc.exists()) {
      await setDoc(userDocRef, {
        uid: user.uid,
        name: user.displayName || "Google User",
        email: user.email,
        wishlist: [],
        createdAt: new Date().toISOString()
      });
    }
    return user;
  };

  const logout = () => {
    if (isMockEnabled) return mockLogout();
    return signOut(auth);
  };

  const resetPassword = (email) => {
    if (isMockEnabled) return mockResetPassword(email);
    return sendPasswordResetEmail(auth, email);
  };

  const updateDisplayName = async (name) => {
    if (isMockEnabled) return mockUpdateProfile(name);
    await updateProfile(auth.currentUser, { displayName: name });
    setCurrentUser({ ...auth.currentUser });
    // Update firestore too
    await setDoc(doc(db, "users", auth.currentUser.uid), { name }, { merge: true });
  };

  // Hooking up state observers
  useEffect(() => {
    if (isMockEnabled) {
      const storedUser = localStorage.getItem("teens_mock_user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        setCurrentUser(parsedUser);
        if (parsedUser.email === "admin@teensemporium.com") {
          setIsAdmin(true);
        }
      }
      setLoading(false);
    } else {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          setCurrentUser(user);
          // Check Admin status
          if (user.email === "admin@teensemporium.com") {
            setIsAdmin(true);
          } else {
            // Check in db admins collection
            try {
              const adminDoc = await getDoc(doc(db, "admins", user.uid));
              setIsAdmin(adminDoc.exists());
            } catch (err) {
              console.error("Error reading admin status:", err);
              setIsAdmin(false);
            }
          }
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
        setLoading(false);
      });
      return unsubscribe;
    }
  }, []);

  const value = {
    currentUser,
    isAdmin,
    login,
    signup,
    googleLogin,
    logout,
    resetPassword,
    updateDisplayName,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
