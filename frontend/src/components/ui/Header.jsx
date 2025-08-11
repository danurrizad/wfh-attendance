import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSignOut, faUserCircle } from "@fortawesome/free-solid-svg-icons"
import useVerify from "../../hooks/useVerify"
import Button from "../../components/forms/Button"
import { useAuth } from '../../context/AuthContext'
import { useSidebar } from '../../context/SidebarContext'

const Header = () => {
  const { auth } = useVerify()
  const { setShowModalLogout } = useAuth()
  const { toggleSidebar, toggleMobileSidebar, isExpanded, isMobile } = useSidebar()

  return (
    <div className='w-screen fixed top-0 z-0 flex justify-between items-center p-4 md:px-10 px-2 bg-white h-[100px] border-b-1 border-gray-300'>
      <div className={`${(isExpanded && !isMobile) ? "ml-[190px]" : "ml-[40px]"} ${isMobile && "ml-0!"} transition-all duration-300 flex items-center gap-4`}>
        <button onClick={isMobile ? toggleMobileSidebar : toggleSidebar} className='cursor-pointer'><FontAwesomeIcon icon={faBars} /></button>
        <div className='flex items-center gap-2'>
          <FontAwesomeIcon icon={faUserCircle} className='text-5xl'/>
          <div>
            <p>{auth.name}</p>
            <p>{auth.roleName}</p>
          </div>
        </div>
      </div>
      <div>
        <Button variant='outline' startIcon={<FontAwesomeIcon icon={faSignOut}/>} onClick={()=>setShowModalLogout(true)}>Logout</Button>
      </div>
    </div>
  )
}

export default Header