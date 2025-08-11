import { Outlet, useNavigate,  } from "react-router";
import Sidebar from "../components/ui/Sidebar";
import Header from "../components/ui/Header";
import { Modal } from "../components/ui/modal/Modal";
import { Card } from "../components/ui/card/Card";
import Button from "../components/forms/Button";
import { useAuth } from "../context/AuthContext";
import useAuthService from "../services/AuthService";
import { useSidebar } from "../context/SidebarContext";

const LayoutContent = () => {
  const { showModalLogout, setShowModalLogout, clearAuth } = useAuth()
  const { logout } = useAuthService()
  const navigate = useNavigate()
  const { isExpanded, isMobile } = useSidebar()

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

  return (
    <div className="min-h-screen xl:flex">
      <div>
        {renderModalLogout()}
      </div>
      <div>
        <Sidebar />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out  bg-slate-100 `}
      >
        <Header />
        <div className={`p-4 mx-auto  md:p-6 mt-20 ${isExpanded ? "ml-50" :"ml-14"} ${isMobile && "ml-0!"} transition-all duration-300`}>
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

const AppLayout= () => {
  return (
      <LayoutContent />
  );
};

export default AppLayout;
