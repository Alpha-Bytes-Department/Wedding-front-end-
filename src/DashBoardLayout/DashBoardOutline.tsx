import { Outlet } from "react-router-dom";
import DashNav from "../Component/DashNav/DashNav";
import { useState, createContext, useContext } from "react";

// Create context for sidebar state
const SidebarContext = createContext<{
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}>({
  isCollapsed: false,
  setIsCollapsed: () => {},
});

export const useSidebar = () => useContext(SidebarContext);

const DashBoardOutline = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen ">
      <DashNav isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      {/* Main Content Area */}
      <div
        className={`
        transition-all duration-300 ease-in-out
        ${isCollapsed ? "lg:ml-16" : "lg:ml-64"}
        lg:pt-16
      `}
      >
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashBoardOutline;
