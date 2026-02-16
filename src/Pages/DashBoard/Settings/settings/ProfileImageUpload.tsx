import { IoCamera } from "react-icons/io5";
import Avatar from "../../../../Component/Shared/Avatar";

interface ProfileImageUploadProps {
  isEditingProfile: boolean;
  isUploading: boolean;
  profileImage: string | null;
  userName?: string;
  handleFileUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const ProfileImageUpload = ({
  isEditingProfile,
  isUploading,
  profileImage,
  userName,
  handleFileUpload,
}: ProfileImageUploadProps) => {
  const renderImage = () => {
    if (isUploading) {
      return (
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      );
    }

    return (
      <Avatar
        src={profileImage}
        name={userName}
        size="xl"
        className="w-full h-full"
      />
    );
  };

  return (
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
          {renderImage()}
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
  );
};

export default ProfileImageUpload;
