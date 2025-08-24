import { useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
type ProgressCircleProps = {
  percentage: number;
};
const  DashHome = () => {
  const [showingAll,setShowingAll] = useState(false);
  const toggleShowAll = () => {
    setShowingAll(!showingAll);
  };

  const ceremonies = [
    { id: 1, name: "Garden Vows-Sunset", date: "2024-09-21", officiant: "Alex Rivera" , complete: 20},
    { id: 2, name: "Beach Bliss", date: "2024-08-15", officiant: "Maria Lopez", complete: 50 },
    { id: 3, name: "Mountain Retreat", date: "2024-07-10", officiant: "John Smith", complete: 75 },
    { id: 4, name: "Desert Dreams", date: "2024-06-05", officiant: "Emily Davis", complete: 90 },
    { id: 5, name: "Beach Minimal", date: "2024-05-01", officiant: "Michael Johnson", complete: 90 },
  ];
  return (
    <div className="space-y-6">
      <div className=" flex flex-col lg:flex-row gap-6 lg:gap-10">
        {/* Dashboard Header */}
        <div className="bg-white w-full lg:w-5/7 shadow-xl rounded-2xl border border-primary py-14 flex flex-col text-center items-center justify-between">
          <div>
            <h1 className="text-2xl lg:text-4xl font-semibold font-primary text-gray-900 mb-2">
              Dashboard Home
            </h1>
            <p className="text-black-web font-secondary text-lg lg:text-xl">
              Welcome Back! Lisa & Asif.
            </p>
          </div>
          <div className="mt-6 flex flex-col lg:flex-row gap-4 mx-auto ">
            <button className="bg-primary group text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
              <span>Start A new Ceremony</span>
              <MdKeyboardArrowRight
                className="group-hover:translate-x-3 transition-transform duration-200"
                size={20}
              />
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
              Continue Editing
            </button>
          </div>
        </div>
        {/* Notifications */}
        <div className="bg-white w-full lg:w-2/7 shadow-xl rounded-2xl flex flex-col items-center justify-center border border-primary p-6 ">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl lg:text-4xl font-primary  font-semibold text-gray-900">
              Notifications
            </h2>
          </div>
          <div className="space-y-3  lg:py-4 p-2 max-h-60 py-5 overflow-y-auto">
            <div className="flex items-center space-x-3 p-3  rounded-2xl border border-primary">
              <span className="bg-[#D4AF371A]  text-primary border border-primary px-2 py-1 rounded-2xl text-xs font-secondary font-semibold">
                Note
              </span>
              <p className="text-sm text-gray-700">
                Your Officiant has been view and give a note on Beach Minimal.
              </p>
            </div>
            <div className="flex items-center space-x-3 p-3  rounded-2xl border border-primary">
              <span className="bg-green-200 text-green-500  border border-green-600 px-2 py-1 rounded-2xl text-xs font-secondary font-semibold">
                Approved
              </span>
              <p className="text-sm text-gray-900">
                Your Officiant has been give a note on Beach Minimal.
              </p>
            </div>
            <div className="flex items-center space-x-3 p-3  rounded-2xl border border-primary">
              <span className="bg-green-200 text-green-500  border border-green-600 px-2 py-1 rounded-2xl text-xs font-secondary font-semibold">
                Approved
              </span>
              <p className="text-sm text-gray-900">
                Your Officiant has been give a note on Beach Minimal.
              </p>
            </div>
            <div className="flex items-center space-x-3 p-3  rounded-2xl border border-primary">
              <span className="bg-green-200 text-green-500  border border-green-600 px-2 py-1 rounded-2xl text-xs font-secondary font-semibold">
                Approved
              </span>
              <p className="text-sm text-gray-900">
                Your Officiant has been give a note on Beach Minimal.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Past Ceremonies */}
      <div className="bg-white rounded-2xl border border-primary shadow-xl p-6 ">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl lg:text-4xl font-primary text-start font-semibold  text-gray-900">
            Past Ceremonies
          </h2>
          <button
            onClick={toggleShowAll}
            className="text-yellow-600 font-Secondary hover:text-yellow-700 font-medium"
          >
            Show All
          </button>
        </div>

        <div className={`space-y-4 px-3  ${showingAll ? 'lg:max-h-80 overflow-y-auto' : ''}`}>
          {(showingAll ? ceremonies : ceremonies.slice(0, 3)).map((ceremony) => (
            <div
              key={ceremony.id}
              className="flex items-start gap-6 flex-col lg:flex-row justify-between p-4 border lg:items-center border-primary rounded-2xl"
            >
              <div>
                <h3 className="font-medium text-gray-900 text-xl lg:text-2xl font-primary">
                  {ceremony.name}
                </h3>
                <p className="text-base text-gray-500 font-secondary">
                  {ceremony.date} • Officiant: {ceremony.officiant}
                </p>
              </div>
              <div className="flex justify-center flex-col space-y-3 lg:flex-row items-center space-x-2">
                <ProgressCircle percentage={ceremony.complete} />
                <div className="flex space-x-2">
                  <button className="px-4 py-1 lg:py-2 text-sm border border-primary rounded-2xl hover:bg-gray-50">
                    View
                  </button>
                  <button className="px-4 py-1 lg:py-2 text-sm border border-primary rounded-2xl hover:bg-gray-50">
                    Edit
                  </button>
                  <button className="px-4 py-1 lg:py-2 text-sm bg-primary border border-primary rounded-2xl text-white">
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
};



// progress circle component========================================
const ProgressCircle = ({ percentage }: ProgressCircleProps) => {
  const radius = 24;
  const stroke = 5;
  const normalizedRadius = radius - stroke / 2;
  const circumference = 2 * Math.PI * normalizedRadius;
  const strokeDashoffset =
    circumference - (percentage / 100) * circumference;

  return (
    <svg height={radius * 2} width={radius * 2}>
      <circle
      stroke="#D4AF37"
      fill="none"
      strokeWidth={stroke}
      cx={radius}
      cy={radius}
      r={normalizedRadius}
      style={{ opacity: 0.2 }}
      />
      <circle
      stroke="#D4AF37"
      fill="none"
      strokeWidth={stroke}
      cx={radius}
      cy={radius}
      r={normalizedRadius}
      strokeDasharray={circumference}
      strokeDashoffset={strokeDashoffset}
      strokeLinecap="round"
      style={{ transition: "stroke-dashoffset 0.5s" }}
      transform={`rotate(-90 ${radius} ${radius})`}
      />
      <text
      x="50%"
      y="50%"
      textAnchor="middle"
      dy=".3em"
      fontSize="1rem"
      fill="#D4AF37"
      fontWeight="bold"
      >
      {percentage}%
      </text>
    </svg>
  );
};

export default DashHome;
