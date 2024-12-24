import React, { useContext } from 'react';
import { PackageContext } from '../context/PackageContext';

const PackageSelector = () => {
  const { selectedPackage, setSelectedPackage, setScheduledDates } = useContext(PackageContext);

  const packages = [
    { name: '90 Days - 12 Washes', duration: 90, washes: 12 },
    { name: '60 Days - 8 Washes', duration: 60, washes: 8 },
    { name: '30 Days - 4 Washes', duration: 30, washes: 4 },
  ];

  const handleSelectPackage = (pkg) => {
    setSelectedPackage(pkg);
    setScheduledDates([]); // Clear any existing schedules when a new package is selected
  };

  return (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Choose a Car Wash Package</h2>
      <div className="grid gap-4 sm:grid-cols-3">
        {packages.map((pkg, index) => (
          <button
            key={index}
            className={`py-3 px-5 text-center rounded-lg font-semibold transition-all duration-300 ease-in-out ${
              selectedPackage?.name === pkg.name
                ? 'bg-blue-600 text-white ring-2 ring-blue-500'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
            onClick={() => handleSelectPackage(pkg)}
          >
            {pkg.name}
          </button>
        ))}
      </div>
      {selectedPackage && (
        <div className="mt-6 p-4 bg-blue-50 border-l-4 border-blue-400 text-blue-800">
          <p>
            <strong>Selected Package:</strong> {selectedPackage.name}
          </p>
          <p className="text-sm mt-1">
            Enjoy {selectedPackage.washes} washes over {selectedPackage.duration} days.
          </p>
        </div>
      )}
    </div>
  );
};

export default PackageSelector;