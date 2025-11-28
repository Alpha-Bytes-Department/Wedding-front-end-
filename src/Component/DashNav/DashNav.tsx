import { useCallback, useEffect, useState } from "react";
import { FaUserAlt } from "react-icons/fa";
import {
  HiOutlineCog,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineBell,
} from "react-icons/hi";
import { LuUserCog } from "react-icons/lu";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { LiaStickyNoteSolid } from "react-icons/lia";
import {
  MdOutlineNotifications,
  MdOutlineNotificationsActive,
  MdOutlineSpaceDashboard,
} from "react-icons/md";
import { PiChats, PiClipboardTextBold } from "react-icons/pi";
import { RiExpandLeftRightLine } from "react-icons/ri";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../Providers/AuthProvider";
import { useAxios } from "../Providers/useAxios";
import { GoRead } from "react-icons/go";

type Notification = {
  _id: string;
  userId: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

const DashNav = ({
  isCollapsed,
  setIsCollapsed,
}: {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const axios = useAxios();
  const getNotifications = async () => {
    try {
      const response = await axios.get("/notifications/my");
      setNotifications(response.data.notifications);
      // console.log("Notifications:", response.data);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };
  useEffect(() => {
    getNotifications();
  }, []);

  const { user, logout } = useAuth();

  const markAsRead = useCallback(
    async (notificationId: string) => {
      try {
        await axios.patch(`/notifications/toggle-read/${notificationId}`);
        // Update local state to reflect the change
        setNotifications((prev) =>
          prev.map((note) =>
            note._id === notificationId ? { ...note, isRead: true } : note
          )
        );
      } catch (error) {
        console.error("Error marking notification as read:", error);
      }
    },
    [axios]
  );

  const navigationItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: MdOutlineSpaceDashboard,
      current: location.pathname === "/dashboard",
    },
    //Add Booking route:
    // Conditionally add "Bookings" route based on isAdmin
    ...(user?.role === "officiant"
      ? [
          {
            name: "Bookings",
            href: "/dashboard/bookings",
            icon: PiClipboardTextBold,
            current: location.pathname.includes("/dashboard/bookings"),
          },
          {
            name: "Discussions",
            href: "/dashboard/discussions",
            icon: PiChats,
            current: location.pathname.includes("/dashboard/discussions"),
          },
        ]
      : [
          {
            name: "Booking",
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
            name: "Ceremony Builder",
            href: "/dashboard/ceremony",
            icon: PiClipboardTextBold,
            current: location.pathname.includes("/dashboard/ceremony"),
          },
        ]),
    ...(user?.role === "officiant"
      ? [
          {
            name: "Ceremony Review",
            href: "/dashboard/review",
            icon: LiaStickyNoteSolid,
            current: location.pathname.includes("/dashboard/review"),
          },
        ]
      : []),

    {
      name: "Notes",
      href: "/dashboard/notes",
      icon: LiaStickyNoteSolid,
      current: location.pathname.includes("/dashboard/notes"),
    },

    // Bills - Only for clients (not officiants)
    ...(user?.role !== "officiant"
      ? [
          {
            name: "Bills",
            href: "/dashboard/bills",
            icon: GoRead,
            current: location.pathname.includes("/dashboard/bills"),
          },
        ]
      : []),

    ...(user?.email === "joysutradharaj@gmail.com" ||
    user?.email === "steve@erieweddingofficiants.com"
      ? [
          {
            name: "User Management",
            href: "/dashboard/admin",
            icon: LuUserCog,
            current: location.pathname.includes("/dashboard/admin"),
          },
          {
            name: "Event Management",
            href: "/dashboard/event-management",
            icon: IoCalendarNumberOutline,
            current: location.pathname.includes("/dashboard/event-management"),
          },
        ]
      : []),

    {
      name: "Settings",
      href: "/dashboard/settings",
      icon: HiOutlineCog,
      current: location.pathname.includes("/dashboard/settings"),
    },
  ];
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  // const user = false;

  const handleLogout = () => {
    // console.log("Logging out...");
    logout();
  };
  // const admin=false;
  return (
    <>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-[#272b08be] bg-opacity-50 z-40 lg:hidden"
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
          <div className="flex cursor-pointer items-center space-x-2">
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
            <HiOutlineBell
              onClick={() => {
                const modal = document.getElementById(
                  "my_modal_3"
                ) as HTMLDialogElement | null;
                if (modal) modal.showModal();
              }}
              className="h-6 w-6"
            />
            {notifications?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-xs rounded-full px-1.5 py-0.5 flex items-center justify-center min-w-[18px] h-[18px]">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>
          <div className="relative">
            {/* Clickable area */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex gap-4 items-center cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              {/* User Avatar */}
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-primary">
                {user ? (
                  <img
                    src={user.profilePicture}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FaUserAlt size={20} />
                )}
              </div>
              <div className="text-sm font-medium text-gray-900 hidden sm:block">
                {user?.name || user?.email}
              </div>
              {/* Arrow icon */}
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
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

            {/* Dropdown content */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Log Out
                </button>
              </div>
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
            <HiOutlineBell
              onClick={() => {
                const modal = document.getElementById(
                  "my_modal_3"
                ) as HTMLDialogElement | null;
                if (modal) modal.showModal();
              }}
              className="h-6 w-6"
            />
            {notifications?.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-[#D4AF37] text-white text-xs rounded-full px-1.5 py-0.5 flex items-center justify-center min-w-[18px] h-[18px]">
                {notifications.filter((n) => !n.isRead).length}
              </span>
            )}
          </button>

          <div className="relative">
            {/* Clickable area */}
            <div
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex gap-4 items-center cursor-pointer  rounded-lg transition-colors"
            >
              {/* User Avatar */}
              <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center border-2 border-primary">
                {user ? (
                  <img
                    src={user.profilePicture}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <FaUserAlt size={20} />
                )}
              </div>
              <div className="text-sm font-medium text-gray-900">
                {user?.name || user?.email}
              </div>
              {/* Arrow icon */}
              <svg
                className={`w-4 h-4 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
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

            {/* Dropdown content */}
            {isDropdownOpen && (
              <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 min-w-32">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleLogout();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full px-4 py-2 text-sm text-left hover:bg-gray-50 rounded-lg transition-colors"
                >
                  Log Out
                </button>
              </div>
            )}
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
              onClick={() => navigate("/")}
              className={`flex items-center cursor-pointer space-x-3 ${
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
      <dialog id="my_modal_3" className="modal">
        <div className="modal-box max-w-md [scrollbar-width:none] bg-white h-96 ">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg text-center mb-4">Notifications</h3>

          {notifications?.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No notifications yet</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[400px] [scrollbar-width:none] overflow-y-auto pr-2">
              {notifications?.map((item) => (
                <div
                  key={item._id}
                  className={`flex justify-between items-start p-3 rounded-lg ${
                    item.isRead ? "bg-gray-50" : "bg-yellow-50"
                  }`}
                >
                  <div className="flex gap-3 items-start">
                    <div
                      className={`p-2 rounded-full ${
                        item.isRead ? "bg-gray-200" : "bg-yellow-200"
                      }`}
                    >
                      {item.isRead ? (
                        <MdOutlineNotifications className="text-gray-700 w-5 h-5" />
                      ) : (
                        <MdOutlineNotificationsActive className="text-yellow-700 w-5 h-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{item.message}</p>
                      <p className="text-xs text-gray-500 mt-1 font-medium">
                        {new Date(item.createdAt).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          hour: "numeric",
                          minute: "numeric",
                          hour12: true,
                        })}
                      </p>
                    </div>
                  </div>

                  {!item.isRead && (
                    <button
                      onClick={() => markAsRead(item._id)}
                      className="p-1.5 hover:bg-gray-100 cursor-pointer rounded-full"
                      title="Mark as read"
                    >
                      <GoRead className="w-5 h-5 text-gray-600" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </dialog>
    </>
  );
};

export default DashNav;
