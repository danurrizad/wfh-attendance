import { useToast } from "../context/ToastifyContext"
import useVerify from "../hooks/useVerify.jsx"

const useAttendanceDataService = () => {
    const { showError, showSuccess } = useToast() 
    const { axiosJWT, auth } = useVerify()
    const token = auth.accessToken

    // Handle all errors
    const handleError = (error) => {
        if(error?.response){
            showError(error?.response?.data?.message)
        }else{
            showError(error?.message)
        }
        throw error
    }

    const getAttendances = async() => {
        try {
            const response = await axiosJWT.get("/attendances", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            handleError(error)
        }
    }

    const createAttendance = async(body) => {
        try {
            const response = await axiosJWT.post("/attendance", body, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            showSuccess(response?.data?.message)
            return response
        } catch (error) {
            handleError(error)
        }
    }

    return{
        getAttendances,
        createAttendance
    }
}

export default useAttendanceDataService