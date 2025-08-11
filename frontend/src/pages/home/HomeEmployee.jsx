import React, { useEffect, useState } from 'react'
import Button from '../../components/forms/Button'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowRightFromBracket, faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons'
import useVerify from '../../hooks/useVerify'
import { Modal } from '../../components/ui/modal/Modal'
import { Card, CardContent, CardHeader } from '../../components/ui/card/Card'
import Webcam from "../../components/face-capture/FaceCapture"
import useAttendanceDataService from '../../services/AttendanceDataService'
import { Table, TableBody, TableCell, TableRow } from '../../components/ui/table/Table'
import { useNavigate } from 'react-router'
import useAuthService from '../../services/AuthService'

const HomeEmployee = () => {
    const { createAttendanceClockIn, createAttendanceClockOut, checkStatusToday } = useAttendanceDataService()
    const { auth, clearAuth } = useVerify()
    const [dataStatus, setDataStatus] = useState([])
    const [imageFile, setImageFile] = useState(null)
    const [showModalLogout, setShowModalLogout] = useState(false)
    const [showModal, setShowModal] = useState({
        type: "clockIn",
        clockIn: false,
        clockOut: false
    })

    const { logout } = useAuthService()
    const navigate = useNavigate()

    const handleLogout = async() => {
        try {
        await logout()
        clearAuth()
        navigate("/login")
        setShowModalLogout(false)
        } catch (error) {
        console.error(error)
        }
    }

    const renderModalLogout = () => {
      return(
        <Modal
          isOpen={showModalLogout}
          onClose={()=>setShowModalLogout(false)}
        >
          <Card>
            <div className='p-4 relative'>
              <h1>Are you sure want to logout from your account?</h1>
              <div className='flex items-center gap-4 justify-end mt-4'>
                <Button variant='outline' onClick={()=>setShowModalLogout(false)}>Cancel</Button>
                <Button variant='primary' onClick={handleLogout}>Logout</Button>
              </div>
            </div>
          </Card>
        </Modal>
      )
    }

    const fetchStatusToday = async() => {
        try {
            const response = await checkStatusToday(auth?.userId)
            setDataStatus(response?.data?.data)
        } catch (error) {
            console.error(error)
        }
    }


    useEffect(()=>{
        if(auth.userId !== null){
            fetchStatusToday()
        }else{
            window.location.href = "/login"
        }
    }, [auth])

    const handleOpenModal = (type) => {
        setShowModal({
            ...showModal,
            type: type,
            [type]: true
        })
    }

    const handleCloseModal = (type) => {
        setImageFile(null)
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
            if(showModal.type === "clockIn"){
                await createAttendanceClockIn(formData)
            }else if(showModal.type === "clockOut"){
                await createAttendanceClockOut(formData)
            }
            fetchStatusToday()
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
        {/* Render Modals */}
        {renderModal(showModal.type)}
        {renderModalLogout()}

        <h1 className='text-3xl font-bold'>WFH Attendance System</h1>
        <h3 className='text-md font-semibold'>Welcome to your Work-From-Home attendance system</h3>

        <Card className='mt-10'>
            <CardContent className='w-[400px]'>
                <div className='flex flex-col'>
                    <h1 className='font-bold'>Attendance</h1>
                    <Table className="shadow-none">
                        <TableBody>
                            <TableRow>
                                <TableCell className="border-none">Name</TableCell>
                                <TableCell className="border-none">:</TableCell>
                                <TableCell className="border-none">{auth.name}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="border-none">Email</TableCell>
                                <TableCell className="border-none">:</TableCell>
                                <TableCell className="border-none">{auth.email}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="border-none">Status</TableCell>
                                <TableCell className="border-none">:</TableCell>
                                <TableCell className="border-none">
                                    <p className={`${
                                        dataStatus.status === "NOT CLOCKED IN" 
                                            ?  "bg-red-200 text-red-700" 
                                            : dataStatus.status === "CLOCKED IN"
                                                ? "bg-green-200 text-green-700"
                                                : "bg-yellow-200 text-yellow-700"
                                        } rounded-full px-4 py-1 font-semibold text-center`}>
                                        {dataStatus.status}
                                    </p>
                                </TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="border-none">Clock In Time</TableCell>
                                <TableCell className="border-none">:</TableCell>
                                <TableCell className="border-none">{dataStatus.clockInDate}</TableCell>
                            </TableRow>
                            <TableRow>
                                <TableCell className="border-none">Clock Out Time</TableCell>
                                <TableCell className="border-none">:</TableCell>
                                <TableCell className="border-none">{dataStatus.clockOutDate}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                </div>
                <div className='mt-4 w-full'>
                    <Button disabled={dataStatus.status === "CLOCKED IN" || dataStatus.status === "CLOCKED OUT"} onClick={()=>handleOpenModal('clockIn')} variant='blue' className='w-full flex justify-center'>
                        <FontAwesomeIcon icon={faArrowRightToBracket}/>
                        <p>Clock In</p>
                    </Button>
                </div>
                <div className='mt-4 w-full'>
                    <Button disabled={dataStatus.status === "CLOCKED OUT"} onClick={()=>handleOpenModal('clockOut')} variant='yellow' className='w-full flex justify-center'>
                        <FontAwesomeIcon icon={faArrowRightFromBracket}/>
                        <p>Clock Out</p>
                    </Button>
                </div>
                <div className='mt-4 w-full'>
                    <Button variant='red' onClick={()=>setShowModalLogout(true)} className='w-full flex justify-center'>
                        <FontAwesomeIcon icon={faArrowRightToBracket}/>
                        <p>Logout from Account</p>
                    </Button>
                </div>
            </CardContent>
        </Card>
    </div>
  )
}

export default HomeEmployee