import { createContext, useState, useContext } from 'react';
import authService from '../services/authService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const registerUser = async (name, email, password, role, staffEmail) => {
    const data = await authService.register(
      name,
      email,
      password,
      role,
      staffEmail
    );

    setUser(data.user);
    return data;
  };

  const login = async (email, password) => {
    const data = await authService.login(email, password);

    setUser(data.user);
    return data;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  // 🔥 ADD THIS
  const isAuthenticated = !!user;

  // 🔥 ADD loading (simple)
  const loading = false;

  return (
    <AuthContext.Provider value={{
      user,
      register: registerUser,
      login,
      logout,
      isAuthenticated,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);