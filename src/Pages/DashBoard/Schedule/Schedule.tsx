import { useForm } from "react-hook-form";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useEffect, useState } from "react";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import GlassSwal from "../../../utils/glassSwal";


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
  allowDownload: boolean;
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
interface scheduleEvent{
  id: string;
  name: string;
  date: string;
  time: string;
  officiant: string;
  status: string;
}

const ceremonies = [
  { id: 1, name: "Sunset Wedding" },
  { id: 2, name: "Beach Bliss" },
];


const packages = [
  { id: 1, name: "Classic" },
  { id: 2, name: "Premium" },
];




const Schedule = () => {
  const axios = useAxios();
  const {user}=useAuth()
  const { register, handleSubmit, reset } = useForm();
  const [events, setEvents] = useState([]);
  const [schedule, setSchedule] = useState<scheduleEvent[]>([]);
  const [officiants, setOfficiants] = useState<OfficiantProfile[]>([]);

  useEffect(() => {
    getOfficiants();
    getEvents()
    getSchedule()
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

const getEvents = async () => {
    try {
      const response = await axios.get(`/events/by-role/${user?._id}/${user?.role}`);
      setEvents(response.data.events);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };
const getSchedule= async () => {
    try {
      const response = await axios.get(`/schedule/get/${user?._id}`);
      const data = response.data.map((s: any) => ({
        id: s._id,
        name: s.eventName,
        date: s.scheduleDate,
        time: s.scheduleDateTime,
        officiant: s.officiantName,
        status: s.approvedStatus ? "Confirmed" : "Pending",
      }));
      console.log(data);
      setSchedule(data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const onSubmit = async(data: any) => {
    console.log(data);
    const event= JSON.parse(data.ceremony || "{}");
    const scheduledData = {
      fromUserId: user?._id,
      fromUserName: user?.partner_1||user?.partner_2,
      eventId: event.id,
      eventName: event.title,
      scheduleDate: data.date,
      scheduleDateTime: data.time,
      scheduleStatus: 'later' === data.meetingType,
      officiantName: data.officiant ? JSON.parse(data.officiant).name : "",
      officiantImage: data.officiant ? JSON.parse(data.officiant).profilePicture : "",
      officiantId: data.officiant ? JSON.parse(data.officiant).id : "",
      message: data.note || "",
      packageName: data.package ,
      approvedStatus: false
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

  return (
    <div className="min-h-screen bg-white p-4 md:p-8">
      <div className="text-gray-500 text-sm mb-1">Dashboard / Schedule</div>
      <h1 className="text-3xl font-primary font-bold text-gray-900 mb-6">
        Schedule a Ceremony Meeting
      </h1>

      {/* Book Officiant */}
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white rounded-2xl  border border-primary p-6 mb-8 shadow-xl"
      >
        <div className="flex flex-col md:flex-row md:gap-8">
          {/* Left */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block font-medium mb-1">Select Ceremony</label>
              <select
                {...register("ceremony", { required: true })}
                className="w-full border border-primary rounded-lg px-4 py-2 focus:outline-none"
              >
                <option value="">-- Select Ceremony --</option>
                {events.map((c) => (
                  <option
                    key={c._id}
                    value={JSON.stringify({ id: c._id, title: c.title })}
                  >
                    {c.title}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4 flex-col md:flex-row">
              <div className="flex-1">
                <label className="block font-medium mb-1">Date</label>
                <input
                  type="date"
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
            <div>
              <label className="block font-medium mb-1">Meeting Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="now"
                    {...register("meetingType")}
                    className="accent-primary"
                  />
                  Book Now
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    value="later"
                    {...register("meetingType")}
                    className="accent-primary"
                  />
                  Schedule for Later
                </label>
              </div>
              <div className="text-xs text-gray-500 mt-1">
                *Officiant will provide the meeting link
              </div>
            </div>
          </div>
          {/* Right */}
          <div className="flex-1 space-y-4 mt-8 md:mt-0">
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-medium">Select Officiant</label>
              </div>
              <select
                {...register("officiant")}
                className="w-full border border-primary rounded-lg px-4 py-2 focus:outline-none"
              >
                <option value="">Select Officiant</option>
                {officiants.map((o) => (
                  <option
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
            <div>
              <label className="block font-medium mb-1">Package</label>
              <select
                {...register("package")}
                className="w-full border border-primary rounded-lg px-4 py-2 focus:outline-none"
              >
                {packages.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-medium mb-1">Suggest Matches</label>
              <div className="space-y-2 overflow-y-scroll max-h-60">
                {officiants.map((o) => (
                  <div
                    key={o._id}
                    className="flex items-center gap-3 border border-primary rounded-lg px-3 py-2"
                  >
                    <img
                      src={o.profilePicture}
                      alt={o.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {o.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {o.specialization},{" "}
                        {(() => {
                          const d = new Date(o.createdAt);
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
                        {o.languages.join(", ")}
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
            type="submit"
            className="bg-primary text-white px-6 py-2 rounded-lg font-medium shadow hover:bg-primary/90 transition-colors"
          >
            Confirm Booking
          </button>
        </div>
      </form>

      {/* Upcoming Meeting */}
      <div className="bg-white rounded-2xl shadow-xl border border-primary p-6 mb-8 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-primary font-bold text-gray-900">
            Upcoming Meeting
          </h2>
          <button className="text-primary font-medium">Show All</button>
        </div>
        <div className="space-y-4">
          {schedule.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between border border-primary rounded-lg px-4 py-3"
            >
              <div>
                <div className="font-medium text-gray-900">{m.name}</div>
                <div className="text-sm text-gray-500">
                  {m.date} · Officiant: {m.officiant}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {m.status === "Confirmed" && (
                  <span className="px-3 py-1 text-xs rounded-full border bg-white text-green-700 border-green-400">
                    Confirmed
                  </span>
                )}
                {m.status.toLocaleLowerCase() === "pending" && (
                  <span className="px-3 py-1 text-xs rounded-full border bg-white text-yellow-700 border-yellow-400">
                    Pending
                  </span>
                )}
                <button className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Go Chat
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* {/* Past Booking */}
      {/* <div className="bg-white rounded-2xl shadow-xl border border-primary p-6 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-primary font-bold text-gray-900">
            Past Booking
          </h2>
          <button className="text-primary font-medium">Show All</button>
        </div>
        <div className="space-y-4">
          {pastMeetings.map((m) => (
            <div
              key={m.id}
              className="flex items-center justify-between border border-primary rounded-lg px-4 py-3"
            >
              <div>
                <div className="font-medium text-gray-900">{m.name}</div>
                <div className="text-sm text-gray-500">
                  {m.date} · Officiant: {m.officiant}
                </div>
              </div>
              <button className="bg-primary text-white px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Downlode PDF
              </button>
            </div>
          ))}
        </div>
      </div>  */}
    </div>
  );
};

export default Schedule;
