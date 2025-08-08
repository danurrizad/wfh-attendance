import React, { useEffect } from 'react'
import Header from '../../components/UI/Header'
import Sidebar from '../../components/UI/Sidebar'
import useVerify from '../../hooks/useVerify'
import { useNavigate } from 'react-router'

const Home = () => {
  const { auth } = useVerify()
  const navigate = useNavigate()

  // useEffect(()=>{
  //   console.log("Name: ", auth)
  //   if(auth.name === ""){
  //     navigate("/login")
  //   }
  // }, [])
  return (
    <div className='min-h-dvh flex justify-center items-center '>
      <div className=''>
        <h1>HOME MASTER</h1>
        <h2>Welcome, {auth.name}</h2>
      </div>
    </div>
  )
}

export default Home