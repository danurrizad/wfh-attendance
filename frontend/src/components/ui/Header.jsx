import useAuthService from '../../services/AuthService'
import { useNavigate } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSignOut, faUserCircle } from "@fortawesome/free-solid-svg-icons"
import useVerify from "../../hooks/useVerify"
import Button from "../../components/forms/Button"

const Header = () => {
  const { auth, clearAuth } = useVerify()
  const { logout } = useAuthService()
  const navigate = useNavigate()

  const handleLogout = async() => {
    try {
      await logout()
      clearAuth()
      navigate("/login")
    } catch (error) {
      console.error(error)
    }
  }

  // Lock HR pages
  // useEffect(()=>{
  //   if(auth.roleName !== "HR"){
  //     navigate("/login")
  //   }
  // }, [auth])

  return (
    <div className='w-screen fixed top-0 z-0 flex justify-between items-center p-4 px-10 bg-white h-[100px] border-b-1 border-gray-300'>
      <div className='ml-[190px] flex items-center gap-4'>
        <button className='cursor-pointer'><FontAwesomeIcon icon={faBars} /></button>
        <div className='flex items-center gap-2'>
          <FontAwesomeIcon icon={faUserCircle} className='text-5xl'/>
          <div>
            <p>{auth.name}</p>
            <p>{auth.roleName}</p>
          </div>
        </div>
      </div>
      <div>
        <Button variant='outline' startIcon={<FontAwesomeIcon icon={faSignOut}/>} onClick={handleLogout}>Logout</Button>
      </div>
    </div>
  )
}

export default Header