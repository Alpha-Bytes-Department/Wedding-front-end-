import { useForm } from "react-hook-form";

const officiants = [
  {
    id: 1,
    name: "Alex Rivera",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    experience: 15,
    rating: 4.9,
    reviews: 120,
    status: "Available",
  },
  {
    id: 2,
    name: "Alex Rivera",
    avatar: "https://randomuser.me/api/portraits/men/33.jpg",
    experience: 5,
    rating: 4.9,
    reviews: 120,
    status: "Available",
  },
  {
    id: 3,
    name: "Alex Rivera",
    avatar: "https://randomuser.me/api/portraits/men/34.jpg",
    experience: 3,
    rating: 4.9,
    reviews: 120,
    status: "Available",
  },
];

const ceremonies = [
  { id: 1, name: "Sunset Wedding" },
  { id: 2, name: "Beach Bliss" },
];

const packages = [
  { id: 1, name: "Classic" },
  { id: 2, name: "Premium" },
];

const upcomingMeetings = [
  {
    id: 1,
    name: "Garden Vows-Sunset",
    date: "2024-09-21",
    officiant: "Alex Rivera",
    status: "Confirmed",
  },
  {
    id: 2,
    name: "Garden Vows-Sunset",
    date: "2024-09-21",
    officiant: "Alex Rivera",
    status: "Awaiting for link",
  },
];
const pastMeetings = [
  {
    id: 1,
    name: "Garden Vows-Sunset",
    date: "2024-09-21",
    officiant: "Alex Rivera",
  },
  {
    id: 2,
    name: "Garden Vows-Sunset",
    date: "2024-09-21",
    officiant: "Alex Rivera",
  },
];

const Schedule = () => {
  const { register, handleSubmit, reset } = useForm();
  const onSubmit = (data: any) => {
    console.log(data);
    reset();
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
                {...register("ceremony")}
                className="w-full border border-primary rounded-lg px-4 py-2 focus:outline-none"
              >
                {ceremonies.map((c) => (
                  <option key={c.id} value={c.name}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block font-medium mb-1">Date</label>
                <input
                  type="date"
                  {...register("date")}
                  className="w-full border border-primary rounded-lg px-4 py-2 focus:outline-none"
                />
              </div>
              <div className="flex-1">
                <label className="block font-medium mb-1">Time</label>
                <input
                  type="time"
                  {...register("time")}
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
                <button type="button" className="text-primary font-medium">
                  Show All Officiant
                </button>
              </div>
              <select
                {...register("officiant")}
                className="w-full border border-primary rounded-lg px-4 py-2 focus:outline-none"
              >
                {officiants.map((o) => (
                  <option key={o.id} value={o.name}>
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
              <div className="space-y-2">
                {officiants.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center gap-3 border border-primary rounded-lg px-3 py-2"
                  >
                    <img
                      src={o.avatar}
                      alt={o.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900 truncate">
                        {o.name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Custom Ceremonies, {o.experience} years of experience
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {o.rating} ({o.reviews} reviews) 11:30-2:00
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 text-xs rounded-full border bg-white text-green-700 border-green-400`}
                    >
                      {o.status}
                    </span>
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
          {upcomingMeetings.map((m) => (
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
                {m.status === "Awaiting for link" && (
                  <span className="px-3 py-1 text-xs rounded-full border bg-white text-yellow-700 border-yellow-400">
                    Awaiting for link
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

      {/* Past Booking */}
      <div className="bg-white rounded-2xl shadow-xl border border-primary p-6 ">
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
      </div>
    </div>
  );
};

export default Schedule;
