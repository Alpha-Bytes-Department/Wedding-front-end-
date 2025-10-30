// Types and interfaces for UserManagement components
export interface User {
  _id: string;
  name: string;
  partner_1?: string;
  partner_2?: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  weddingDate?: string;
  location?: string;
  profilePicture?: string;
  isVerified: boolean;
  createdAt: string;
  bookingMoney?: number;
  specialization?: string;
  languages?: string[];
  bio?: string;
}

export interface Officiant {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  location?: string;
  experience?: number;
  rate?: number;
  rating?: number;
  bio?: string;
  certifications?: string[];
  availability: boolean;
  isVerified: boolean;
  profilePicture?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OfficiantApplication {
  _id: string;
  userId: string;
  name: string;
  email: string;
  contactNo: string;
  address: string;
  experience: number;
  experience_details: string;
  speciality: string;
  language: string[];
  profilePicture?: string;
  profilePictureUrl?: string;
  portfolio?: string;
  portfolioUrl?: string;
  status: "pending" | "approved" | "rejected";
  appliedAt: string;
  submittedAt: string;
  updatedAt: string;
}

export interface PaginationData {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface UserStats {
  totalUsers: number;
  verifiedUsers: number;
  totalOfficiants: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

// Utility function for profile image URLs
export const getProfileImageUrl = (profilePicture: string) => {
  if (!profilePicture) return "";
  // Check if it's already a complete URL
  if (profilePicture.startsWith("http")) {
    return profilePicture;
  }
  // For images in the public folder, construct the URL relative to the app root
  return `/${profilePicture}`;
};

// Pagination utility
export const paginateArray = <T>(
  array: T[],
  page: number,
  itemsPerPage: number = 10
) => {
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  return {
    items: array.slice(startIndex, endIndex),
    totalPages: Math.ceil(array.length / itemsPerPage),
    totalItems: array.length,
    currentPage: page,
    itemsPerPage,
  };
};
