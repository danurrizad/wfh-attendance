import React from 'react'
import useAuthService from '../../services/AuthService'
import { useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from "@fortawesome/free-solid-svg-icons"

const Header = () => {
  const { logout } = useAuthService()
  const navigate = useNavigate()

  const handleLogout = async() => {
    try {
      await logout()
      localStorage.setItem("accessToken", "")
      localStorage.setItem("refreshToken", "")
      navigate("/login")
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div className='w-screen fixed top-0 z-0 flex justify-between items-center p-4 bg-white h-[100px] border-b-1 border-gray-300'>
      <div className='ml-[200px]'>
        <button className='cursor-pointer'><FontAwesomeIcon icon={faBars} /></button>
      </div>
      <div>
        <button onClick={handleLogout} className='bg-red-400 px-10 py-1 rounded-md text-white hover:bg-red-600'>Logout</button>
      </div>
    </div>
  )
}

export default Header