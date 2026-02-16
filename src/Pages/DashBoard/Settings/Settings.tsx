import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { GlassSwal } from "../../../utils/glassSwal";
import { useAuth } from "../../../Component/Providers/AuthProvider";
import { useAxios } from "../../../Component/Providers/useAxios";
import { useNavigate } from "react-router-dom";
import { convertLocalDateToISO, formatDateForInput } from "../../../utils/dateUtils";
import ProfileImageUpload from "./settings/ProfileImageUpload";
import ProfileForm from "./settings/ProfileForm";
import SecurityForm from "./settings/SecurityForm";
import AvailabilitySection from "./settings/AvailabilitySection";
import DangerZone from "./settings/DangerZone";

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
    availability: true,
  });

  // ====================== Profile form default values ======================
  const profileForm = useForm({
    defaultValues: {
      partner1Name: user?.partner_1 || "",
      partner2Name: user?.partner_2 || "",
      contact: user?.phone || "",
      partner1Phone: user?.contact?.partner_1 || "",
      partner2Phone: user?.contact?.partner_2 || "",
      location: user?.location || " ",
      weddingDate: user?.weddingDate
        ? formatDateForInput(user.weddingDate)
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
        ? formatDateForInput(user.rehearsalDate)
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
          ? formatDateForInput(user.weddingDate)
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
          ? formatDateForInput(user.rehearsalDate)
          : "",
      });
    }
  }, [user, profileForm]);

  // ====================== Handlers ======================
  const onProfileSubmit = async (info: any) => {
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
        weddingDate: info.weddingDate ? convertLocalDateToISO(info.weddingDate) : null,
        bio: info.officiantBio,
        bookingMoney: info.booking,
        needRehearsal:
          info.needRehearsal === true
            ? true
            : info.needRehearsal === false
            ? false
            : null,
        rehearsalDate:
          info.needRehearsal && info.rehearsalDate ? convertLocalDateToISO(info.rehearsalDate) : null,
      };

      if (user?.role === "user") {
        updateData.contact = {
          partner_1: info.partner1Phone,
          partner_2: info.partner2Phone,
        };
      }

      const response = await axios.patch("/users/update", updateData);
      setUser(response.data.user);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsEditingProfile(false);
      GlassSwal.success("Profile Updated", "Your profile has been successfully updated.");
    } catch (error: any) {
      GlassSwal.error(
        "Update Failed",
        error.response?.data?.message || "Failed to update profile. Please try again."
      );
    }
  };

  const onSecuritySubmit = async (info: any) => {
    try {
      await axios.patch("/users/change-password", {
        oldPassword: info.oldPassword,
        newPassword: info.newPassword,
      });
      securityForm.reset();
      setIsEditingSecurity(false);
      GlassSwal.success("Security Updated", "Your security settings have been successfully updated.");
    } catch (error: any) {
      GlassSwal.error(
        "Update Failed",
        error.response?.data?.message || "Failed to update security settings. Please try again."
      );
    }
  };

  const onPrivacySave = async () => {
    try {
      await axios.patch("/users/update", {
        availability: privacy.availability,
      });
      GlassSwal.success("Availability Status updated", "Your availability status is set to available.");
    } catch (error: any) {
      GlassSwal.error(
        "Update Failed",
        error.response?.data?.message || "Failed to update privacy settings. Please try again."
      );
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      GlassSwal.error("Invalid file type", "Please upload an image file (JPEG, PNG, GIF, or WEBP).");
      return;
    }

    if (file.size > 1 * 1024 * 1024) {
      GlassSwal.error("File too large", "Please upload an image smaller than 1MB.");
      return;
    }

    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append("profilePicture", file);

      const response = await axios.patch("/users/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.status === 200 || response.status === 201) {
        setProfileImage(response.data.user.profilePicture);
        setUser(response.data.user);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        GlassSwal.success("Profile Picture Updated", "Your profile picture has been successfully updated.");
      }
    } catch (error: any) {
      GlassSwal.error(
        "Upload Failed",
        error.response?.data?.message || "Failed to upload profile picture. Please try again."
      );
    } finally {
      setIsUploading(false);
    }
  };

  const generateStrongPassword = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    securityForm.setValue("newPassword", password);
    securityForm.setValue("confirmPassword", password);
  };

  const deleteAccount = () => {
    GlassSwal.confirm(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone."
    ).then(async (result) => {
      if (result.isConfirmed) {
        const response = await axios.delete("/users/delete-account");
        if (response.status === 200) {
          GlassSwal.success("Account Deleted", "Your account has been successfully deleted.");
          navigate("/login");
        } else {
          GlassSwal.error("Account Deletion Failed", "Failed to delete your account. Please try again.");
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-white p-4 lg:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        <ProfileImageUpload
          isEditingProfile={isEditingProfile}
          isUploading={isUploading}
          profileImage={profileImage}
          userName={user?.name || user?.partner_1 || user?.email}
          handleFileUpload={handleFileUpload}
        />

        <ProfileForm
          user={user}
          isEditingProfile={isEditingProfile}
          setIsEditingProfile={setIsEditingProfile}
          profileForm={profileForm}
          onProfileSubmit={onProfileSubmit}
        />

        <SecurityForm
          isEditingSecurity={isEditingSecurity}
          setIsEditingSecurity={setIsEditingSecurity}
          securityForm={securityForm}
          onSecuritySubmit={onSecuritySubmit}
          generateStrongPassword={generateStrongPassword}
        />

        <div className="flex flex-col lg:flex-row gap-6">
          {user?.role === "officiant" && (
            <AvailabilitySection
              privacy={privacy}
              setPrivacy={setPrivacy}
              onPrivacySave={onPrivacySave}
            />
          )}
          <DangerZone onDeleteAccount={deleteAccount} />
        </div>
      </div>
    </div>
  );
};

export default Settings;
