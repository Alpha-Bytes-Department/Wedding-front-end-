interface TabNavigationProps {
  activeTab: "new" | "draft" | "my";
  onTabChange: (tab: "new" | "draft" | "my") => void;
}

const TabNavigation = ({ activeTab, onTabChange }: TabNavigationProps) => {
  const tabs = [
    { key: "new" as const, label: "New Ceremony" },
    { key: "draft" as const, label: "Draft" },
    { key: "my" as const, label: "My Ceremony" },
  ];

  return (
    <div className="mb-8 flex justify-center items-center">
      <div className="">
        <nav className="-mb-px flex space-x-2 lg:space-x-8 md:space-x-8 sm">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => onTabChange(tab.key)}
              className={`py-2 rounded-2xl px-3 border-2 cursor-pointer font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? "border-primary text-white bg-primary"
                  : "border-gray-200 text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default TabNavigation;
