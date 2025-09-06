import { useState } from "react";

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

const Bookings = () => {

    
  return (
    <div>
      <h1>This is booking route</h1>
        <div className="bg-white rounded-2xl shadow-xl border border-primary p-6 mb-8 ">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-4xl font-primary font-bold text-gray-900">
            Booking Requests
          </h2>
          <button className="text-primary font-medium border-[1px] border-primary rounded-lg py-2 px-5 text-sm cursor-pointer">Show All</button>
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
                  <button className="bg-primary text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Accept
                </button>
                )}
                {m.status === "Awaiting for link" && (
                  <button className="bg-primary text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Accept
                </button>
                )}
                <button className="bg-[#AF4B4B4D] text-[#AF4B4B] text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/*Second Card*/}
     <div className="lg:flex gap-6 mt-16 px ">
  <div className="bg-white rounded-2xl shadow-xl border border-primary p-6 mb-8 lg:w-1/2">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-4xl font-primary font-bold text-gray-900">
        Ongoing
      </h2>
        <button className="text-primary font-medium border-[1px] border-primary rounded-lg py-2 px-5 text-sm cursor-pointer">Show All</button>
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
              <button className="bg-primary text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Review
              </button>
            )}
            {m.status === "Awaiting for link" && (
              <button className="bg-primary text-white text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Review
              </button>
            )}
           <button className="bg-[#D4AF371A] text-primary border-1 border-primary text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Go Chat
              </button>
          </div>
        </div>
      ))}
    </div>
  </div>

  <div className="bg-white rounded-2xl shadow-xl border border-primary p-6 mb-8 lg:w-1/2">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-4xl font-primary font-bold text-gray-900">
        Past
      </h2>
        <button className="text-primary font-medium border-[1px] border-primary rounded-lg py-2 px-5 text-sm cursor-pointer">Show All</button>
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
              <button className="bg-[#D4AF371A] border-1 border-primary text-primary text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Download PDF
              </button>
            )}
            {m.status === "Awaiting for link" && (
              <button className="bg-[#D4AF371A] text-primary border-1 border-primary text-sm px-5 py-2 rounded-lg font-medium hover:bg-primary/90 transition-colors">
                Download PDF
              </button>
            )}
            
          </div>
        </div>
      ))}
    </div>
  </div>
</div>
    </div>
  )
}

export default Bookings
