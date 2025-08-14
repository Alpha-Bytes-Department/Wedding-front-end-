import { Outlet } from "react-router-dom"
import Nav from "../Component/Shared/Nav"

const Layout = () => {
  return (
    <div>
      
        <Nav />
        <Outlet />
    </div>
  )
}

export default Layout