import { useState, useEffect } from "react";

interface AvatarProps {
  src?: string | null;
  name?: string | null;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

// Function to generate consistent background color from name
const getBackgroundColor = (name: string): string => {
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  // Generate a consistent index based on the name
  const charCodeSum = name
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return colors[charCodeSum % colors.length];
};

// Function to get initials from name
const getInitials = (name: string): string => {
  if (!name) return "U";

  const words = name.trim().split(" ");
  if (words.length === 1) {
    return words[0].charAt(0).toUpperCase();
  }

  // Get first letter of first and last word
  return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
};

const Avatar = ({
  src,
  name = "User",
  size = "md",
  className = "",
}: AvatarProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [src]);

  const sizeClasses = {
    xs: "w-6 h-6 text-xs",
    sm: "w-8 h-8 text-sm",
    md: "w-10 h-10 text-base",
    lg: "w-12 h-12 text-lg",
    xl: "w-16 h-16 text-xl",
  };

  const displayName = name || "User";
  const initials = getInitials(displayName);
  const bgColor = getBackgroundColor(displayName);

  // Check if we should show image
  const shouldShowImage =
    src && !imageError && src !== "null" && src !== "undefined";

  return (
    <div
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center overflow-hidden relative ${className}`}
    >
      {shouldShowImage ? (
        <>
          <img
            src={src}
            alt={displayName}
            className={`w-full h-full object-cover transition-opacity duration-200 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onError={() => {
              // console.log("Image failed to load:", src);
              setImageError(true);
            }}
            onLoad={() => setImageLoaded(true)}
          />
          {!imageLoaded && (
            <div
              className={`absolute inset-0 ${bgColor} flex items-center justify-center text-white font-semibold`}
            >
              {initials}
            </div>
          )}
        </>
      ) : (
        <div
          className={`w-full h-full ${bgColor} flex items-center justify-center text-white font-semibold`}
        >
          {initials}
        </div>
      )}
    </div>
  );
};

export default Avatar;
