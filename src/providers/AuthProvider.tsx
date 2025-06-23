import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { AuthContextType, User, AuthProviderProps } from "../types/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  const showAuth = useCallback((mode: "signin" | "signup") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  }, []);

  const hideAuth = useCallback(() => {
    setShowAuthModal(false);
  }, []);

  const signin = useCallback(
    async (email: string, password: string): Promise<void> => {
      try {
        // Mock authentication - replace with actual API call
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          name: email.split("@")[0],
          email_verified: true,
        };

        setUser(mockUser);
        setIsAuthenticated(true);
        setShowAuthModal(false);

        // Store user in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem("isAuthenticated", "true");
      } catch (error) {
        console.error("Signin error:", error);
        throw new Error("Failed to sign in");
      }
    },
    [],
  );

  const signup = useCallback(
    async (email: string, password: string, name: string): Promise<void> => {
      try {
        // Mock registration - replace with actual API call
        const mockUser: User = {
          id: Date.now().toString(),
          email,
          name,
          email_verified: false,
        };

        setUser(mockUser);
        setIsAuthenticated(true);
        setShowAuthModal(false);

        // Store user in localStorage for persistence
        localStorage.setItem("user", JSON.stringify(mockUser));
        localStorage.setItem("isAuthenticated", "true");
      } catch (error) {
        console.error("Signup error:", error);
        throw new Error("Failed to sign up");
      }
    },
    [],
  );

  const signout = useCallback(() => {
    setUser(null);
    setIsAuthenticated(false);
    setShowAuthModal(false);

    // Clear localStorage
    localStorage.removeItem("user");
    localStorage.removeItem("isAuthenticated");
  }, []);

  // Initialize authentication state from localStorage on mount
  React.useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedAuth = localStorage.getItem("isAuthenticated");

    if (storedUser && storedAuth === "true") {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Error parsing stored user data:", error);
        // Clear invalid data
        localStorage.removeItem("user");
        localStorage.removeItem("isAuthenticated");
      }
    }
  }, []);

  const contextValue: AuthContextType = {
    isAuthenticated,
    user,
    authMode,
    showAuthModal,
    showAuth,
    hideAuth,
    signin,
    signup,
    signout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export default AuthProvider;
