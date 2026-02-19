import { useEffect, useState } from "react";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import { useNavigate } from "react-router-dom";
import GlassSwal from "../../../utils/glassSwal";
import Avatar from "../../../Component/Shared/Avatar";
// import { get } from "http";

interface Booking {
  _id: string;
  fromUserId: string;
  approvedStatus: string;
  fromUserName: string;
  fromUserImage: string;
  scheduleDate: string;
  officiantName: string;
  eventId?: string;
  price?: number;
  message?: string;
}

interface Ceremony {
  price: number;
  _id: string;
  title: string;
  eventDate: string;
  officiantName: string;
  status: string;
  userId: string;
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [showFullList, setShowFullList] = useState(false);
  const [ongoingCeremonies, setOngoingCeremonies] = useState<Booking[]>([]);
  const [completedCeremonies, setCompletedCeremonies] = useState<Ceremony[]>(
    [],
  );
  const [seeFullCeremonies, setSeeFullCeremonies] = useState(false);
  const [seeOngoingCeremonies, setSeeOngoingCeremonies] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (user?.role !== "officiant") {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-primary font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }

  const toggleShowFullList = (id: number) => {
    switch (id) {
      case 1:
        setShowFullList(!showFullList);
        break;
      case 2:
        setSeeOngoingCeremonies(!seeOngoingCeremonies);
        break;
      case 3:
        setSeeFullCeremonies(!seeFullCeremonies);
        break;
    }
  };
  const [loading, setLoading] = useState(false);
  const axios = useAxios();
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/schedule/get-officiant/${user?._id}`);
      setBookings(
        response.data.filter(
          (booking: Booking) => booking.approvedStatus === "pending",
        ),
      );
      setOngoingCeremonies(
        response.data.filter(
          (booking: Booking) => booking.approvedStatus === "approved",
        ),
      );
      // console.log("Bookings:", response.data);
      //console.log(response.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };
  const getCeremonies = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/events/officiantAccess/all`);

      const completed = response.data.events.filter(
        (event: any) =>
          event.status === "completed" && event.officiantId === user?._id,
      );
      // console.log("Response Data:", response.data.events);

      const ongoing = response.data.events.filter(
        (event: any) =>
          event.status == "approved" && event.officiantId === user?._id,
      );

      setCompletedCeremonies(completed);

      //console.log('Completed Ceremonies:', completed);
      console.log("Ongoing Ceremonies:", ongoing);
    } catch (error) {
      console.error("Error fetching completed ceremonies:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleBookingUpdate = async (id: string, approvedStatus: string) => {
    try {
      setLoading(true);
      const confirmed = await GlassSwal.confirm(
        "Are you sure?",
        `You are about to ${approvedStatus} this booking.`,
      );
      if (confirmed.isConfirmed) {
        const response = await axios.put(`/schedule/update/${id}`, {
          approvedStatus,
        });
        await GlassSwal.success("Booking updated successfully", "success");
        console.log("Booking updated:", response.data);
      }
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      await GlassSwal.error(
        "Failed to update booking. Please try again later.",
        "error",
      );
    } finally {
      setLoading(false);
      fetchBookings();
    }
  };

  useEffect(() => {
    fetchBookings();
    getCeremonies();
  }, []);

  const showNote = (note: string) => {
    GlassSwal.info("Note from user", note);
  };
  const getProfileImageUrl = (profilePicture: string) => {
    if (!profilePicture) return "";
    // Check if it's already a complete URL
    if (profilePicture.startsWith("http")) {
      return profilePicture;
    }
    // For images in the public folder, construct the URL relative to the app root
    return `/${profilePicture}`;
  };

  const getImage = (id: string) => {
    const event = ongoingCeremonies.find(
      (event: any) => event.fromUserId === id,
    );
    return event ? event.fromUserImage : "";
  };

  //console.log('Ongoing Bookings State:', ongoingCeremonies);
  return (
    <div>
      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : (
        <>
          <div className="bg-white rounded-2xl shadow-xl border border-primary p-6 mb-8 ">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-4xl font-primary font-bold text-gray-900">
                Booking Requests
              </h2>
              {bookings.length > 3 && (
                <button
                  onClick={() => toggleShowFullList(1)}
                  className="text-primary font-medium border-[1px] border-primary rounded-lg py-2 px-5 text-sm cursor-pointer"
                >
                  {!showFullList ? "Show All" : "Show Less"}
                </button>
              )}
            </div>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div>
                  <p className="py-5 text-center">No booking requests</p>
                  <p className="text-3xl text-center">📉</p>
                </div>
              ) : showFullList ? (
                bookings.map((m) => (
                  <div
                    key={m._id}
                    className="flex items-center justify-between border border-primary rounded-lg px-4 py-3"
                  >
                    <div>
                      <div className="font-medium text-gray-900">
                        <Avatar
                          src={getProfileImageUrl(m?.fromUserImage)}
                          name={m.fromUserName}
                          size="md"
                        />
                        {m.fromUserName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(m.scheduleDate).toLocaleDateString("en-US", {
                          timeZone: "America/New_York",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · Officiant: {m.officiantName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          navigate(
                            `/dashboard/officiant-agreement?userId=${m.fromUserId}`,
                          )
                        }
                        className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-sm px-5 py-2 rounded-lg font-medium hover:from-orange-500 hover:to-yellow-500 transition-all"
                      >
                        Manage Agreement
                      </button>
                      <button className="bg-[#AF4B4B4D] text-[#3b1919] text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        Review the event
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                bookings.slice(0, 3).map((m) => (
                  <div
                    key={m._id}
                    className="flex items-center gap-4 flex-col md:flex-row justify-between border border-primary rounded-lg px-4 py-3"
                  >
                    <div>
                      <div className="font-medium items-center flex gap-4 text-gray-900">
                        <Avatar
                          src={getProfileImageUrl(m?.fromUserImage)}
                          name={m.fromUserName}
                          size="md"
                        />
                        {m.fromUserName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(m.scheduleDate).toLocaleDateString("en-US", {
                          timeZone: "America/New_York",
                          weekday: "short",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · Officiant: {m.officiantName}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => handleBookingUpdate(m._id, "approved")}
                        className="bg-[#AF4B4B4D] text-[#3b1919] text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() =>
                          showNote(m.message || "No note provided")
                        }
                        className="bg-[#AF4B4B4D] text-[#3b1919] text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        View Note
                      </button>
                      <button
                        onClick={() => handleBookingUpdate(m._id, "rejected")}
                        className="bg-[#AF4B4B4D] text-[#3b1919] text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/*Second Card*/}
          <div className="lg:flex gap-6 mt-16 px ">
            <div className="bg-white rounded-2xl shadow-xl border border-primary p-6 mb-8 lg:w-1/2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-4xl font-primary font-bold text-gray-900">
                  My Clients
                </h2>
                {ongoingCeremonies.length > 3 && (
                  <button
                    onClick={() => toggleShowFullList(2)}
                    className="text-primary font-medium border-[1px] border-primary rounded-lg py-2 px-5 text-sm cursor-pointer"
                  >
                    {!seeOngoingCeremonies ? "Show All" : "Show Less"}
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {ongoingCeremonies.length === 0 ? (
                  <div>
                    <p className=" py-5 text-center">No ongoing ceremonies</p>
                    <p className=" text-3xl text-center">📉</p>
                  </div>
                ) : seeOngoingCeremonies ? (
                  ongoingCeremonies.map((m) => (
                    <div
                      key={m._id}
                      className="flex items-center justify-between border border-primary rounded-lg px-4 py-3"
                    >
                      <div>
                        <div className="font-medium text-gray-900">
                          <Avatar
                            src={m.fromUserImage}
                            name={m.fromUserName}
                            size="md"
                          />
                          {m.fromUserName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(m.scheduleDate).toLocaleDateString(
                            "en-US",
                            {
                              timeZone: "America/New_York",
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}{" "}
                          · Officiant: {m.officiantName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/officiant-agreement?userId=${m.fromUserId}`,
                            )
                          }
                          className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-sm px-5 py-2 rounded-lg font-medium hover:from-orange-500 hover:to-yellow-500 transition-all"
                        >
                          Manage Agreement
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  ongoingCeremonies.slice(0, 3).map((m) => (
                    <div
                      key={m._id}
                      className="flex items-center justify-between border border-primary rounded-lg px-4 py-3"
                    >
                      <div>
                        <div className="font-medium flex gap-3 text-lg items-center text-gray-900">
                          <Avatar
                            src={m.fromUserImage}
                            name={m.fromUserName}
                            size="xl"
                          />
                          {m.fromUserName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(m.scheduleDate).toLocaleDateString(
                            "en-US",
                            {
                              timeZone: "America/New_York",
                              weekday: "short",
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            },
                          )}{" "}
                          · Officiant: {m.officiantName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            navigate(
                              `/dashboard/officiant-agreement?userId=${m.fromUserId}`,
                            )
                          }
                          className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white text-sm px-5 py-2 rounded-lg font-medium hover:from-orange-500 hover:to-yellow-500 transition-all"
                        >
                          Manage Agreement
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-xl border border-primary p-6 mb-8 lg:w-1/2">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-4xl font-primary font-bold text-gray-900">
                  Past Ceremonies
                </h2>
                {completedCeremonies.length > 3 && (
                  <button
                    onClick={() => toggleShowFullList(3)}
                    className="text-primary font-medium border-[1px] border-primary rounded-lg py-2 px-5 text-sm cursor-pointer"
                  >
                    {!seeFullCeremonies ? "Show All" : "Show Less"}
                  </button>
                )}
              </div>
              <div className="space-y-4">
                {completedCeremonies.length === 0 ? (
                  <div>
                    <p className="py-5 text-center">No past ceremonies</p>
                    <p className="text-3xl text-center">📉</p>
                  </div>
                ) : seeFullCeremonies ? (
                  completedCeremonies.map((m) => (
                    <div
                      key={m._id}
                      className="flex  flex-col md:flex-row gap-5 items-center justify-between border border-primary rounded-lg px-4 py-3"
                    >
                      <div className="font-medium flex gap-2 items-center text-gray-900">
                        <Avatar
                          src={getImage(m.userId)}
                          name={m.title}
                          size="lg"
                        />

                        {m.title}
                      </div>
                      <p className="font-bold py-1 px-3 rounded-full border-amber-500 border-2">
                        value : ${m.price}
                      </p>
                      <div className="text-sm text-gray-500">
                        {new Date(m.eventDate).toLocaleDateString("en-US", {
                          timeZone: "America/New_York",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · Officiant: {m.officiantName}
                      </div>
                    </div>
                  ))
                ) : (
                  completedCeremonies.slice(0, 3).map((m) => (
                    <div
                      key={m._id}
                      className="flex  flex-col md:flex-row gap-5 items-center justify-between border border-primary rounded-lg px-4 py-3"
                    >
                      <div className="font-medium flex gap-2 items-center text-gray-900">
                        <Avatar
                          src={getImage(m.userId)}
                          name={m.title}
                          size="lg"
                        />

                        {m.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(m.eventDate).toLocaleDateString("en-US", {
                          timeZone: "America/New_York",
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}{" "}
                        · Officiant: {m.officiantName}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Bookings;
