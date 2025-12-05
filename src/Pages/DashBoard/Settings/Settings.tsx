import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { HiPencil } from "react-icons/hi";
import { IoCamera } from "react-icons/io5";
import { GlassSwal } from "../../../utils/glassSwal";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingSecurity, setIsEditingSecurity] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const axios = useAxios();
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [profileImage, setProfileImage] = useState<string | null>(
    user?.profilePicture || null
  );

  const [privacy, setPrivacy] = useState({
    availability : true,
  });

  // ======================Profile section default values======================
  const profileForm = useForm({
    defaultValues: {
      partner1Name: user?.partner_1 || "",
      partner2Name: user?.partner_2 || "",
      contact: user?.phone || "",
      partner1Phone: user?.contact?.partner_1 || "",
      partner2Phone: user?.contact?.partner_2 || "",
      location: user?.location || " ",
      weddingDate: user?.weddingDate
        ? new Date(user.weddingDate).toISOString().split("T")[0]
        : "",
      officiantBio: user?.bio || "",
      booking: user?.bookingMoney || 0,
      name: user?.name || "",
      needRehearsal:
        user?.needRehearsal === true
          ? true
          : user?.needRehearsal === false
          ? false
          : null,
      rehearsalDate: user?.rehearsalDate
        ? new Date(user.rehearsalDate).toISOString().split("T")[0]
        : "",
    },
  });

  const securityForm = useForm({
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      profileForm.reset({
        partner1Name: user.partner_1 || "",
        partner2Name: user.partner_2 || "",
        contact: user.phone || "",
        partner1Phone: user.contact?.partner_1 || "",
        partner2Phone: user.contact?.partner_2 || "",
        location: user.location || "",
        weddingDate: user.weddingDate
          ? new Date(user.weddingDate).toISOString().split("T")[0]
          : "",
        officiantBio: user.bio || "",
        booking: user.bookingMoney || 0,
        name: user.name || "",
        needRehearsal:
          user.needRehearsal === true
            ? true
            : user.needRehearsal === false
            ? false
            : null,
        rehearsalDate: user.rehearsalDate
          ? new Date(user.rehearsalDate).toISOString().split("T")[0]
          : "",
      });
    }
  }, [user, profileForm]);

  const onProfileSubmit = async (info: any) => {
    console.log("Profile data:", info);

    // Validate rehearsal date if rehearsal is needed
    if (info.needRehearsal === true && !info.rehearsalDate) {
      GlassSwal.error(
        "Rehearsal Date Required",
        "Please select a rehearsal date since you have indicated that rehearsal is needed."
      );
      return;
    }

    try {
      const updateData: any = {
        partner_1: info.partner1Name,
        partner_2: info.partner2Name,
        name: info.name,
        phone: info.contact,
        location: info.location,
        weddingDate: info.weddingDate,
        bio: info.officiantBio,
        bookingMoney: info.booking,
        needRehearsal:
          info.needRehearsal === true
            ? true
            : info.needRehearsal === false
            ? false
            : null,
        rehearsalDate:
          info.needRehearsal && info.rehearsalDate ? info.rehearsalDate : null,
      };

      // Add contact object for user role
      if (user?.role === "user") {
        updateData.contact = {
          partner_1: info.partner1Phone,
          partner_2: info.partner2Phone,
        };
      }

      const response = await axios.patch("/users/update", updateData);

      console.log("Update response:", response.data);
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsEditingProfile(false);
      GlassSwal.success(
        "Profile Updated",
        "Your profile has been successfully updated."
      );
    } catch (error: any) {
      console.error("Error updating profile:", error);
      GlassSwal.error(
        "Update Failed",
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    }
  };

  const onSecuritySubmit = async (info: any) => {
    console.log("Security data:", info);
    try {
      const response = await axios.patch("/users/change-password", {
        oldPassword: info.oldPassword,
        newPassword: info.newPassword,
      });
      console.log("Update response:", response.data);
      securityForm.reset();
      setIsEditingSecurity(false);
      GlassSwal.success(
        "Security Updated",
        "Your security settings have been successfully updated."
      );
    } catch (error: any) {
      console.error("Error updating security:", error);
      GlassSwal.error(
        "Update Failed",
        error.response?.data?.message ||
          "Failed to update security settings. Please try again."
      );
    }
  };

  const onPrivacySave = async (info: any) => {
    console.log("Privacy:", info);
    try {
      const response = await axios.patch("/users/update", {
        availability: privacy.availability,
      });
      console.log("Privacy update response:", response.data);
      GlassSwal.success(
        "Availability Status updated",
        "Your availability status is set to available."
      );
    } catch (error: any) {
      console.error("Error updating privacy settings:", error);
      GlassSwal.error(
        "Update Failed",
        error.response?.data?.message ||
          "Failed to update privacy settings. Please try again."
      );
    }
  };

  // ===================== Profile Image section =====================
  const getProfileImage = () => {
    if (isUploading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
        />
      );
    }

    // Default placeholder
    return (
      <div className="w-full h-full flex items-center justify-center text-white">
        <span className="text-2xl font-bold">
          {user?.partner_1?.charAt(0) || "U"}
        </span>
      </div>
    );
  };

  // ===================== Handle Profile Image Upload =====================
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      GlassSwal.error(
        "Invalid file type",
        "Please upload an image file (JPEG, PNG, GIF, or WEBP)."
      );
      return;
    }

    // Validate file size (max 1MB)
    if (file.size > 1 * 1024 * 1024) {
      GlassSwal.error(
        "File too large",
        "Please upload an image smaller than 1MB."
      );
      return;
    }

    try {
      setIsUploading(true);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("profilePicture", file);

      // Upload image
      const response = await axios.patch("/users/update", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload response:", response);

      if (response.status === 200 || response.status === 201) {
        // Update local state with new image URL
        setProfileImage(response.data.user.profilePicture);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        GlassSwal.success(
          "Profile Picture Updated",
          "Your profile picture has been successfully updated."
        );
      }
    } catch (error: any) {
      console.error("Error uploading profile image:", error);
      GlassSwal.error(
        "Upload Failed",
        error.response?.data?.message ||
          "Failed to upload profile picture. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  // ===================== Strong Password Generation =====================
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

  // ===================== Delete Account Section =====================
  const deleteAccount = () => {
    GlassSwal.confirm(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone."
    ).then(async (result) => {
      if (result.isConfirmed) {
        console.log("Account deletion confirmed");
        //  delete account API here
        const response = await axios.delete("/users/delete-account");

        if (response.status === 200) {
          console.log("Account deletion response:", response.data);
          GlassSwal.success(
            "Account Deleted",
            "Your account has been successfully deleted."
          );
          navigate("/login");
        } else {
          GlassSwal.error(
            "Account Deletion Failed",
            "Failed to delete your account. Please try again."
          );
        }
      }
    });
  };
  console.log("User data in settings:", user);
  return (
    <div className="min-h-screen bg-white p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Profile Image Upload */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <label
            htmlFor="logo-upload"
            className={`${
              isEditingProfile
                ? "cursor-pointer hover:scale-105"
                : "cursor-default"
            } duration-300 relative`}
          >
            <div className="w-20 h-20 sm:w-24 sm:h-24 lg:w-28 lg:h-28 mb-3 border border-white/30 p-1 rounded-full flex items-center justify-center transition overflow-hidden bg-gray-800/50">
              {getProfileImage()}
              {isEditingProfile && (
                <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <IoCamera size={24} className="text-white" />
                </div>
              )}
            </div>
            {isEditingProfile && (
              <input
                id="logo-upload"
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                className="hidden"
                onChange={handleFileUpload}
                disabled={isUploading}
              />
            )}
          </label>
          <p className="text-base sm:text-lg font-medium text-center">
            {isEditingProfile
              ? "Click to Upload Profile Picture"
              : "Profile Picture"}
          </p>
        </div>

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
            {user?.role === "user" ? (
              // Layout for Users/Clients
              <div className="space-y-4 mb-6">
                {/* Account Name and Location in same line */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Account name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Account Name
                    </label>
                    <input
                      {...profileForm.register("name")}
                      type="text"
                      disabled={!isEditingProfile}
                      className={`w-full px-4 py-3 border border-primary rounded-lg focus:outline-none    ${
                        !isEditingProfile ? "bg-gray-50 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                  {/* User address */}
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

                {/* Partner 1 Name and Phone in same line */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Partner 1 Name
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
                      Partner 1 Phone
                    </label>
                    <input
                      {...profileForm.register("partner1Phone")}
                      type="tel"
                      disabled={!isEditingProfile}
                      placeholder="Enter partner 1 phone number"
                      className={`w-full px-4 py-3 border border-primary rounded-lg focus:outline-none    ${
                        !isEditingProfile ? "bg-gray-50 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Partner 2 Name and Phone in same line */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Partner 2 Name
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
                      Partner 2 Phone
                    </label>
                    <input
                      {...profileForm.register("partner2Phone")}
                      type="tel"
                      disabled={!isEditingProfile}
                      placeholder="Enter partner 2 phone number"
                      className={`w-full px-4 py-3 border border-primary rounded-lg focus:outline-none    ${
                        !isEditingProfile ? "bg-gray-50 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>
                </div>

                {/* Wedding Date */}
                <div className="space-y-3 flex flex-col lg:flex-row lg:items-center justify-around">
                  <div className="">
                    <label className="block text-sm  font-medium text-gray-700 mb-2">
                      Wedding Date
                    </label>
                    <input
                      {...profileForm.register("weddingDate")}
                      type="date"
                      disabled={!isEditingProfile}
                      className={`w-full lg:w-96 px-4 py-3 border border-primary rounded-lg focus:outline-none    ${
                        !isEditingProfile ? "bg-gray-50 cursor-not-allowed" : ""
                      }`}
                    />
                  </div>

                  {/* Rehearsal Section */}

                  <div className="flex items-center gap-3">
                    <input
                      {...profileForm.register("needRehearsal")}
                      type="checkbox"
                      id="needRehearsal"
                      disabled={!isEditingProfile}
                      className={`w-5 h-5 text-primary border-primary rounded focus:ring-primary ${
                        !isEditingProfile
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                    />
                    <label
                      htmlFor="needRehearsal"
                      className={`text-sm font-medium text-gray-700 ${
                        !isEditingProfile
                          ? "cursor-not-allowed"
                          : "cursor-pointer"
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
                        className={`w-full lg:w-96 px-4 py-3 border border-primary rounded-lg focus:outline-none    ${
                          !isEditingProfile
                            ? "bg-gray-50 cursor-not-allowed"
                            : ""
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
                    className={`w-full px-4 py-3 border border-primary rounded-lg focus:outline-none    ${
                      !isEditingProfile ? "bg-gray-50 cursor-not-allowed" : ""
                    }`}
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
                  className={`w-full h-40 px-4 py-3 border border-primary rounded-lg focus:outline-none    ${
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

        {/* Security Section */}
        <div className="bg-white rounded-2xl shadow-md border border-primary p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-primary font-bold text-gray-900">
              Security
            </h2>
            <button
              type="button"
              onClick={() => setIsEditingSecurity(!isEditingSecurity)}
              className="p-2 text-gray-500 hover:text-primary transition-colors"
              title={isEditingSecurity ? "Cancel editing" : "Edit security"}
            >
              <HiPencil className="w-5 h-5" />
            </button>
          </div>
          <form onSubmit={securityForm.handleSubmit(onSecuritySubmit)}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Old Password
              </label>
              <input
                id="oldPassword"
                {...securityForm.register("oldPassword")}
                type="password"
                disabled={!isEditingSecurity}
                className={`w-full pr-12 px-4 py-3 border border-primary rounded-lg focus:outline-none ${
                  !isEditingSecurity ? "bg-gray-50 cursor-not-allowed" : ""
                }`}
              />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  New Password
                </label>
                <input
                  id="newPassword"
                  {...securityForm.register("newPassword")}
                  type="password"
                  disabled={!isEditingSecurity}
                  className={`w-full pr-12 px-4 py-3 border border-primary rounded-lg focus:outline-none ${
                    !isEditingSecurity ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                />
                {isEditingSecurity && (
                  <button
                    type="button"
                    aria-label="Toggle new password visibility"
                    className="absolute right-3 top-[38px] text-gray-500 hover:text-primary"
                    onClick={(e: any) => {
                      const btn = e.currentTarget as HTMLButtonElement;
                      const input = document.getElementById(
                        "newPassword"
                      ) as HTMLInputElement | null;
                      if (!input) return;
                      if (input.type === "password") {
                        input.type = "text";
                        btn.setAttribute("aria-pressed", "true");
                        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2l20 20" /><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-7 1.02-2.06 2.63-3.8 4.6-4.92" /><path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" /></svg>`;
                      } else {
                        input.type = "password";
                        btn.setAttribute("aria-pressed", "false");
                        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1.05 12a11 11 0 0 1 21.9 0 11 11 0 0 1-21.9 0z"/><circle cx="12" cy="12" r="3"/></svg>`;
                      }
                    }}
                    dangerouslySetInnerHTML={{
                      __html: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1.05 12a11 11 0 0 1 21.9 0 11 11 0 0 1-21.9 0z"/><circle cx="12" cy="12" r="3"/></svg>`,
                    }}
                  />
                )}
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password
                </label>
                <input
                  id="confirmPassword"
                  {...securityForm.register("confirmPassword")}
                  type="password"
                  disabled={!isEditingSecurity}
                  className={`w-full pr-12 px-4 py-3 border border-primary rounded-lg focus:outline-none ${
                    !isEditingSecurity ? "bg-gray-50 cursor-not-allowed" : ""
                  }`}
                />
                {isEditingSecurity && (
                  <button
                    type="button"
                    aria-label="Toggle confirm password visibility"
                    className="absolute right-3 top-[38px] text-gray-500 hover:text-primary"
                    onClick={(e: any) => {
                      const btn = e.currentTarget as HTMLButtonElement;
                      const input = document.getElementById(
                        "confirmPassword"
                      ) as HTMLInputElement | null;
                      if (!input) return;
                      if (input.type === "password") {
                        input.type = "text";
                        btn.setAttribute("aria-pressed", "true");
                        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M2 2l20 20" /><path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-5 0-9.27-3-11-7 1.02-2.06 2.63-3.8 4.6-4.92" /><path d="M9.88 9.88A3 3 0 0 0 14.12 14.12" /></svg>`;
                      } else {
                        input.type = "password";
                        btn.setAttribute("aria-pressed", "false");
                        btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1.05 12a11 11 0 0 1 21.9 0 11 11 0 0 1-21.9 0z"/><circle cx="12" cy="12" r="3"/></svg>`;
                      }
                    }}
                    dangerouslySetInnerHTML={{
                      __html: `<svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1.05 12a11 11 0 0 1 21.9 0 11 11 0 0 1-21.9 0z"/><circle cx="12" cy="12" r="3"/></svg>`,
                    }}
                  />
                )}
              </div>
            </div>
            {isEditingSecurity && (
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <button
                  type="button"
                  onClick={generateStrongPassword}
                  className="px-6 py-2 border border-primary text-[#d38b47] rounded-lg font-medium hover:bg-primary hover:text-white transition-colors"
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
            )}
          </form>
        </div>

        {/* Privacy and Danger Zone */}
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Privacy Section */}
          {user?.role === "officiant" && (
            <div className="bg-white rounded-2xl w-full shadow-md border border-primary p-6">
              <h2 className="text-2xl font-primary font-bold text-gray-900 mb-6">
                Your Availability
              </h2>
              <div className="space-y-4 mb-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <span className="text-gray-700 block">
                      Adjust your availability as an officiant
                    </span>
                    <p className=" pt-5">
                      Current status :{" "}
                      {privacy.availability ? (
                        <span className="py-1 px-2 rounded-full bg-amber-100 duration-500 ease-in text-amber-800 ml-6">
                          Available
                        </span>
                      ) : (
                        <span className="py-1 px-3 rounded-full bg-gray-100 duration-500 ease-in text-slate-500 ml-6">
                          Not available
                        </span>
                      )}
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer ml-4">
                    <input
                      type="checkbox"
                      checked={privacy.availability}
                      onChange={(e) =>
                        setPrivacy({
                          ...privacy,
                          availability: e.target.checked,
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
          )}

          {/* Danger Zone Section */}
          <div className="bg-white rounded-2xl shadow-md w-full border border-red-300 p-6">
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
