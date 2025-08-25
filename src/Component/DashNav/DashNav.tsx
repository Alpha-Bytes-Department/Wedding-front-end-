import { useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import {
  HiOutlineCog,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineBell,
} from "react-icons/hi";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { LiaStickyNoteSolid } from "react-icons/lia";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { PiChats, PiClipboardTextBold } from "react-icons/pi";
import { RiExpandLeftRightLine } from "react-icons/ri";
import { NavLink, useLocation } from "react-router-dom";

const DashNav = ({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: MdOutlineSpaceDashboard,
      current: location.pathname === "/dashboard",
    },
    {
      name: "Ceremony Builder",
      href: "/dashboard/ceremony",
      icon: PiClipboardTextBold,
      current: location.pathname.includes("/dashboard/ceremony"),
    },
    {
      name: "Schedule",
      href: "/dashboard/schedule",
      icon: IoCalendarNumberOutline,
      current: location.pathname.includes("/dashboard/schedule"),
    },
    {
      name: "Discussions",
      href: "/dashboard/discussions",
      icon: PiChats,
      current: location.pathname.includes("/dashboard/discussions"),
    },
    {
      name: "Notes",
      href: "/dashboard/notes",
      icon: LiaStickyNoteSolid,
      current: location.pathname.includes("/dashboard/notes"),
    },
    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: HiOutlineCog,
      current: location.pathname.includes("/dashboard/settings"),
    },
  ];

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  const user = false;
  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileMenu}
        />
      )}

      {/* Top Navigation Bar - Mobile */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <button
            onClick={toggleMobileMenu}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <HiOutlineMenu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full flex items-center justify-center">
              <img src="/image.png" alt="" />
            </div>
            <span className="font-semibold text-gray-900 font-secondary">
              ERIE WEDDING <br />{" "}
              <span className=" text-xs font-normal">OFFICIANTS</span>
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
            <HiOutlineBell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </button>
          <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-primary">
            {/* ==================use profile picture of user ================== */}
            {user ? (
              <img
                src={`user.profilePicture`}
                alt="User Avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <FaUserAlt size={20} />
            )}
          </div>
        </div>
      </div>

      {/* Desktop Header */}
      <div
        className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-3.5 items-center justify-end fixed top-0 right-0 left-0 z-30"
        style={{ marginLeft: isCollapsed ? "4rem" : "16rem" }}
      >
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
            <HiOutlineBell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-primary">
              {/* ==================use profile picture of user ================== */}
              {user ? (
                <img
                  src={`user.profilePicture`}
                  alt="User Avatar"
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <FaUserAlt size={20} />
              )}
            </div>
            <div className="flex items-center space-x-1">
              <span className="text-sm font-medium text-gray-900">Steve</span>
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`
        fixed top-0 left-0 h-full bg-gray-50 border-r border-gray-200 z-50 transition-all duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        ${isCollapsed ? "lg:w-18" : "lg:w-64"}
        w-64
      `}
      >
        {/* Sidebar Header */}
        <div
          className={`p-4  border-gray-200 ${
            !isCollapsed ? "mx-3 border-b" : ""
          }`}
        >
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-3 ${
                isCollapsed ? "lg:justify-center" : ""
              }`}
            >
              <div className="w-8 h-8  rounded-full flex items-center justify-center flex-shrink-0">
                <img src="/image.png" alt="logo" />
              </div>
              {!isCollapsed && (
                <div className="lg:block">
                  <div className="text-sm font-medium text-gray-900">
                    ERIE WEDDING
                  </div>
                  <div className="text-xs text-gray-500">OFFICIANTS</div>
                </div>
              )}
            </div>

            <button
              onClick={toggleMobileMenu}
              className="lg:hidden  p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <HiOutlineX className="h-5 w-5" />
            </button>
          </div>
          <button
            onClick={toggleSidebar}
            className="absolute hidden lg:block top-4 -right-4 p-2 rounded-full  text-gray-600 hover:text-gray-900 bg-gray-100"
          >
            <RiExpandLeftRightLine size={15} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 font-secondary">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            // Only "Dashboard" should be active for exact "/dashboard"
            const isActive =
              item.href === "/dashboard"
                ? location.pathname === "/dashboard"
                : location.pathname.startsWith(item.href);

            return (
              <NavLink
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
            group flex items-center px-3 py-3 hover:bg-gray-100 text-sm font-medium rounded-lg transition-colors duration-200 relative
            ${
              isActive
                ? "bg-primary text-yellow-900"
                : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
            }
            ${isCollapsed ? "lg:justify-center lg:px-3" : ""}
          `}
                title={isCollapsed ? item.name : undefined}
              >
                <>
                  <IconComponent
                    className={`
                flex-shrink-0 size-6
                ${
                  isActive
                    ? "text-white"
                    : "text-gray-500 group-hover:text-gray-700"
                }
                ${isCollapsed ? "" : "mr-3"}
              `}
                  />
                  {!isCollapsed && (
                    <span
                      className={`lg:block text-lg font-medium
            flex-shrink-0 
            ${
              isActive
                ? "text-white"
                : "text-gray-500 group-hover:text-gray-700"
            }
            ${isCollapsed ? "" : "mr-3"}
                `}
                    >
                      {item.name}
                    </span>
                  )}

                  {/* Tooltip for collapsed state */}
                  {isCollapsed && (
                    <div className="absolute left-16 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                      {item.name}
                    </div>
                  )}
                </>
              </NavLink>
            );
          })}
        </nav>
      </div>
    </>
  );
};

export default DashNav;
