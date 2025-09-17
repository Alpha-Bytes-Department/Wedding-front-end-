import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import {
  signInWithPopup,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { auth, googleProvider, facebookProvider } from "./../Firebase/firebase.config";
import axios from "axios";

interface User {
  _id: string;
  bookingMoney: number;
  bookingPackage: any[];
  createdAt: string;
  email: string;
  isVerified: boolean;
  languages: string[];
  location: string;
  partner_1: string;
  partner_2: string;
  profilePicture: string;
  refreshToken: string;
  role: string;
  updatedAt: string;
  weddingDate: string;
  __v: number;
}

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

interface AuthContextType {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: AuthResponse) => void;
  loginWithGoogle: () => Promise<void>;
  loginWithFacebook: () => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [loading, setLoading] = useState(true);
  
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  const login = (userData: AuthResponse) => {
    setUser(userData.user);
    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("accessToken", userData.accessToken);
    localStorage.setItem("refreshToken", userData.refreshToken);
    window.location.href = "/"; // Redirect to home page after login
  };

  const loginWithProvider = async (provider: any) => {
    try {
      const result: UserCredential = await signInWithPopup(auth, provider);
      console.log("Firebase user:", result.user);
      const token = await result.user.getIdToken(); // Firebase ID token
      const email = result.user.email;
      const partner_1 = " "; // Get partner_1 from your app's state or user input
      const partner_2 = result.user.displayName; // Get partner_2 from your app's state or user input
      const profilePicture = result.user.photoURL;

      // send token/email to your backend to register/login & get your own tokens
      const response = await axios.post("http://localhost:5000/api/users/social-login", {
        email,
        firebaseToken: token,
        partner_1,
        partner_2,
        profilePicture,
      });
      console.log("Backend response:", response.data);
      login(response.data); // backend should respond with AuthResponse
    } catch (error) {
      console.error("Social login error:", error);
    }
  };

  const loginWithGoogle = () => loginWithProvider(googleProvider);
  const loginWithFacebook = () => loginWithProvider(facebookProvider);

  const logout = () => {
    
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    signOut(auth);
    window.location.href = "/login"; // Redirect to login page after logout
  };

  useEffect(() => {
    setLoading(true);
    const storedUser = localStorage.getItem("user");
 
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const value: AuthContextType = {
    user,
    setUser,
    isAuthenticated,
    loading,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
