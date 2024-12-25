import React, { createContext, useState } from 'react';

export const PackageContext = createContext();

export const PackageProvider = ({ children }) => {
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [scheduledDates, setScheduledDates] = useState([]);
  const [carDetails, setCarDetails] = useState({
    carModel: '',
    licensePlate: '',
    color: ''
  }); // Initialize carDetails with default structure

  return (
    <PackageContext.Provider
      value={{
        selectedPackage,
        setSelectedPackage,
        scheduledDates,
        setScheduledDates,
        carDetails, // Provide carDetails state
        setCarDetails, // Provide carDetails updater
      }}
    >
      {children}
    </PackageContext.Provider>
  );
};