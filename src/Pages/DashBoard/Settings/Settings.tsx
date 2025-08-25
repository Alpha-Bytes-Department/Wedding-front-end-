import { useState } from "react";
import { useForm } from "react-hook-form";
import { HiPencil } from "react-icons/hi";

const Settings = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [notifications, setNotifications] = useState({
    bookingUpdates: true,
    newMessages: true,
    fileUploads: true,
    reminders: false,
  });

  const [privacy, setPrivacy] = useState({
    shareCeremonyDetails: true,
    allowFileDownloads: true,
  });

  const profileForm = useForm({
    defaultValues: {
      partner1Name: "Lisa",
      partner2Name: "Asif",
      contact: "(555) 555-5555",
      location: "City, State",
      weddingDate: "",
    },
  });

  const securityForm = useForm({
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });

  const onProfileSubmit = (data: any) => {
    console.log("Profile data:", data);
  };

  const onSecuritySubmit = (data: any) => {
    console.log("Security data:", data);
  };

  const onNotificationsSave = () => {
    console.log("Notifications:", notifications);
  };

  const onPrivacySave = () => {
    console.log("Privacy:", privacy);
  };

  const generateStrongPassword = () => {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    securityForm.setValue("newPassword", password);
    securityForm.setValue("confirmPassword", password);
  };

  const deleteAccount = () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      console.log("Account deletion requested");
    }
  };

  return (
    <div className="min-h-screen bg-white p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Section */}
        <div className="bg-white rounded-2xl shadow-md border border-primary p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-primary font-bold text-gray-900">
              Profile
            </h2>
            <button
              type="button"
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="p-2 text-gray-500 hover:text-primary transition-colors"
              title={isEditingProfile ? "Cancel editing" : "Edit profile"}
            >
              <HiPencil className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={profileForm.handleSubmit(onProfileSubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner 1 name
                </label>
                <input
                  {...profileForm.register("partner1Name")}
                  type="text"
                  disabled={!isEditingProfile}
                  className={`w-full px-4 py-3 border border-primary rounded-lg focus:outline-none    ${
                    !isEditingProfile ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner 2 name
                </label>
                <input
                  {...profileForm.register("partner2Name")}
                  type="text"
                  disabled={!isEditingProfile}
                  className={`w-full px-4 py-3 border border-primary rounded-lg focus:outline-none    ${
                    !isEditingProfile ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contact
                </label>
                <input
                  {...profileForm.register("contact")}
                  type="tel"
                  disabled={!isEditingProfile}
                  className={`w-full px-4 py-3 border border-primary rounded-lg focus:outline-none    ${
                    !isEditingProfile ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  {...profileForm.register("location")}
                  type="text"
                  disabled={!isEditingProfile}
                  className={`w-full px-4 py-3 border border-primary rounded-lg focus:outline-none    ${
                    !isEditingProfile ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wedding Date
              </label>
              <input
                {...profileForm.register("weddingDate")}
                type="date"
                disabled={!isEditingProfile}
                placeholder="DD / MM / YYYY"
                className={`w-full lg:w-1/2 px-4 py-3 border border-primary rounded-lg focus:outline-none    ${
                  !isEditingProfile ? "bg-gray-50 cursor-not-allowed" : ""
                }`}
              />
            </div>
            {isEditingProfile && (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(false)}
                  className="px-6 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
                >
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Notifications Section */}
        <div className="bg-white rounded-2xl shadow-md border border-primary p-6">
          <h2 className="text-2xl font-primary font-bold text-gray-900 mb-6">
            Notifications
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">Booking Updates</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.bookingUpdates}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        bookingUpdates: e.target.checked,
                      })
                    }
                    className="sr-only peer "
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">File Uploads</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.fileUploads}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        fileUploads: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-700">New Messages</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.newMessages}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        newMessages: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-gray-700">Reminders</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifications.reminders}
                    onChange={(e) =>
                      setNotifications({
                        ...notifications,
                        reminders: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
          </div>
          <button
            onClick={onNotificationsSave}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Save Notifications Settings
          </button>
        </div>

        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-md border border-primary p-6">
          <h2 className="text-2xl font-primary font-bold text-gray-900 mb-6">
            Security
          </h2>
          <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  {...securityForm.register("newPassword")}
                  type="password"
                  className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none   "
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  {...securityForm.register("confirmPassword")}
                  type="password"
                  className="w-full px-4 py-3 border border-primary rounded-lg focus:outline-none   "
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <button
                type="button"
                onClick={generateStrongPassword}
                className="px-6 py-2 border border-primary text-primary rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
              >
                Generate Strong Password
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Update Password
              </button>
            </div>
          </form>
        </div>

        {/* Privacy and Danger Zone */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Privacy Section */}
          <div className="bg-white rounded-2xl shadow-md border border-primary p-6">
            <h2 className="text-2xl font-primary font-bold text-gray-900 mb-6">
              Privacy
            </h2>
            <div className="space-y-4 mb-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-gray-700 block">
                    Share ceremony details with officiant automatically
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={privacy.shareCeremonyDetails}
                    onChange={(e) =>
                      setPrivacy({
                        ...privacy,
                        shareCeremonyDetails: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>

              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <span className="text-gray-700 block">
                    Allow file downloads for officiant
                  </span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer ml-4">
                  <input
                    type="checkbox"
                    checked={privacy.allowFileDownloads}
                    onChange={(e) =>
                      setPrivacy({
                        ...privacy,
                        allowFileDownloads: e.target.checked,
                      })
                    }
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none   rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </label>
              </div>
            </div>
            <button
              onClick={onPrivacySave}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Save Privacy Settings
            </button>
          </div>

          {/* Danger Zone Section */}
          <div className="bg-white rounded-2xl shadow-md border border-red-300 p-6">
            <h2 className="text-2xl font-primary font-bold text-gray-900 mb-6">
              Danger Zone
            </h2>
            <p className="text-gray-600 mb-6">
              Delete your account and all associated data. This action cannot be
              undone.
            </p>
            <button
              onClick={deleteAccount}
              className="px-6 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
            >
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
