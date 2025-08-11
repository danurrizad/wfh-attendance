import { useState, useEffect, useContext, createContext } from "react";
import { jwtDecode } from 'jwt-decode'

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    userId: null,
    name: "",
    username: "",
    email: "",
    roleId: null,
    roleName: ""
  })
  const [accessToken, setAccessToken] = useState(localStorage.getItem("accessToken") || null);
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem("refreshToken") || null);

  // Modal logout confirmation
  const [showModalLogout, setShowModalLogout] = useState(false)

  const setAuthStates = () => {
    const storedToken = localStorage.getItem('accessToken')
    if (storedToken) {
        try {
            const decoded = jwtDecode(storedToken)
            if (decoded.exp * 12000 > Date.now()) {
                setAuth({
                    ...auth,
                    userId: decoded.userId,
                    name: decoded.name,
                    username: decoded.username,
                    email: decoded.email,
                    roleId: decoded.role_id,
                    roleName: decoded.rolename,

                })
            } else {
                // Token expired
                localStorage.removeItem('accessToken')
                localStorage.removeItem('refreshToken')
              }
      } catch (err) {
        console.error('Invalid token in localStorage:', err)
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    }
  }

  // Load tokens from localStorage on initial load
  useEffect(() => {
    setAuthStates()
  }, []);

  const setTokenAndDecode = (accessToken) => {
    const decoded= jwtDecode(accessToken) 
    setAuth({
      ...auth,
      userId: decoded.userId,
      name: decoded.name,
      username: decoded.username,
      email: decoded.email,
      roleId: decoded.role_id,
      roleName: decoded.rolename,
    })
    localStorage.setItem('accessToken', accessToken)
  }

  // Tambahkan logout opsional
  const clearAuth = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    setAuth({
      userId: null,
      name: "",
      username: "",
      email: "",
      roleId: null,
      roleName: ""
    })
  }

  const value = {
    auth,
    accessToken,
    setAccessToken,
    refreshToken,
    setRefreshToken,
    setTokenAndDecode,
    clearAuth,
    showModalLogout,
    setShowModalLogout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
