import React, { useState, useEffect } from "react";
import { useAxios } from "../../../Component/Providers/useAxios";
import type {
  User,
  Officiant,
  OfficiantApplication,
  PaginationData,
  UserStats,
} from "./types";

// Import all the modular components
import StatsCards from "./StatsCards";
import TabNavigation from "./TabNavigation";
import UsersTable from "./UsersTable";
import OfficientsTable from "./OfficientsTable";
import ApplicationsTable from "./ApplicationsTable";
import { useAuth } from "../../../Component/Providers/AuthProvider";

type ActiveTab = "users" | "officiants" | "applications";

const UserManagement: React.FC = () => {
  const axios = useAxios();

  // State management
  const [activeTab, setActiveTab] = useState<ActiveTab>("users");
  const [users, setUsers] = useState<User[]>([]);
  const [officiants, setOfficiants] = useState<Officiant[]>([]);
  const [applications, setApplications] = useState<OfficiantApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Stats and pagination
  const [stats, setStats] = useState<UserStats>({
    totalUsers: 0,
    verifiedUsers: 0,
    totalOfficiants: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });

  const [pagination, setPagination] = useState<PaginationData>({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 5,
  });

  // Fetch all data and calculate stats
  const fetchAllData = async () => {
    try {
      // Fetch all users
      const usersResponse = await axios.get("/users/get-all-users");
      const eventResponse = await axios.get("/events/officiantAccess/all");
      const allUsers = usersResponse.data.users || [];

      // Fetch all applications
      const applicationsResponse = await axios.get("/applicants");
      const allApplications = applicationsResponse.data.applications || [];

      // Separate users by role
      const regularUsers = allUsers.filter((u: any) => u.role === "user");
      const officiants = allUsers.filter((u: any) => u.role === "officiant");
      const allEvents = eventResponse.data.events || [];
      // Calculate stats
      const calculatedStats = {
        totalUsers: regularUsers.length,
        verifiedUsers: regularUsers.filter((u: any) => u.isVerified === true)
          .length,
        totalOfficiants: officiants.length,
        pendingApplications: allApplications.filter(
          (a: any) => a.status === "pending"
        ).length,
        approvedApplications: allApplications.filter(
          (a: any) => a.status === "approved"
        ).length,
        rejectedApplications: allApplications.filter(
          (a: any) => a.status === "rejected"
        ).length,
      };

      //  Sort all events by creation time in ascending order
      allEvents.sort(
        (a: any, b: any) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );

      //  Create a hash map for users with empty events array
      const userMap = regularUsers.reduce((map: any, user: User) => {
        map[user._id] = { ...user, events: [] };
        return map;
      }, {});
      // Create a hash map for officiants with empty events array
      const officiantsHashMap = officiants.reduce(
        (map: any, officiant: Officiant) => {
          map[officiant._id] = { ...officiant, events: [] };
          return map;
        },
        {}
      );

      //  Assign events to the corresponding user based on userId
      allEvents.forEach((event: any) => {
        if (userMap[event.userId]) {
          userMap[event.userId].events.push(event);
        }
        if (officiantsHashMap[event.officiantId]) {
          officiantsHashMap[event.officiantId].events.push(event);
        }
      });

      // Convert userMap to an array and handle users with no events
      const UserDataWithEvents = Object.values(userMap).map((user: any) => ({
        ...user,
        events: user.events.length > 0 ? user.events : [],
      }));

      // Convert officiants map to array with events
      const OfficiantsDataWithEvents = Object.values(officiantsHashMap).map(
        (officiant: any) => ({
          ...officiant,
          events: officiant.events.length > 0 ? officiant.events : [],
        })
      );

      console.log("officiantsHashMap:", OfficiantsDataWithEvents);

      setStats(calculatedStats);

      return {
        regularUsers,
        UserDataWithEvents,
        OfficiantsDataWithEvents,
        allApplications,
      };
    } catch (error) {
      console.error("Error fetching all data:", error);
      return {
        regularUsers: [],
        UserDataWithEvents: [],
        OfficiantsDataWithEvents: [],
        allApplications: [],
      };
    }
  };

  const fetchData = async (page = 1) => {
    setLoading(true);
    try {
      // First fetch all data to calculate stats
      const { UserDataWithEvents, OfficiantsDataWithEvents, allApplications } =
        await fetchAllData();

      let data: any[] = [];

      // Select data based on active tab
      switch (activeTab) {
        case "users":
          data = UserDataWithEvents ?? [];
          break;
        case "officiants":
          data = OfficiantsDataWithEvents ?? [];
          break;
        case "applications":
          data = allApplications ?? [];
          break;
      }

      // Calculate pagination (10 items per page)
      const itemsPerPage = 10;
      const totalItems = data.length;
      const totalPages = Math.ceil(totalItems / itemsPerPage);
      const startIndex = (page - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      const paginatedData = data.slice(startIndex, endIndex);

      // Update state with paginated data
      switch (activeTab) {
        case "users":
          setUsers(paginatedData);
          break;
        case "officiants":
          setOfficiants(paginatedData);
          break;
        case "applications":
          setApplications(paginatedData);
          break;
      }

      setPagination({
        currentPage: page,
        totalPages: totalPages || 1,
        totalItems: totalItems,
        itemsPerPage: itemsPerPage,
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleTabChange = (tab: ActiveTab) => {
    setActiveTab(tab);
  };

  const handleRefresh = () => {
    fetchData(pagination.currentPage);
  };

  // Effects
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    fetchData(1);
  }, [activeTab]);

  if (
    user?.email !== "joysutradharaj@gmail.com" &&
    user?.email !== "steve@erieweddingofficiants.com"
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Access Denied
          </h2>
          <p className="text-gray-600">
            You do not have permission to access the User Management section.
          </p>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50 p-3">
      <div className="max-w-full lg:max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <p className="text-sm sm:text-base text-gray-600 mt-1 sm:mt-2">
            Manage users, officiants, and applications
          </p>
        </div>

        {/* Statistics Cards */}
        <StatsCards stats={stats} />

        {/* Tab Navigation */}
        <TabNavigation activeTab={activeTab} onTabChange={handleTabChange} />

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            <span className="ml-2 text-gray-600">Loading...</span>
          </div>
        )}

        {/* Tables */}
        {!loading && (
          <div className="mt-6">
            {activeTab === "users" && (
              <UsersTable
                users={users}
                onRefresh={handleRefresh}
                pagination={pagination}
                onPageChange={fetchData}
              />
            )}

            {activeTab === "officiants" && (
              <OfficientsTable
                officiants={officiants}
                onRefresh={handleRefresh}
                pagination={pagination}
                onPageChange={fetchData}
              />
            )}

            {activeTab === "applications" && (
              <ApplicationsTable
                applications={applications}
                onRefresh={handleRefresh}
                pagination={pagination}
                onPageChange={fetchData}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
