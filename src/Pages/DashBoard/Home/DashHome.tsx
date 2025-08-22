const DashHome = () => {
  return (
    <div className="space-y-6">
      {/* Dashboard Header */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard Home
        </h1>
        <p className="text-gray-600">Welcome Back! Lisa & Asif.</p>

        <div className="mt-6 flex flex-wrap gap-4">
          <button className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2">
            <span>Start A new Ceremony</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
          <button className="bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-medium transition-colors duration-200">
            Continue Editing
          </button>
        </div>
      </div>

      {/* Notifications */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-start space-x-3 p-3 bg-orange-50 rounded-lg">
            <span className="bg-orange-200 text-orange-800 px-2 py-1 rounded text-xs font-medium">
              Note
            </span>
            <p className="text-sm text-gray-700">
              Your Officiant has been view and give a note on Beach Minimal.
            </p>
          </div>

          <div className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
            <span className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-medium">
              Approved
            </span>
            <p className="text-sm text-gray-700">
              Your Officiant has been give a note on Beach Minimal.
            </p>
          </div>
        </div>
      </div>

      {/* Past Ceremonies */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">
            Past Ceremonies
          </h2>
          <button className="text-yellow-600 hover:text-yellow-700 font-medium">
            Show All
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Garden Vows-Sunset</h3>
              <p className="text-sm text-gray-500">
                2024-09-21 • Officiant: Alex Rivera
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold text-gray-900">50</span>
                <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-green-500"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  View
                </button>
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  Edit
                </button>
                <button className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                  Download PDF
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
            <div>
              <h3 className="font-medium text-gray-900">Garden Vows-Sunset</h3>
              <p className="text-sm text-gray-500">
                2024-09-21 • Officiant: Alex Rivera
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <span className="text-2xl font-bold text-gray-900">50</span>
                <div className="w-8 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-1/2 h-full bg-green-500"></div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  View
                </button>
                <button className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50">
                  Edit
                </button>
                <button className="px-4 py-2 text-sm bg-yellow-500 text-white rounded-lg hover:bg-yellow-600">
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashHome;
