import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastifyContext";
import axiosInstance from "../utils/AxiosInstance";

const useVerify = () => {
  const { showError } = useToast()
  const { auth, setTokenAndDecode } = useAuth()
  const navigate = useNavigate()

  const axiosJWT = axiosInstance.create()

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
      
      // Check if the error is due to an expired access token and a refresh token exists
      if (error.response.status === 403 && !originalRequest._retry && refreshToken) {
        originalRequest._retry = true; // Prevents infinite loops
        try {
          // Call the backend to get a new access token
          const res = await axiosInstance.post('/token', { refreshToken: refreshToken });
          
          // If successful, save the new access token and retry the original request
          localStorage.setItem('accessToken', res.data.accessToken);
          originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // If refresh token fails, clear all tokens and force a re-login
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          showError("Refresh token failed!")
          // Redirect to the login page here
          navigate("/login")
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    }
  );

  return{
    auth,
    axiosJWT
  }
}

export default useVerify

