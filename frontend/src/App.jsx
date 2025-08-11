import { BrowserRouter as Router, Routes, Route } from "react-router";
import './App.css'
import Login from "../src/pages/login/Login"
import AppLayout from "./layout/AppLayout";
import Roles from "./pages/master/Roles";
import Users from "./pages/master/Users";
import Attendance from "./pages/attendance/Attendance";
import HomeEmployee from "./pages/home/HomeEmployee";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />,
          
          <Route element={<AppLayout/>}>
            <Route path="/attendances" element={<Attendance />} />,
            <Route path="/master/roles" element={<Roles />} />,
            <Route path="/master/users" element={<Users />} />,
            {/* <Route path="*" element={<NotFound />} / > */}
          </Route>
          <Route path="/home" element={<HomeEmployee/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
