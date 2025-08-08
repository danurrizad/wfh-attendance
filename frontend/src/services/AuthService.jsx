import { useToast } from "../context/ToastifyContext";
import axiosInstance from "../utils/AxiosInstance"

const useAuthService = () => {
    const { showSuccess, showError } = useToast();

    // Handle all errors
    const handleError = (error) => {
        if(error?.response){
            showError(error?.response?.data?.message)
        }else{
            showError(error?.message)
        }
        throw error
    }

    const login = async(body) => {
        try {
            const response = await axiosInstance.post("login", body)
            showSuccess(response?.data?.message)
            return response
        } catch (error) {
            handleError(error)
        }
    }

    const logout = async() => {
        try {
            const response = await axiosInstance.get("logout")
            showSuccess(response?.data?.message)
            return response
        } catch (error) {
            handleError(error)
        }
    }

    return{
        login,
        logout
    }
}

export default useAuthService