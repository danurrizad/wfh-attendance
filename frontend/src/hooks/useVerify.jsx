import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastifyContext";
import axiosInstance from "../utils/AxiosInstance";

const useVerify = () => {
  const { showError } = useToast()
  const { auth, setTokenAndDecode, clearAuth } = useAuth()
  const navigate = useNavigate()

  const axiosJWT = axiosInstance.create()

  // Request interceptor to handle token expiration and refresh
  axiosJWT.interceptors.request.use(
    (config) => {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if (accessToken) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
      }
      else{
        try {
          const response = axiosInstance.post('/token', { refreshToken: refreshToken})
          setTokenAndDecode(response?.data?.accessToken)
        } catch (error) {
          console.error(error)
          clearAuth()
          showError("Error refreshing token")
          navigate("/login")
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor to handle token expiration and refresh
  axiosJWT.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Check error status
      if (error.response.status === 403 && !originalRequest._retry && refreshToken) {
        originalRequest._retry = true; 
        try {
          const res = await axiosInstance.post('/token', { refreshToken: refreshToken });
          localStorage.setItem('accessToken', res.data.accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // localStorage.removeItem('accessToken');
          // localStorage.removeItem('refreshToken');
          clearAuth()
          showError("Refresh token failed!")

          // Redirect to the login 
          navigate("/login")
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return{
    auth,
    axiosJWT,
    clearAuth
  }
}

export default useVerify

