import { useCallback } from 'react'
import { Link, useLocation } from 'react-router'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUser, faGear, faTimesRectangle, faHome } from '@fortawesome/free-solid-svg-icons'

const Sidebar = () => {
  const location = useLocation();
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
      name: "Home",
      href: "/home/admin",
      icon: faHome
    },
    {
      name: "Attendances",
      href: "/attendances",
      icon: faTimesRectangle
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
    <div className='fixed left-0 bg-white h-screen w-[200px] z-10'>
      <div className='mb-5 px-5 border-b-1 border-gray-200 h-[100px] flex items-center'>
        <h1 className='font-bold'>WFH ATTENDANCE SYSTEM</h1>
      </div>
      <div className='flex flex-col gap-4 px-2'>
        { routes.map((item, index)=>{
          const isMenuActive = isActive(item.href)
          return(
            <div>
              {item?.section && (
                <p className='font-bold text-gray-400 text-sm'>{item?.section.toUpperCase()}</p>
              )}
            { item?.href && (
              <Link key={index} to={item?.href} style={{ backgroundColor: isMenuActive && "oklch(58.8% 0.158 241.966)", color: isMenuActive && "white" }} className={`w-full px-4 py-4 bg-white ${isMenuActive ? "bg-sky-600" : "hover:bg-slate-100"}  rounded-md flex justify-start items-center gap-4`}>
                <FontAwesomeIcon icon={item.icon}/>
                <p>{item.name}</p>
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