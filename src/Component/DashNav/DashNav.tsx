import { useState } from "react";
import {
  HiOutlineHome,
  HiOutlineCalendar,
  HiOutlineUserGroup,
  HiOutlineDocumentText,
  HiOutlineCog,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineHeart,
  HiOutlineBell,
  HiOutlineSearch,
} from "react-icons/hi";
import { Link, useLocation } from "react-router-dom";

const DashNav = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: HiOutlineHome,
      current: location.pathname === "/dashboard",
    },
    {
      name: "Ceremony Builder",
      href: "/dashboard/ceremony",
      icon: HiOutlineHeart,
      current: location.pathname.includes("/dashboard/ceremony"),
    },
    {
      name: "Schedule",
      href: "/dashboard/schedule",
      icon: HiOutlineCalendar,
      current: location.pathname.includes("/dashboard/schedule"),
    },
    {
      name: "Discussions",
      href: "/dashboard/discussions",
      icon: HiOutlineUserGroup,
      current: location.pathname.includes("/dashboard/discussions"),
    },
    {
      name: "Notes",
      href: "/dashboard/notes",
      icon: HiOutlineDocumentText,
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
            <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-semibold text-gray-900">Wedding Planner</span>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
            <HiOutlineBell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </button>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
      </div>

      {/* Desktop Header */}
      <div
        className="hidden lg:flex bg-white border-b border-gray-200 px-6 py-3.5 items-center justify-between fixed top-0 right-0 left-0 z-30"
        style={{ marginLeft: isCollapsed ? "4rem" : "16rem" }}
      >
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          >
            <HiOutlineMenu className="h-6 w-6" />
          </button>

          <div className="relative">
            <HiOutlineSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search"
              className="pl-10 pr-4 py-2 w-96 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100 relative">
            <HiOutlineBell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              2
            </span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
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
        fixed top-0 left-0 h-full bg-white border-r border-gray-200 z-50 transition-all duration-300 ease-in-out
        ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }
        ${isCollapsed ? "lg:w-16" : "lg:w-64"}
        w-64
      `}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div
              className={`flex items-center space-x-3 ${
                isCollapsed ? "lg:justify-center" : ""
              }`}
            >
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">W</span>
              </div>
              {!isCollapsed && (
                <div className="lg:block">
                  <div className="text-sm font-medium text-gray-900">
                    THE WEDDING
                  </div>
                  <div className="text-xs text-gray-500">OFFICIANTS</div>
                </div>
              )}
            </div>

            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-1 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            >
              <HiOutlineX className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`
                  group flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-colors duration-200 relative
                  ${
                    item.current
                      ? "bg-yellow-100 text-yellow-900"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  }
                  ${isCollapsed ? "lg:justify-center lg:px-3" : ""}
                `}
                title={isCollapsed ? item.name : undefined}
              >
                {item.current && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-yellow-500 rounded-r"></div>
                )}
                <IconComponent
                  className={`
                    flex-shrink-0 h-5 w-5
                    ${
                      item.current
                        ? "text-yellow-600"
                        : "text-gray-500 group-hover:text-gray-700"
                    }
                    ${isCollapsed ? "" : "mr-3"}
                  `}
                />
                {!isCollapsed && <span className="lg:block">{item.name}</span>}

                {/* Tooltip for collapsed state */}
                {isCollapsed && (
                  <div className="absolute left-16 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div
          className={`p-4 border-t border-gray-200 ${
            isCollapsed ? "lg:px-2" : ""
          }`}
        >
          <div
            className={`flex items-center ${
              isCollapsed ? "lg:justify-center" : "space-x-3"
            }`}
          >
            <div className="w-8 h-8 bg-gray-300 rounded-full flex-shrink-0"></div>
            {!isCollapsed && (
              <div className="lg:block min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  Steve
                </div>
                <div className="text-xs text-gray-500 truncate">
                  steve@example.com
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default DashNav;
