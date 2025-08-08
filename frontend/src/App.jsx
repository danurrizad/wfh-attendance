import { BrowserRouter as Router, Routes, Route } from "react-router";
import './App.css'
import Login from "../src/pages/login/Login"
import Home from "../src/pages/home/Home"
import AppLayout from "./layout/AppLayout";
import Roles from "./pages/master/Roles";
import Users from "./pages/master/Users";
import Attendance from "./pages/attendance/Attendance";

function App() {

  return (
    <>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />,
          
          <Route element={<AppLayout/>}>
            <Route path="/home" element={<Home />} />,
            <Route path="/attendances" element={<Attendance />} />,
            <Route path="/master/roles" element={<Roles />} />,
            <Route path="/master/users" element={<Users />} />,
            {/* <Route path="*" element={<NotFound />} / > */}
          </Route>

        </Routes>
      </Router>
    </>
  )
}

export default App
