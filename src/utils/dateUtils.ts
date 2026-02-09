/**
 * Date Utility Functions to Handle Timezone Issues
 * 
 * Erie, PA is in the America/New_York timezone (Eastern Time).
 * All date display functions use this timezone to prevent the
 * "one day earlier" bug caused by UTC midnight shifting backwards.
 */

const TIMEZONE = 'America/New_York';

/**
 * Converts a date string (YYYY-MM-DD) to an ISO string at NOON UTC.
 * Using noon UTC (instead of midnight) gives a 12-hour buffer so no
 * timezone on earth shifts the calendar date to the previous/next day.
 * 
 * @param dateString - Date string in YYYY-MM-DD format
 * @returns ISO string at noon UTC
 */
export const convertLocalDateToISO = (dateString: string): string => {
  if (!dateString) return '';
  
  // Split the date string to get year, month, day
  const [year, month, day] = dateString.split('-').map(Number);
  
  // Store at noon UTC to prevent any timezone from shifting the day
  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0, 0));
  
  return date.toISOString();
};

/**
 * Formats a Date object or ISO string to YYYY-MM-DD format for date inputs.
 * Uses Intl.DateTimeFormat with the Erie/Eastern timezone to extract the
 * correct date components, preventing the off-by-one day bug.
 * 
 * @param date - Date object or ISO string
 * @returns Date string in YYYY-MM-DD format
 */
export const formatDateForInput = (date: Date | string | undefined | null): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Use Intl to extract date parts in the correct timezone
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
    
    // en-CA locale formats as YYYY-MM-DD which is what <input type="date"> needs
    return formatter.format(dateObj);
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

/**
 * Converts a time string (HH:MM) and date string (YYYY-MM-DD) to a complete ISO string
 * Stores at the specified time in UTC, preserving the intended date.
 * 
 * @param dateString - Date string in YYYY-MM-DD format
 * @param timeString - Time string in HH:MM format
 * @returns ISO string representing the date and time
 */
export const combineDateAndTime = (dateString: string, timeString: string): string => {
  if (!dateString || !timeString) return '';
  
  const [year, month, day] = dateString.split('-').map(Number);
  const [hours, minutes] = timeString.split(':').map(Number);
  
  // Create in local time context, then convert 
  const date = new Date(year, month - 1, day, hours, minutes, 0, 0);
  
  return date.toISOString();
};

/**
 * Formats a Date object or ISO string to HH:MM format for time inputs
 * Uses the Eastern timezone to extract the correct time.
 * 
 * @param date - Date object or ISO string
 * @returns Time string in HH:MM format
 */
export const formatTimeForInput = (date: Date | string | undefined | null): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Use Intl to get hours/minutes in the correct timezone
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).formatToParts(dateObj);
    
    const hour = parts.find(p => p.type === 'hour')?.value ?? '00';
    const minute = parts.find(p => p.type === 'minute')?.value ?? '00';
    
    return `${hour}:${minute}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

/**
 * Formats a date for DISPLAY purposes (not for form inputs).
 * Always uses America/New_York timezone to prevent the off-by-one bug.
 * 
 * @param date - Date object or ISO string
 * @param options - Additional Intl.DateTimeFormatOptions to override defaults
 * @returns Formatted date string for display (e.g. "June 15, 2026")
 */
export const formatDateForDisplay = (
  date: Date | string | undefined | null,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-US', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      ...options,
    });
  } catch (error) {
    console.error('Error formatting date for display:', error);
    return 'N/A';
  }
};

/**
 * Formats a date for display with weekday included.
 * 
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g. "Monday, June 15, 2026")
 */
export const formatDateWithWeekday = (
  date: Date | string | undefined | null,
): string => {
  return formatDateForDisplay(date, { weekday: 'long' });
};

/**
 * Formats a date for display in short format.
 * 
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g. "Jun 15, 2026")
 */
export const formatDateShort = (
  date: Date | string | undefined | null,
): string => {
  return formatDateForDisplay(date, { month: 'short' });
};

/**
 * Formats a time for DISPLAY purposes.
 * Always uses America/New_York timezone.
 * 
 * @param date - Date object or ISO string
 * @param options - Additional Intl.DateTimeFormatOptions
 * @returns Formatted time string (e.g. "2:30 PM")
 */
export const formatTimeForDisplay = (
  date: Date | string | undefined | null,
  options?: Intl.DateTimeFormatOptions
): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleTimeString('en-US', {
      timeZone: TIMEZONE,
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      ...options,
    });
  } catch (error) {
    console.error('Error formatting time for display:', error);
    return 'N/A';
  }
};

/**
 * Formats a date + time for display (e.g. "June 15, 2026, 2:30 PM")
 * Always uses America/New_York timezone.
 */
export const formatDateTimeForDisplay = (
  date: Date | string | undefined | null,
): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString('en-US', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (error) {
    console.error('Error formatting datetime for display:', error);
    return 'N/A';
  }
};

/**
 * Formats a date for display in en-GB format (DD/MM/YYYY).
 * Always uses America/New_York timezone.
 * 
 * @param date - Date object or ISO string
 * @returns Formatted date string (e.g. "15/06/2026")
 */
export const formatDateGB = (
  date: Date | string | undefined | null
): string => {
  if (!date) return 'N/A';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('en-GB', {
      timeZone: TIMEZONE,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  } catch (error) {
    console.error('Error formatting date (GB):', error);
    return 'N/A';
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
