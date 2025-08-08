import React from 'react'
import Input from '../../components/forms/Input'
import { useState } from 'react'
import useAuthService from '../../services/AuthService'
import { useNavigate } from "react-router"

const Login = () => {
  const [form, setForm] = useState({
    username: "",
    password: ""
  })

  const { login } = useAuthService()
  const navigate = useNavigate()

  const handleLogin = async() => {
    try {
      const response = await login(form)
      console.log("response login: ", response)
      const data = response?.data
      localStorage.setItem('accessToken', data.accessToken)
      localStorage.setItem('refreshToken', data.refreshToken)
      navigate("/home")
    } catch (error) {
      console.error(error)
    }
  }

  const handleChangeInput = (e) => {
    const { name, value } = e.target
    setForm({ ...form, [name]: value})
  }

  return (
    <div className='bg-slate-200 min-h-dvh flex items-center justify-center'>
      <div className='bg-white w-[400px] h-[400px] p-10'>
        <h1 className='text-2xl font-bold'>Login</h1>

        <div className='mt-10'>
          <label>Username</label>
          <Input
            value={form.username}
            name='username'
            onChange={handleChangeInput}
          />
        </div>
        <div className='mt-4'>
          <label>Password</label>
          <Input
            value={form.password}
            name='password'
            onChange={handleChangeInput}
          />
        </div>
        
        <div className='mt-4'>
          <button onClick={handleLogin} className='w-full text-center py-3 bg-blue-200'>Login</button>
        </div>

      </div>
    </div>
  )
}

export default Login