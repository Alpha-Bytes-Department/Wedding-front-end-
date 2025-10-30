import React from "react";
import { FaUsers, FaUserTie, FaFileAlt } from "react-icons/fa";

interface TabNavigationProps {
  activeTab: "users" | "officiants" | "applications";
  onTabChange: (tab: "users" | "officiants" | "applications") => void;
}

const TabNavigation: React.FC<TabNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    {
      id: "users" as const,
      label: "Users",
      icon: FaUsers,
    },
    {
      id: "officiants" as const,
      label: "Officiants",
      icon: FaUserTie,
    },
    {
      id: "applications" as const,
      label: "Applications",
      icon: FaFileAlt,
    },
  ];

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-8 px-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 transition-colors ${
              activeTab === tab.id
                ? "border-indigo-600 text-indigo-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            <tab.icon />
            <span>{tab.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default TabNavigation;
