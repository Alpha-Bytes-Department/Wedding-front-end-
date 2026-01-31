/**
 * Date Utility Functions to Handle Timezone Issues
 * 
 * These functions ensure that dates selected in date inputs are preserved
 * as local dates without timezone conversion issues.
 */

/**
 * Converts a date string (YYYY-MM-DD) to a Date object at local midnight
 * This prevents the "one day earlier" issue when dates are stored in UTC
 * 
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns ISO string with local timezone offset preserved
 */
export const convertLocalDateToISO = (dateString: string): string => {
  if (!dateString) return '';
  
  // Split the date string to get year, month, day
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Create a date at local midnight (not UTC midnight)
  const date = new Date(year, month - 1, day, 0, 0, 0, 0);
  
  return date.toISOString();
};

/**
 * Formats a Date object or ISO string to YYYY-MM-DD format for date inputs
 * Extracts the date in local timezone to prevent timezone shifting
 * 
 * @param date - Date object or ISO string
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (date: Date | string | undefined | null): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Get local date components
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    
    return `${year}-${month}-${day}`;
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Converts a time string (HH:MM) and date string (YYYY-MM-DD) to a complete ISO string
 * 
 * @param dateString - Date string in YYYY-MM-DD format
 * @param timeString - Time string in HH:MM format
 * @returns ISO string representing the local date and time
 */
export const combineDateAndTime = (dateString: string, timeString: string): string => {
  if (!dateString || !timeString) return '';
  
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);
  
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  
  return date.toISOString();
};

/**
 * Formats a Date object or ISO string to HH:MM format for time inputs
 * 
 * @param date - Date object or ISO string
 * @returns Time string in HH:MM format
 */
export const formatTimeForInput = (date: Date | string | undefined | null): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Gets the minimum date string for date inputs (today's date)
 * 
 * @returns Date string in YYYY-MM-DD format representing today
 */
export const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};
