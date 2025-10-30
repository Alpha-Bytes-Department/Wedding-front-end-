import React from "react";
import {
  FaUsers,
  FaUserTie,
  FaFileAlt,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import type { UserStats } from "./types";

interface StatsCardsProps {
  stats: UserStats;
}

const StatsCards: React.FC<StatsCardsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
        <div className="flex items-center">
          <FaUsers className="text-blue-500 text-2xl mr-3" />
          <div>
            <p className="text-sm text-gray-600">Total Users</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalUsers}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
        <div className="flex items-center">
          <FaCheck className="text-green-500 text-2xl mr-3" />
          <div>
            <p className="text-sm text-gray-600">Verified</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.verifiedUsers}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
        <div className="flex items-center">
          <FaUserTie className="text-purple-500 text-2xl mr-3" />
          <div>
            <p className="text-sm text-gray-600">Officiants</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.totalOfficiants}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-yellow-500">
        <div className="flex items-center">
          <FaFileAlt className="text-yellow-500 text-2xl mr-3" />
          <div>
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.pendingApplications}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-600">
        <div className="flex items-center">
          <FaCheck className="text-green-600 text-2xl mr-3" />
          <div>
            <p className="text-sm text-gray-600">Approved</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.approvedApplications}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow border-l-4 border-red-500">
        <div className="flex items-center">
          <FaTimes className="text-red-500 text-2xl mr-3" />
          <div>
            <p className="text-sm text-gray-600">Rejected</p>
            <p className="text-2xl font-bold text-gray-900">
              {stats.rejectedApplications}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;
