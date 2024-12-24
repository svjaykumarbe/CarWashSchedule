export const isDateWithinRange = (date, duration) => {
    const today = new Date();
    const endDate = new Date();
    endDate.setDate(today.getDate() + duration);
    return date >= today && date <= endDate;
  };
  
  export const isDateScheduled = (date, scheduledDates) => {
    return scheduledDates.some((d) => d.getTime() === date.getTime());
  };  