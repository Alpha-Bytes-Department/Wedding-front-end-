import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
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
  isAuthenticated: boolean;
  login: (userData: AuthResponse) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  const isAuthenticated = !!user;

  const login = (userData: AuthResponse) => {
    setUser(userData.user);
    localStorage.setItem("user", JSON.stringify(userData.user));
    localStorage.setItem("accessToken", userData.accessToken);
    localStorage.setItem("refreshToken", userData.refreshToken);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated,
    login,
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
