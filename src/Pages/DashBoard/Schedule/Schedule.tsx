import { useForm } from "react-hook-form";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useEffect, useState } from "react";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import GlassSwal from "../../../utils/glassSwal";
import { Link, useNavigate } from "react-router-dom";
interface OfficiantProfile {
  _id: string;
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  location: string;
  bio: string;
  specialization: string;
  profilePicture: string;
  role: string;
  availability: boolean;
  isVerified: boolean;
  bookingMoney: number;
  languages: string[];
  partner_1: string | null;
  partner_2: string | null;
  weddingDate: string | null;
  refreshToken: string | null;
  createdAt: string;
  updatedAt: string;
}
interface scheduleEvent {
  _id: string;
  name: string;
  date: string;
  time: string;
  officiant: string;
  status: string;
  approvedStatus?: string;
  officiantImage?: string;
}

const Schedule = () => {
  const axios = useAxios();
  const { user } = useAuth();
  const { register, handleSubmit, reset } = useForm();
  const [schedule, setSchedule] = useState<scheduleEvent[]>([]);
  const navigate = useNavigate();
  const [officiants, setOfficiants] = useState<OfficiantProfile[]>([]);
  const profileComplete =
    user?.name &&
    user?.partner_1 &&
    user?.partner_2 &&
    user?.contact?.partner_1 &&
    user?.contact?.partner_2 &&
    user?.location &&
    user?.weddingDate &&
    user?.needRehearsal !== null &&
    (user?.needRehearsal === false ||
      (user?.needRehearsal === true && user?.rehearsalDate));

  useEffect(() => {
    getOfficiants();

    getSchedule();
  }, []);

  const getOfficiants = async () => {
    try {
      const response = await axios.get("/users/officiants");
      console.log(response.data);
      setOfficiants(response.data.officiants);
    } catch (error) {
      console.error("Error fetching officiants:", error);
    }
  };

  const getSchedule = async () => {
    try {
      const response = await axios.get(`/schedule/get/${user?._id}`);
      const data = response.data.map((s: any) => ({
        _id: s._id,
        name: s.fromUserName,
        date: s.scheduleDate,
        time: s.scheduleDateTime,
        officiant: s.officiantName,
        status: s.approvedStatus,
        officiantImage: s.officiantImage,
      }));
      console.log(data);
      setSchedule(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const onSubmit = async (data: any) => {
    console.log(data);

    const scheduledData = {
      fromUserId: user?._id,
      fromUserName: user?.name || user?.partner_1,
      fromUserImage: user?.profilePicture || "",
      scheduleDate: data.date,
      scheduleDateTime: data.time,
      officiantName: data.officiant ? JSON.parse(data.officiant).name : "",
      officiantImage: data.officiant
        ? JSON.parse(data.officiant).profilePicture
        : "",
      officiantId: data.officiant ? JSON.parse(data.officiant).id : "",
      message: data.note || "",
    };
    console.log(scheduledData);
    try {
      const response = await axios.post("/schedule/create", scheduledData);
      console.log("Event scheduled successfully:", response.data);
      await GlassSwal.success("Success", "Event scheduled successfully");
      getSchedule();
      reset();
    } catch (error) {
      await GlassSwal.error("Error", "Failed to schedule event");
    }

    // reset();
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

  if (user?.role !== "user") {
    return (
      <div className="text-center py-20">
        <h2 className="text-3xl font-primary font-bold mb-4">Access Denied</h2>
        <p className="text-gray-600">
          You do not have permission to view this page.
        </p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <h1 className="text-3xl font-primary font-bold text-gray-900 mb-6">
        Book an Officiant for Your Wedding
      </h1>

      {/* Book Officiant */}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl  border border-primary p-6 mb-8 shadow-xl"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-8">
          {/* Left */}
          {profileComplete ? (
            <div className="flex-1 space-y-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block font-medium">Select Officiant</label>
                </div>
                <select
                  {...register("officiant")}
                  className="w-full border border-primary cursor-pointer rounded-lg px-4 py-2 focus:outline-none"
                >
                  <option value="">Select Officiant</option>
                  {officiants.map((o) => (
                    <option
                      disabled={!o.availability}
                      key={o._id}
                      value={JSON.stringify({
                        id: o._id,
                        name: o.name,
                        profilePicture: o.profilePicture,
                      })}
                    >
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-4 flex-col md:flex-row">
                <div className="flex-1">
                  <label className="block font-medium mb-1">Date</label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    {...register("date", {
                      required: "Meeting date is required",
                    })}
                    className="w-full border border-primary rounded-lg px-4 py-2 focus:outline-none"
                  />
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1">Time</label>
                  <input
                    type="time"
                    {...register("time", {
                      required: "Meeting time is required",
                    })}
                    className="w-full border border-primary rounded-lg px-4 py-2 focus:outline-none"
                  />
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1">
                  Note to Officiant
                </label>
                <textarea
                  {...register("note")}
                  className="w-full border border-primary rounded-lg px-4 py-2 focus:outline-none min-h-[48px]"
                  placeholder="Share any notes, description or template"
                />
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-start  gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <svg
                  className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <div className="flex-1">
                  <h3 className="font-semibold text-amber-900 mb-1">
                    Profile Incomplete
                  </h3>
                  <p className="text-sm text-amber-800">
                    Please complete your profile before booking an officiant. Make sure to
                    fill in all required details including location, wedding date, and
                    rehearsal information.
                  </p>
                  <Link
                    to="/dashboard/settings"
                    className="mt-3 text-sm font-medium text-amber-700 cursor-pointer hover:text-amber-900 underline"
                  >
                    Complete Profile →
                  </Link>
                </div>
              </div>
            </div>
          )}

          {/* Right */}
          <div className="flex-1 space-y-4 mt-8 md:mt-0">
            <div>
              <label className="block font-medium mb-1">Suggest Matches</label>
              <div className="space-y-2 overflow-y-scroll max-h-60">
                {officiants.map((o) => (
                  <div
                    key={o?._id}
                    className="flex items-center gap-3 border border-primary rounded-lg px-3 py-2"
                  >
                    <img
                      src={getProfileImageUrl(o?.profilePicture)}
                      alt={o?.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium flex  justify-between text-gray-900 truncate">
                        <p>{o?.name}</p>
                        <p
                          className={`px-2 py-1 text-xs font-bold italic rounded-full ${
                            o?.availability
                              ? "bg-yellow-200 text-green-600 border border-green-300"
                              : "bg-gray-100 text-slate-500 border border-red-300"
                          }`}
                        >
                          {o?.availability ? "Available" : "Unavailable"}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {o?.specialization},{" "}
                        {(() => {
                          const d = new Date(o?.createdAt);
                          if (Number.isNaN(d.getTime()))
                            return "1 year of experience";
                          const years = Math.floor(
                            (Date.now() - d.getTime()) /
                              (1000 * 60 * 60 * 24 * 365.25)
                          );
                          const y = Math.max(1, years);
                          const label = y === 1 ? "year" : "years";
                          return `${y} ${label} of experience`;
                        })()}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {o?.languages.join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-end mt-6">
          <button
            disabled={!profileComplete}
            type="submit"
            className="bg-amber-500 disabled:bg-gray-400 disabled:opacity-30 text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-primary/90 transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </form>

      {/* Upcoming Meeting */}
      <div className="bg-white rounded-2xl shadow-xl border border-primary p-6 mb-8 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-primary font-bold text-gray-900">
            My Bookings
          </h2>
          {schedule.length > 3 && (
            <button className="text-primary font-medium">Show All</button>
          )}
        </div>
        <div className="space-y-4">
          {schedule.length > 0 ? (
            schedule.map((m) => (
              <div
                key={m._id}
                className="flex items-center justify-between border border-primary rounded-lg px-4 py-3"
              >
                <div>
                  <div className="font-medium text-gray-900 flex gap-4">
                    <img
                      src={getProfileImageUrl(m?.officiantImage || "")}
                      alt={m.officiant}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <p>Officiant : {m.officiant}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(m.date).toDateString()} ·{" "}
                    <span className="font-medium">Client:</span> {m.name}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 text-xs rounded-full border bg-white text-yellow-700 border-yellow-400">
                    {m.status}
                  </span>
                  {m.status === "approved" && (
                    <button
                      onClick={() => navigate(`/dashboard/agreement/${m._id}`)}
                      className="bg-gradient-to-r from-orange-400 to-yellow-400 text-white px-5 py-2 rounded-lg font-medium hover:from-orange-500 hover:to-yellow-500 transition-all"
                    >
                      View Agreement
                    </button>
                  )}
                  <button
                    onClick={() => navigate(`/dashboard/discussions`)}
                    className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors"
                  >
                    Go Chat
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">
                Please add a booking request
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Schedule;
