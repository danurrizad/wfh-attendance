import { Outlet,  } from "react-router";
import Sidebar from "../components/UI/Sidebar";
import Header from "../components/UI/Header";

const LayoutContent = () => {
  return (
    <div className="min-h-screen xl:flex">
      <div>
        <Sidebar />
      </div>
      <div
        className={`flex-1 transition-all duration-300 ease-in-out  bg-slate-100 `}
      >
        <Header />
        <div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6 mt-20 ml-50 ">
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
