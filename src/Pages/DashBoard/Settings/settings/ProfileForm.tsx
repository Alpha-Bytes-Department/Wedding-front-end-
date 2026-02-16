import type { UseFormReturn } from "react-hook-form";
import { HiPencil } from "react-icons/hi";

interface ProfileFormProps {
  user: any;
  isEditingProfile: boolean;
  setIsEditingProfile: (value: boolean) => void;
  profileForm: UseFormReturn<any>;
  onProfileSubmit: (data: any) => void;
}

const ProfileForm = ({
  user,
  isEditingProfile,
  setIsEditingProfile,
  profileForm,
  onProfileSubmit,
}: ProfileFormProps) => {
  const inputClass = (disabled: boolean) =>
    `w-full px-4 py-3 border border-primary rounded-lg focus:outline-none ${
      disabled ? "bg-gray-50 cursor-not-allowed" : ""
    }`;

  return (
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
        {user?.role === "user" ? (
          // Layout for Users/Clients
          <div className="space-y-4 mb-6">
            {/* Account Name and Location */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Account Name
                </label>
                <input
                  {...profileForm.register("name")}
                  type="text"
                  disabled={!isEditingProfile}
                  className={inputClass(!isEditingProfile)}
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
                  className={inputClass(!isEditingProfile)}
                />
              </div>
            </div>

            {/* Partner 1 Name and Phone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner 1 Name
                </label>
                <input
                  {...profileForm.register("partner1Name")}
                  type="text"
                  disabled={!isEditingProfile}
                  className={inputClass(!isEditingProfile)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner 1 Phone
                </label>
                <input
                  {...profileForm.register("partner1Phone")}
                  type="tel"
                  disabled={!isEditingProfile}
                  placeholder="Enter partner 1 phone number"
                  className={inputClass(!isEditingProfile)}
                />
              </div>
            </div>

            {/* Partner 2 Name and Phone */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner 2 Name
                </label>
                <input
                  {...profileForm.register("partner2Name")}
                  type="text"
                  disabled={!isEditingProfile}
                  className={inputClass(!isEditingProfile)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Partner 2 Phone
                </label>
                <input
                  {...profileForm.register("partner2Phone")}
                  type="tel"
                  disabled={!isEditingProfile}
                  placeholder="Enter partner 2 phone number"
                  className={inputClass(!isEditingProfile)}
                />
              </div>
            </div>

            {/* Wedding Date and Rehearsal */}
            <div className="space-y-3 flex flex-col lg:flex-row lg:items-center justify-around">
              <div className="">
                <label className="block text-sm  font-medium text-gray-700 mb-2">
                  Wedding Date
                </label>
                <input
                  {...profileForm.register("weddingDate")}
                  type="date"
                  disabled={!isEditingProfile}
                  className={`w-full lg:w-96 px-4 py-3 border border-primary rounded-lg focus:outline-none ${
                    !isEditingProfile ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  {...profileForm.register("needRehearsal")}
                  type="checkbox"
                  id="needRehearsal"
                  disabled={!isEditingProfile}
                  className={`w-5 h-5 text-primary border-primary rounded focus:ring-primary ${
                    !isEditingProfile ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                />
                <label
                  htmlFor="needRehearsal"
                  className={`text-sm font-medium text-gray-700 ${
                    !isEditingProfile ? "cursor-not-allowed" : "cursor-pointer"
                  }`}
                >
                  Need Rehearsal?
                </label>
              </div>

              {profileForm.watch("needRehearsal") && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Rehearsal Date
                  </label>
                  <input
                    {...profileForm.register("rehearsalDate")}
                    type="date"
                    disabled={!isEditingProfile}
                    className={`w-full lg:w-96 px-4 py-3 border border-primary rounded-lg focus:outline-none ${
                      !isEditingProfile ? "bg-gray-50 cursor-not-allowed" : ""
                    }`}
                  />
                </div>
              )}
            </div>
          </div>
        ) : (
          // Layout for Officiants
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Name
              </label>
              <input
                {...profileForm.register("name")}
                type="text"
                disabled={!isEditingProfile}
                className={inputClass(!isEditingProfile)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Price (per event)
              </label>
              <input
                {...profileForm.register("booking")}
                type="number"
                disabled={!isEditingProfile}
                className={inputClass(!isEditingProfile)}
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
                className={inputClass(!isEditingProfile)}
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
                className={inputClass(!isEditingProfile)}
              />
            </div>
          </div>
        )}
        {user?.role === "officiant" && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Officiant Bio
            </label>
            <textarea
              {...profileForm.register("officiantBio")}
              disabled={!isEditingProfile}
              placeholder={user?.bio || "Write something about yourself..."}
              className={`w-full h-40 px-4 py-3 border border-primary rounded-lg focus:outline-none ${
                !isEditingProfile ? "bg-gray-50 cursor-not-allowed" : ""
              }`}
            />
          </div>
        )}

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
  );
};

export default ProfileForm;
