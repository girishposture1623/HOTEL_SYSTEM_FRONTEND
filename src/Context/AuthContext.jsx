import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../apis/api.js";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const getCurrentUser = async () => {
    try {
      const response = await api.get("/auth/me");

 

      if (response.data.success) {
        setUser(response.data.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log(
        "Get current user error:",
        error.response?.data || error.message
      );

      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getCurrentUser();
  }, []);

  const logout = async () => {
    try {
      const response = await api.post("/auth/logout");

     

      setUser(null);

    } catch (error) {
      console.log(
        "Logout error:",
        error.response?.data || error.message
      );
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        loading,
        logout,
        getCurrentUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};