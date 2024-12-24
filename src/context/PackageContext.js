import React, { createContext, useState } from 'react';

export const PackageContext = createContext();

export const PackageProvider = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [scheduledDates, setScheduledDates] = useState([]);

  return (
    <PackageContext.Provider
      value={{
        selectedPackage,
        setSelectedPackage,
        scheduledDates,
        setScheduledDates,
      }}
    >
      {children}
    </PackageContext.Provider>
  );
};