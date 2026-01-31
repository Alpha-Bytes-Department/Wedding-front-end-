import type { AxiosInstance } from "axios";
import type { CeremonyFormData, CeremonyData } from "../types";
import { 
  convertLocalDateToISO, 
  combineDateAndTime, 
  formatDateForInput, 
  formatTimeForInput 
} from "../../../../utils/dateUtils";

export class CeremonyApiService {
  private axios: AxiosInstance;

  constructor(axiosInstance: AxiosInstance) {
    this.axios = axiosInstance;
  }

  /**
   * Helper function to format form data for backend compatibility
   *
   * Handles the following transformations:
   * - Converts eventDate string to ISO with local timezone
   * - Converts eventTime string to ISO with combined date and time
   * - Converts rehearsalDate string to ISO with local timezone
   * - Removes empty strings and null values
   * - Provides error handling for date parsing failures
   *
   * @param data - Partial ceremony form data
   * @returns Formatted data ready for backend submission
   */
  private formatCeremonyData(data: Partial<CeremonyFormData>): any {
    const formattedData: any = { ...data };

    // Convert eventDate and eventTime to proper ISO strings
    if (formattedData.eventDate && formattedData.eventTime) {
      try {
        // Combine date and time into a single ISO string for eventTime
        formattedData.eventTime = combineDateAndTime(
          formattedData.eventDate,
          formattedData.eventTime
        );
        // Convert eventDate to ISO with local timezone
        formattedData.eventDate = convertLocalDateToISO(formattedData.eventDate);
      } catch (error) {
        console.error("Error parsing date/time:", error);
        // If parsing fails, remove the problematic fields
        delete formattedData.eventTime;
        delete formattedData.eventDate;
      }
    } else if (formattedData.eventTime && !formattedData.eventDate) {
      try {
        // If only time is provided, use today's date
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        const todayString = `${year}-${month}-${day}`;
        formattedData.eventTime = combineDateAndTime(todayString, formattedData.eventTime);
      } catch (error) {
        console.error("Error parsing time:", error);
        delete formattedData.eventTime;
      }
    } else if (formattedData.eventDate) {
      try {
        // Convert eventDate to ISO with local timezone if provided
        formattedData.eventDate = convertLocalDateToISO(formattedData.eventDate);
      } catch (error) {
        console.error("Error parsing date:", error);
        delete formattedData.eventDate;
      }
    }

    // Convert rehearsalDate to ISO with local timezone if provided
    if (formattedData.rehearsalDate) {
      try {
        formattedData.rehearsalDate = convertLocalDateToISO(formattedData.rehearsalDate);
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
  private formatDateForInputLocal(date: Date | string): string {
    return formatDateForInput(date);
  }

  // Helper method to format Date to HH:MM for time input
  private formatTimeForInputLocal(date: Date | string): string {
    return formatTimeForInput(date);
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
        // Use the status from ceremonyData if provided, otherwise default to "planned"
        status: ceremonyData.status || "planned",
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
      // console.log("Fetched ceremonies:", response.data);

      if (response.status === 200) {
        return response.data.events.map((event: any) => ({
          ...event,
          id: event._id, // Map _id to id for compatibility
          // Format dates for form display
          ...(event.eventDate && {
            eventDate: this.formatDateForInputLocal(new Date(event.eventDate)),
            eventTime: this.formatTimeForInputLocal(new Date(event.eventDate)),
          }),
          ...(event.rehearsalDate && {
            rehearsalDate: this.formatDateForInputLocal(
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
            eventDate: this.formatDateForInputLocal(new Date(event.eventDate)),
            eventTime: this.formatTimeForInputLocal(new Date(event.eventDate)),
          }),
          ...(event.rehearsalDate && {
            rehearsalDate: this.formatDateForInputLocal(
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
