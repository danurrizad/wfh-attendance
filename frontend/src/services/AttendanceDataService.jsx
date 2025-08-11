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

    const getAttendances = async(page, limit, q, startDate, endDate) => {
        try {
            const response = await axiosJWT.get(`/attendances?page=${page}&limit=${limit}&q=${q}&startDate=${startDate}&endDate=${endDate}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            handleError(error)
        }
    }

    const createAttendanceClockIn = async(body) => {
        try {
            const response = await axiosJWT.post("/attendance-clockin", body, {
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

    const createAttendanceClockOut = async(body) => {
        try {
            const response = await axiosJWT.post("/attendance-clockout", body, {
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

    const checkStatusToday = async(userId) => {
        try {
            const response = await axiosJWT.get(`/attendance-status/${userId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            handleError(error)
        }
    }

    return{
        getAttendances,
        createAttendanceClockIn,
        createAttendanceClockOut,
        checkStatusToday
    }
}

export default useAttendanceDataService