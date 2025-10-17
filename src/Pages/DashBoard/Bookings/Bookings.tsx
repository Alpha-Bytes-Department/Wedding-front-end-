import { useEffect, useState } from "react";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useAuth } from "../../../Component/Providers/AuthProvider";
// import { useNavigate } from "react-router-dom";
import PdfMaker from "../../../Component/PDFGenerator/PdfMaker";
import GlassSwal from "../../../utils/glassSwal";
// import { get } from "http";

interface Booking {
  _id: string;
  fromUserId: string;
  approvedStatus: string;
  fromUserName: string;
  fromUserImage: string;
  scheduleDate: string;
  officiantName: string;
  message?: string;
}

interface Ceremony {
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
    []
  );
  const [seeFullCeremonies, setSeeFullCeremonies] = useState(false);
  const [seeOngoingCeremonies, setSeeOngoingCeremonies] = useState(false);
  const { user } = useAuth();

  const toggleShowFullList = (id: number) => {
    switch (id) {
      case 1:
        setShowFullList(!showFullList);
        break;
      case 2:
        setSeeFullCeremonies(!seeFullCeremonies);
        break;
      case 3:
        setSeeOngoingCeremonies(!seeOngoingCeremonies);
        break;
    }
  };
  // const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const axios = useAxios();
  const fetchBookings = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/schedule/get-officiant/${user?._id}`);
      setBookings(
        response.data.filter(
          (booking: Booking) => booking.approvedStatus === "pending"
        )
      );
      setOngoingCeremonies(
        response.data.filter(
          (booking: Booking) => booking.approvedStatus === "approved"
        )
      );
      console.log('Bookings:', response.data);
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
          event.status === "completed" && event.officiantId === user?._id
      );
      console.log('Response Data:', response.data.events);
      
      const ongoing = response.data.events.filter(
        (event: any) =>
          event.status == "approved" && event.officiantId === user?._id
      );

      setCompletedCeremonies(completed);

      //console.log('Completed Ceremonies:', completed);
      console.log('Ongoing Ceremonies:', ongoing);
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
        `You are about to ${approvedStatus} this booking.`
      );
      if (confirmed.isConfirmed) {
        const response = await axios.put(`/schedule/update/${id}`, {
          approvedStatus,
        });
        await GlassSwal.success("Booking updated successfully", "success");
        console.log('Booking updated:', response.data);
      }
      fetchBookings(); // Refresh the bookings list
    } catch (error) {
      await GlassSwal.error(
        "Failed to update booking. Please try again later.",
        "error"
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

  const getImage=(id:string)=>{
    const event = ongoingCeremonies.find(
      (event: any) => event.fromUserId === id
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
                        <img
                          src={getProfileImageUrl(m?.fromUserImage)}
                          alt={m.fromUserName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {m.fromUserName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(m.scheduleDate).toLocaleDateString("en-GB")} ·
                        Officiant: {m.officiantName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
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
                        <img
                          src={getProfileImageUrl(m?.fromUserImage)}
                          alt={m.fromUserName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        {m.fromUserName}
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(m.scheduleDate).toDateString()} · Officiant:{" "}
                        {m.officiantName}
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
                          <img
                            src={m.fromUserImage}
                            className="size-10"
                            alt={m.fromUserName}
                          />
                          {m.fromUserName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(m.scheduleDate).toDateString()} · Officiant:{" "}
                          {m.officiantName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* <button
                          onClick={() => navigate("/dashboard/discussions")}
                          className="bg-[#D4AF371A] text-[#91c21f] border-1 border-primary text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 hover:text-white transition-colors"
                        >
                          Go Chat
                        </button> */}
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
                          <img
                            src={m.fromUserImage}
                            className="size-16 rounded-full"
                            alt={m.fromUserName}
                          />
                          {m.fromUserName}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(m.scheduleDate).toDateString()} · Officiant:{" "}
                          {m.officiantName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* <button
                          onClick={() => navigate("/dashboard/discussions")}
                          className="bg-[#D4AF371A] text-[#91c21f] border-1 border-primary text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 hover:text-white transition-colors"
                        >
                          Go Chat
                        </button> */}
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
                ) : !seeFullCeremonies ? (
                  completedCeremonies.map((m) => (
                    <div
                      key={m._id}
                      className="flex flex-col md:flex-row gap-5 items-center justify-between border border-primary rounded-lg px-4 py-3"
                    >
                      <div>
                        <div className="font-medium flex gap-2 items-center text-gray-900">
                          <img
                            src={getImage(m.userId)}
                            className="size-12 rounded-full"
                            alt=""
                          />
                          {m.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(m.eventDate).toLocaleDateString("en-GB")} ·
                          Officiant: {m.officiantName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <PdfMaker eventId={m._id} />
                        {/* <button className="bg-[#D4AF371A] border-1 border-primary text-primary text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                        </button> */}
                      </div>
                    </div>
                  ))
                ) : (
                  completedCeremonies.slice(0, 3).map((m) => (
                    <div
                      key={m._id}
                      className="flex  flex-col md:flex-row gap-5 items-center justify-between border border-primary rounded-lg px-4 py-3"
                    >
                      <div>
                        <div className="font-medium flex gap-2 items-center text-gray-900">
                          <img
                            src={getImage(m.userId)}
                            className="size-12 rounded-full"
                            alt=""
                          />
                          {m.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {new Date(m.eventDate).toLocaleDateString("en-GB")} ·
                          Officiant: {m.officiantName}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <PdfMaker eventId={m._id} />
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
