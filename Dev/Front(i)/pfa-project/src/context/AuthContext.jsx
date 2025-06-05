import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null); // ✅ NEW: State to hold the token
  const [loading, setLoading] = useState(true); // ✅ NEW: Loading state

  //  UPDATED: Check localStorage for both user and token on load
  useEffect(() => {
    console.log('AuthContext: Initializing...');
    const storedAuthData = localStorage.getItem("authData");
    console.log('AuthContext: Stored auth data:', storedAuthData);

    try {
      if (storedAuthData && storedAuthData !== "undefined") {
        const parsed = JSON.parse(storedAuthData);
        console.log('AuthContext: Parsed auth data:', parsed);
        if (parsed.user && parsed.token) {
          console.log('AuthContext: Setting user and token from localStorage');
          setUser(parsed.user);
          setToken(parsed.token);
          setIsAuthenticated(true);
          console.log('AuthContext: Authentication state set to:', {
            isAuthenticated: true,
            user: parsed.user,
            token: parsed.token
          });
        }
      }
    } catch (error) {
      console.error("AuthContext: Invalid JSON in localStorage 'authData':", error);
      localStorage.removeItem("authData");
    } finally {
      setLoading(false);
      console.log('AuthContext: Initialization complete, loading set to false');
    }
  }, []);

  //  UPDATED: Accept both user and token in login
  const login = ({ user, token }) => {
    console.log("AuthContext: Login attempt with:", { user, token });
    if (!user || !token) {
      console.log('AuthContext: Login failed - missing user or token');
      return;
    }
    const authData = { user, token };
    localStorage.setItem("authData", JSON.stringify(authData));
    console.log('AuthContext: Stored auth data in localStorage');
    setUser(user);
    setToken(token);
    setIsAuthenticated(true);
    console.log('AuthContext: Login successful, state updated:', {
      isAuthenticated: true,
      user,
      token
    });
  };

  const logout = () => {
    localStorage.removeItem("authData"); // ✅ UPDATED KEY
    setUser(null);
    setToken(null); // ✅ NEW
    setIsAuthenticated(false);
  };

  // UPDATED: Expose loading state
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
