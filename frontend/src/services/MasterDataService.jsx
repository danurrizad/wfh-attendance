import { useToast } from "../context/ToastifyContext";
import useVerify from "../hooks/useVerify";

const useMasterDataService = () => {
    const { showSuccess, showError } = useToast();
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

    const getMasterData = async(api, page, limit, q) => {
        try {
            const response = await axiosJWT.get(`${api}?page=${page}&limit=${limit}&q=${q}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            handleError(error)
        }
    }

    const getMasterDataById = async(api, id) => {
        try {
            const response = await axiosJWT.get(`${api}/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return response
        } catch (error) {
            handleError(error)
        }
    }

    const createMasterData = async(api, body) => {
        try {
            const response = await axiosJWT.post(api, body, {
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

    const updateMasterDataById = async(api, id, body) => {
        try {
            const response = await axiosJWT.put(`${api}/${id}`, body, {
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

    const deleteMasterDataById = async(api, id) => {
        try {
            const response = await axiosJWT.delete(`${api}/${id}`, {
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
        getMasterData,
        getMasterDataById,
        createMasterData,
        updateMasterDataById,
        deleteMasterDataById
    }
}

export default useMasterDataService