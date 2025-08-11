import { useCallback } from 'react'
import { Link, useLocation } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGear, faClock } from '@fortawesome/free-solid-svg-icons'
import { useSidebar } from '../../context/SidebarContext'

const Sidebar = () => {
  const location = useLocation();
  const { isExpanded, isMobileExpanded, isMobile } = useSidebar()

  // Check is menu active
  const isActive = useCallback(
    (path) => location.pathname === path,
    [location.pathname]
  );

  const routes = [
    {
      section: "Home",
    },
    {
      name: "Attendances",
      href: "/attendances",
      icon: faClock
    },
    {
      section: "Master",
    },
    {
      name: "Roles",
      href: "/master/roles",
      icon: faGear
    },
    {
      name: "Users",
      href: "/master/users",
      icon: faUser
    },
  ]

  return (
    <div className={`fixed ${(isMobile && !isMobileExpanded) && "w-[0px]!"} ${(isMobile && isMobileExpanded) && "w-[200px]!"} overflow-hidden left-0 bg-white h-screen ${isExpanded ? "w-[200px]" : "w-[60px]"} z-10 transition-all duration-300`}>
      <div className='mb-5 px-3 border-b-1 border-gray-200 h-[100px] flex items-center'>
        { (isExpanded || isMobileExpanded) ? (
          <h1 className='font-bold'>WFH ATTENDANCE SYSTEM</h1>
        ):(
          <img src='/public/logo.png' className=''/>
        )}
      </div>
      <div className='flex flex-col gap-4 px-2'>
        { routes.map((item, index)=>{
          const isMenuActive = isActive(item.href)
          return(
            <div>
              {item?.section && (
                (isExpanded || isMobileExpanded) ? (
                  <p className='font-bold text-gray-400 text-sm'>{item?.section.toUpperCase()}</p>
                ):(
                  <p className='text-center'>...</p>
                )
              )}
            { item?.href && (
              <Link key={index} to={item?.href} style={{ backgroundColor: isMenuActive && "oklch(58.8% 0.158 241.966)", color: isMenuActive && "white" }} className={`w-full px-4 py-4 bg-white ${isMenuActive ? "bg-sky-600" : "hover:bg-slate-100"}  rounded-md flex justify-start items-center gap-4`}>
                <FontAwesomeIcon icon={item.icon}/>
                { (isExpanded || isMobileExpanded) && <p>{item.name}</p> }
              </Link>
            )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default Sidebar