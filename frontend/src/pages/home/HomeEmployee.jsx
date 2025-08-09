import React, { useState } from 'react'
import Button from '../../components/forms/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import useAuthService from '../../services/AuthService'
import useVerify from '../../hooks/useVerify'
import { useNavigate } from 'react-router'
import { Modal } from '../../components/ui/modal/Modal'
import { Card, CardContent, CardHeader } from '../../components/ui/card/Card'
import Webcam from "../../components/face-capture/FaceCapture"
import useAttendanceDataService from '../../services/AttendanceDataService'

const HomeEmployee = () => {
    const { logout } = useAuthService()
    const { createAttendance } = useAttendanceDataService()
    const { auth, clearAuth } = useVerify()
    const [imageFile, setImageFile] = useState(null)
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState({
        type: "clockIn",
        clockIn: false,
        clockOut: false
    })
    console.log("CURRENT USER ID LOGGED IN: ", auth.userId)

    const handleLogout = async() => {
        try {
            await logout()
            localStorage.setItem("accessToken", "")
            localStorage.setItem("refreshToken", "")
            clearAuth()
            navigate("/login")
        } catch (error) {
            console.error(error)
        }
    }

    const handleOpenModal = (type) => {
        setShowModal({
            ...showModal,
            type: type,
            [type]: true
        })
    }

    const handleCloseModal = (type) => {
        setShowModal({
            ...showModal,
            [type]: false
        })
    }

    const handleSubmit = async() => {
        try {
            const blob = await fetch(imageFile).then(res => res.blob());
            const formData = new FormData()
            formData.append("userId", auth.userId)
            formData.append("imageFile", blob)
            await createAttendance(formData)
            handleCloseModal(showModal.type)
            setImageFile(null)
        } catch (error) {
            console.error(error)
        }
    }

    const renderModal = (type) => {
        return(
            <Modal
                isOpen={showModal?.[type]}
                onClose={()=>handleCloseModal(type)}
            >
                <Card>
                    <CardHeader>{type === "clockIn" ? "Clock In" : "Clock Out"}</CardHeader>
                    <CardContent>
                        <Webcam imageFile={imageFile} setImageFile={setImageFile} handleSubmit={handleSubmit}/>
                    </CardContent>
                </Card>
            </Modal>
        )
    }

  return (
    <div className='min-h-dvh flex flex-col items-center justify-center'>
        {/* Render Modal */}
        {renderModal(showModal.type)}

        <h1 className='text-3xl font-bold'>WFH Attendance System</h1>
        <h3 className='text-md font-semibold'>Welcome to your Work-From-Home attendance system</h3>

        <div className='mt-4 w-[200px]'>
            <Button onClick={()=>handleOpenModal('clockIn')} variant='blue' className='w-full flex justify-start'>
                <FontAwesomeIcon icon={faArrowRightToBracket}/>
                <p>Clock In</p>
            </Button>
        </div>
        <div className='mt-4 w-[200px]'>
            <Button onClick={()=>handleOpenModal('clockOut')} variant='yellow' className='w-full flex justify-start'>
                <FontAwesomeIcon icon={faArrowRightFromBracket}/>
                <p>Clock Out</p>
            </Button>
        </div>
        <div className='mt-4 w-[200px]'>
            <Button variant='red' onClick={handleLogout} className='w-full flex justify-start'>
                <FontAwesomeIcon icon={faArrowRightToBracket}/>
                <p>Logout from Account</p>
            </Button>
        </div>
    </div>
  )
}

export default HomeEmployee