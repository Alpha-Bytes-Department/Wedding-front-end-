import type { AxiosInstance } from "axios";
import type { CeremonyFormData, CeremonyData } from "../types";

export class CeremonyApiService {
  private axios: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axios = axiosInstance;
  }

  /**
   * Helper function to format form data for backend compatibility
   *
   * Handles the following transformations:
   * - Converts eventDate string to Date object
   * - Converts eventTime string to Date object (combined with eventDate or today's date)
   * - Converts rehearsalDate string to Date object
   * - Removes empty strings and null values
   * - Provides error handling for date parsing failures
   *
   * @param data - Partial ceremony form data
   * @returns Formatted data ready for backend submission
   */
  private formatCeremonyData(data: Partial<CeremonyFormData>): any {
    const formattedData: any = { ...data };

    // Convert eventDate and eventTime to proper Date objects
    if (formattedData.eventDate && formattedData.eventTime) {
      try {
        // Combine date and time into a single Date object for eventTime
        const dateTimeString = `${formattedData.eventDate}T${formattedData.eventTime}:00`;
        formattedData.eventTime = new Date(dateTimeString);
        // Keep eventDate as Date object
        formattedData.eventDate = new Date(formattedData.eventDate);
      } catch (error) {
        console.error("Error parsing date/time:", error);
        // If parsing fails, remove the problematic fields
        delete formattedData.eventTime;
        delete formattedData.eventDate;
      }
    } else if (formattedData.eventTime && !formattedData.eventDate) {
      try {
        // If only time is provided, use today's date
        const today = new Date().toISOString().split("T")[0];
        const dateTimeString = `${today}T${formattedData.eventTime}:00`;
        formattedData.eventTime = new Date(dateTimeString);
      } catch (error) {
        console.error("Error parsing time:", error);
        delete formattedData.eventTime;
      }
    } else if (formattedData.eventDate) {
      try {
        // Convert eventDate to Date object if provided
        formattedData.eventDate = new Date(formattedData.eventDate);
      } catch (error) {
        console.error("Error parsing date:", error);
        delete formattedData.eventDate;
      }
    }

    // Convert rehearsalDate to Date object if provided
    if (formattedData.rehearsalDate) {
      try {
        formattedData.rehearsalDate = new Date(formattedData.rehearsalDate);
      } catch (error) {
        console.error("Error parsing rehearsal date:", error);
        delete formattedData.rehearsalDate;
      }
    }

    // Remove empty strings and replace with undefined
    Object.keys(formattedData).forEach((key) => {
      if (formattedData[key] === "" || formattedData[key] === null) {
        delete formattedData[key];
      }
    });

    return formattedData;
  }

  // Helper method to format Date to YYYY-MM-DD for date input
  private formatDateForInput(date: Date): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }
    return date.toISOString().split("T")[0];
  }

  // Helper method to format Date to HH:MM for time input
  private formatTimeForInput(date: Date): string {
    if (!date || !(date instanceof Date) || isNaN(date.getTime())) {
      return "";
    }
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  }

  // Create a new ceremony
  async createCeremony(
    ceremonyData: CeremonyFormData,
    userId: string
  ): Promise<CeremonyData> {
    try {
      const formattedData = this.formatCeremonyData(ceremonyData);
      const payload = {
        ...formattedData,
        userId,
        status: "planned",
      };

      const response = await this.axios.post("/events/create", payload);

      if (response.status === 201) {
        return {
          ...response.data.event,
          id: response.data.event._id, // Map _id to id for compatibility
        };
      }

      throw new Error("Failed to create ceremony");
    } catch (error: any) {
      console.error("Error creating ceremony:", error);
      throw new Error(
        error.response?.data?.error || "Failed to create ceremony"
      );
    }
  }

  // Update an existing ceremony
  async updateCeremony(
    ceremonyId: string,
    ceremonyData: Partial<CeremonyFormData>
  ): Promise<CeremonyData> {
    try {
      const formattedData = this.formatCeremonyData(ceremonyData);
      const response = await this.axios.patch(
        `/events/update/${ceremonyId}`,
        formattedData
      );

      if (response.status === 200) {
        return {
          ...response.data.updatedEvent,
          id: response.data.updatedEvent._id, // Map _id to id for compatibility
        };
      }

      throw new Error("Failed to update ceremony");
    } catch (error: any) {
      console.error("Error updating ceremony:", error);
      throw new Error(
        error.response?.data?.error || "Failed to update ceremony"
      );
    }
  }

  // Delete a ceremony
  async deleteCeremony(ceremonyId: string): Promise<void> {
    try {
      const response = await this.axios.delete(`/events/delete/${ceremonyId}`);

      if (response.status !== 200) {
        throw new Error("Failed to delete ceremony");
      }
    } catch (error: any) {
      console.error("Error deleting ceremony:", error);
      throw new Error(
        error.response?.data?.error || "Failed to delete ceremony"
      );
    }
  }

  // Get all ceremonies for a user
  async getUserCeremonies(
    userId: string,
    userRole: string
  ): Promise<CeremonyData[]> {
    try {
      const response = await this.axios.get(
        `/events/by-role/${userId}/${userRole}`
      );

      if (response.status === 200) {
        return response.data.events.map((event: any) => ({
          ...event,
          id: event._id, // Map _id to id for compatibility
          // Format dates for form display
          ...(event.eventDate && {
            eventDate: this.formatDateForInput(new Date(event.eventDate)),
            eventTime: this.formatTimeForInput(new Date(event.eventDate)),
          }),
          ...(event.rehearsalDate && {
            rehearsalDate: this.formatDateForInput(
              new Date(event.rehearsalDate)
            ),
          }),
        }));
      }

      throw new Error("Failed to fetch ceremonies");
    } catch (error: any) {
      console.error("Error fetching ceremonies:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch ceremonies"
      );
    }
  }

  // Get a specific ceremony by ID
  async getCeremonyById(ceremonyId: string): Promise<CeremonyData> {
    try {
      const response = await this.axios.get(`/events/${ceremonyId}`);

      if (response.status === 200) {
        const event = response.data.event;
        return {
          ...event,
          id: event._id, // Map _id to id for compatibility
          // Format dates for form display
          ...(event.eventDate && {
            eventDate: this.formatDateForInput(new Date(event.eventDate)),
            eventTime: this.formatTimeForInput(new Date(event.eventDate)),
          }),
          ...(event.rehearsalDate && {
            rehearsalDate: this.formatDateForInput(
              new Date(event.rehearsalDate)
            ),
          }),
        };
      }

      throw new Error("Failed to fetch ceremony");
    } catch (error: any) {
      console.error("Error fetching ceremony:", error);
      throw new Error(
        error.response?.data?.error || "Failed to fetch ceremony"
      );
    }
  }
}
