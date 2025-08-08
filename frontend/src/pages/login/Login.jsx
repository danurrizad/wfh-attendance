import React from 'react'
import Input from '../../components/forms/Input'
import { useState } from 'react'
import useAuthService from '../../services/AuthService'
import { useNavigate } from "react-router"
import Button from '../../components/forms/Button'

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: ""
  })
  const [errors, setErrors] = useState({
    username: "",
    password: ""
  })

  const { login } = useAuthService()
  const navigate = useNavigate()

  const isFormValid = () => {
    const errorForms = {}

    // Check if any form doesn't filled
    if(form.username === ""){
      errorForms.username = "Username can't be empty!"
    }
    if(form.password === ""){
      errorForms.password = "Password can't be empty!"
    }
    
    // If there are errors, return false
    if (Object.keys(errorForms).length > 0) {
      setErrors(errorForms)
      return false;
    }else{
      setErrors({
        username: "",
        password: ""
      })
      return true;
    }
  }

  const handleLogin = async() => {
    try {
      // If there are errors in form
      const isValid = isFormValid() 
      if(!isValid){
        return
      }

      // Login auth
      const response = await login(form)
      const data = response?.data
      
      // Set token into localStorage
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)

      // Navigate to home page
      navigate("/home")
    } catch (error) {
      console.error(error)
    }
  }

  const handleChangeInput = (e) => {
    const { name, value } = e.target
    setErrors({ ...errors, [name]: ""})
    setForm({ ...form, [name]: value})
  }

  const handleEnter = (e) => {
    const key = e.key
    if(key === "Enter"){
      handleLogin()
    }
  }

  return (
    <div className='bg-slate-200 min-h-dvh flex items-center justify-center'>
      <div className='bg-white w-[400px] h-[450px] p-10 shadow shadow-gray-400'>
        <h3 className='text-sm font-semibold text-center'>Welcome to </h3>
        <h3 className='text-2xl font-bold text-center'>HR Attendance System</h3>
        <h1 className='text-md font-semibold text-center'>Login</h1>

        <div className='mt-10'>
          <label>Username</label>
          <Input
            value={form.username}
            name='username'
            onChange={handleChangeInput}
            onKeyDown={handleEnter}
            error={errors.username !== ""}
            hint={errors.username}
          />
        </div>
        <div className='mt-4'>
          <label>Password</label>
          <Input
            value={form.password}
            name='password'
            onChange={handleChangeInput}
            onKeyDown={handleEnter}
            error={errors.password !== ""}
            hint={errors.password}
          />
        </div>
        
        <div className='mt-4'>
          <Button variant="blue" className='w-full' onClick={handleLogin} >Login</Button>
        </div>

      </div>
    </div>
  )
}

export default Login