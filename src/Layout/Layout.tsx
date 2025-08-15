import { Outlet } from "react-router-dom"
import Nav from "../Component/Shared/Nav"
import Footer from "../Component/Shared/Footer"

const Layout = () => {
  return (
    <div>
      
        <Nav />
        <Outlet />
        <Footer />
    </div>
  )
}

export default Layout