import { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import { useAxios } from "../../../Component/Providers/useAxios";
import { Link, useNavigate } from "react-router-dom";

type Notification = {
  _id: string;
  userId: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: string;
};

type events = {
  officiantId: string;
  status: string;
  _id: string;
  title: string;
};

type booking = {
  _id: string;
  eventDate: Date;
  eventType: string;
  approvedStatus: string;
  updatedAt: Date;
};

type Ceremony = {
  id: string;
  name: string;
  date: string;
  officiant: string;
  complete: string;
  description?: string;
  eventTime?: string;
  location?: string;
};

const DashHome = () => {
  const [showingAll, setShowingAll] = useState(false);
  const navigate = useNavigate();
  const [ceremonies, setCeremonies] = useState<Ceremony[]>([]);
  const [activeEvent, setActiveEvent] = useState<Ceremony | null>(null);
  const [newBookings, setNewBookings] = useState<booking[]>([]);
  const [ceremony, setCeremony] = useState<events[]>([]);

  const fetchScheduleData = async () => {
    try {
      const response = await axios.get(`/schedule/get-officiant/${user?._id}`);

      setNewBookings(response.data);
    } catch (error) {
      console.error("Error fetching schedule data:", error);
    }
  };

  const axios = useAxios();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { user } = useAuth();

  const getNotifications = async () => {
    try {
      const response = await axios.get("/notifications/my");
      console.log(
        `Found ${response.data.notifications.length} notifications for user ${user?._id}`
      );
      setNotifications(response.data.notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

  const getCeremonies = async () => {
    try {
      const response = await axios.get(
        `/events/by-role/${user?._id}/${user?.role}`
      );
      const ceremonyData = response.data.events
        .filter((ceremony: any) => ceremony.status === "completed")
        .map((ceremony: any) => ({
          id: ceremony._id,
          name: ceremony.title,
          date: new Date(ceremony.eventDate).toLocaleDateString('en-US', { timeZone: 'America/New_York', year: 'numeric', month: 'long', day: 'numeric' }),
          officiant: ceremony.officiantName,
          complete: ceremony.status,
          description: ceremony.description,
          eventTime: ceremony.eventTime,
          location: ceremony.location,
        }));

      setCeremonies(ceremonyData);
    } catch (error) {
      console.error("Error fetching ceremonies:", error);
    }
  };

  useEffect(() => {
    getNotifications();
    getCeremonies();
    fetchScheduleData();
    getCeremony();
  }, []);

  const viewEventDetails = (ceremony: Ceremony) => {
    setActiveEvent(ceremony);
    (document.getElementById("my_modal_4") as HTMLDialogElement).showModal();
  };

  const toggleShowAll = () => {
    setShowingAll((prev) => !prev);
  };
  const getCeremony = async () => {
    const response = await axios.get(`/events/officiantAccess/all`);
    console.log("ceremony", response);
    setCeremony(response?.data && response?.data.events);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Dashboard Header */}
        <div className="bg-white lg:px-4 w-full lg:w-5/7 shadow-xl rounded-2xl border border-primary py-14 flex flex-col text-center items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-4xl font-semibold font-primary text-gray-900 mb-2">
              Dashboard Home
            </h1>
            <p className="text-black-web font-secondary text-lg lg:text-xl">
              Welcome Back!{" "}
              {user?.name
                ? user.name
                : `${user?.partner_1} & ${user?.partner_2}`}
              .
            </p>
          </div>

          {user?.role === "officiant" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4 md:gap-x-10 font-secondary mt-5 w-full px-4 sm:px-0">
              <div className="border flex flex-col py-3 px-4 rounded-md border-gray-200 hover:border-primary transition-colors">
                <p className="text-sm text-gray-600 mb-1">New bookings</p>
                <p className="text-2xl font-bold text-primary">
                  {
                    newBookings.filter(
                      (booking) => booking.approvedStatus === "pending"
                    ).length
                  }
                </p>
              </div>
              <div className="border flex flex-col py-3 px-4 rounded-md border-gray-200 hover:border-primary transition-colors">
                <p className="text-sm text-gray-600 mb-1">
                  Total Clients served
                </p>
                <p className="text-2xl font-bold text-green-600">
                  {
                    ceremony.filter(
                      (ceremony) =>
                        ceremony.officiantId === user._id &&
                        ceremony.status === "completed"
                    ).length
                  }
                </p>
              </div>
              <div className="border flex flex-col py-3 px-4 rounded-md border-gray-200 hover:border-primary transition-colors">
                <p className="text-sm text-gray-600 mb-1">Ongoing Clients</p>
                <p className="text-2xl font-bold text-blue-600">
                  {
                    ceremony.filter(
                      (ceremony) =>
                        ceremony.officiantId === user._id &&
                        ceremony.status === "approved"
                    ).length
                  }
                </p>
              </div>
              <div className="border flex flex-col py-3 px-4 rounded-md border-gray-200 hover:border-primary transition-colors">
                <p className="text-sm text-gray-600 mb-1">
                  Confirmed this week
                </p>
                <p className="text-2xl font-bold text-indigo-600">
                  {
                    newBookings.filter((booking) => {
                      const sevenDaysAgo = new Date();
                      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
                      return (
                        new Date(booking.updatedAt) >= sevenDaysAgo &&
                        booking.approvedStatus === "approved"
                      );
                    }).length
                  }
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-6 flex flex-col lg:flex-row gap-4 mx-auto ">
              <Link
                to="/dashboard/ceremony"
                className="bg-primary group text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2"
              >
                <span>Start A new Ceremony</span>
                <MdKeyboardArrowRight
                  className="group-hover:translate-x-3 transition-transform duration-200"
                  size={20}
                />
              </Link>
              <button
                onClick={() =>
                  navigate("/dashboard/ceremony", { state: { tab: "draft" } })
                }
                className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Continue Editing
              </button>
            </div>
          )}
        </div>

        {/* Notifications */}
        <div className="bg-white w-full lg:w-2/7 shadow-xl rounded-2xl flex flex-col border border-primary p-4 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-primary font-semibold text-gray-900">
              Notifications
            </h2>
          </div>
          <div className="space-y-3 lg:py-4 p-2 max-h-48 sm:max-h-60 lg:max-h-72 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No notifications available.
              </p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className="flex items-start sm:items-center space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-2xl border border-primary"
                >
                  <span className="bg-[#D4AF371A] text-primary border border-primary px-2 py-1 rounded-2xl text-xs font-secondary font-semibold whitespace-nowrap">
                    {notification.type}
                  </span>
                  <p className="text-xs sm:text-sm text-gray-700 break-words">
                    {notification.message}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      
      {/* Past Ceremonies */}
      <div className="bg-white rounded-2xl border border-primary shadow-xl p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 gap-2">
          <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-primary text-start font-semibold text-gray-900">
            Past Ceremonies
          </h2>
          {ceremonies.length > 3 && (
            <button
              onClick={toggleShowAll}
              className="text-yellow-600 font-secondary hover:text-yellow-700 font-medium text-sm sm:text-base"
            >
              {showingAll ? "Show Less" : "Show All"}
            </button>
          )}
        </div>

        <div
          className={`space-y-4 ${
            showingAll ? "max-h-96 lg:max-h-[500px] overflow-y-auto" : ""
          }`}
        >
          {ceremonies.length > 0 ? (
            (showingAll ? ceremonies : ceremonies.slice(0, 3)).map(
              (ceremony) => (
                <div
                  key={ceremony.id}
                  className="flex flex-col lg:flex-row items-start lg:items-center justify-between p-3 sm:p-4 border border-primary rounded-2xl gap-4"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 text-lg sm:text-xl lg:text-2xl font-primary truncate">
                      {ceremony.name}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-500 font-secondary">
                      {ceremony.date} • Officiant: {ceremony.officiant}
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row w-full lg:w-auto items-stretch sm:items-center gap-2 sm:gap-2">
                    <button
                      onClick={() => viewEventDetails(ceremony)}
                      className="px-4 py-2 cursor-pointer text-xs sm:text-sm border border-primary rounded-2xl hover:bg-gray-50 transition-colors"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              )
            )
          ) : (
            <div className="w-full py-10 px-4 flex flex-col items-center justify-center text-center space-y-4">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-yellow-500 sm:w-20 sm:h-20 lg:w-22 lg:h-22"
                aria-hidden="true"
                role="img"
              >
                <rect
                  x="3"
                  y="4"
                  width="18"
                  height="18"
                  rx="2"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <path
                  d="M16 2v4M8 2v4M3 10h18"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="8.5" cy="15.5" r="1.25" fill="currentColor" />
                <circle cx="12" cy="15.5" r="1.25" fill="currentColor" />
                <circle cx="15.5" cy="15.5" r="1.25" fill="currentColor" />
              </svg>

              <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900">
                No past ceremonies found
              </h3>

              {user?.role === "user" && (
                <p className="text-xs sm:text-sm text-gray-500 max-w-prose px-2">
                  You don't have any completed ceremonies yet. Create your first
                  ceremony or continue editing an existing draft to get started.
                </p>
              )}

              {user?.role === "user" && (
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2">
                  <Link
                    to="/dashboard/ceremony"
                    className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-sm sm:text-base bg-primary text-white rounded-2xl font-medium hover:bg-primary/90"
                  >
                    Start a new ceremony
                  </Link>

                  <button
                    onClick={() =>
                      navigate("/dashboard/ceremony", {
                        state: { tab: "draft" },
                      })
                    }
                    className="inline-flex items-center justify-center px-3 sm:px-4 py-2 text-sm sm:text-base border border-primary text-gray-700 bg-white rounded-2xl font-medium hover:bg-gray-50"
                  >
                    Continue Editing Drafts
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Event Details Modal */}
      <dialog id="my_modal_4" className="modal">
        <div className="modal-box bg-amber-50 w-11/12 max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-10">
              ✕
            </button>
          </form>

          {activeEvent ? (
            <div className="space-y-4">
              {/* Modal Header */}
              <div className="text-center border-b pb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Event Details
                </h2>
              </div>

              {/* Event Details Content */}
              <div className="space-y-4 p-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    {activeEvent.name}
                  </h3>
                  <div className="space-y-2 text-gray-700">
                    <p>
                      <span className="font-medium">Date:</span>{" "}
                      {activeEvent.date}
                    </p>
                    {activeEvent.eventTime && (
                      <p>
                        <span className="font-medium">Time:</span>{" "}
                        {new Date(activeEvent.eventTime).toLocaleTimeString('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: '2-digit', hour12: true })}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Officiant:</span>{" "}
                      {activeEvent.officiant}
                    </p>
                    {activeEvent.location && (
                      <p>
                        <span className="font-medium">Location:</span>{" "}
                        {activeEvent.location}
                      </p>
                    )}
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span className="inline-block px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                        {activeEvent.complete}
                      </span>
                    </p>
                    {activeEvent.description && (
                      <div>
                        <span className="font-medium">Description:</span>
                        <p className="mt-1 text-gray-600">
                          {activeEvent.description}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">Loading event details...</div>
          )}
        </div>
      </dialog>
    </div>
  );
};

export default DashHome;
