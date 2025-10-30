import React from "react";
import { FaSearch, FaFilter } from "react-icons/fa";

interface SearchFilterProps {
  searchTerm: string;
  onSearchChange: (term: string) => void;
  filterStatus: string;
  onFilterChange: (status: string) => void;
  activeTab: "users" | "officiants" | "applications";
}

const SearchFilter: React.FC<SearchFilterProps> = ({
  searchTerm,
  onSearchChange,
  filterStatus,
  onFilterChange,
  activeTab,
}) => {
  return (
    <div className="p-6 border-b border-gray-200">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
          />
        </div>

        <div className="flex items-center space-x-2">
          <FaFilter className="text-gray-400" />
          <select
            value={filterStatus}
            onChange={(e) => onFilterChange(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
          >
            <option value="all">All Status</option>
            {activeTab === "applications" ? (
              <>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </>
            ) : (
              <>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </>
            )}
          </select>
        </div>
      </div>
    </div>
  );
};

export default SearchFilter;
