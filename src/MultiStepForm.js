import React, { useState } from 'react';
import PackageSelector from './PackageSelector';

const MultiStepForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    package: null,
    carDetails: {
      model: '',
      color: '',
      plate: '',
    },
    userInfo: {
      name: '',
      email: '',
      phone: '',
    },
  });

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  return (
    <div className="space-y-4">
      {step === 1 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Select a Package</h2>
          <PackageSelector
            onSelect={(pkg) => handleInputChange('package', 'selectedPackage', pkg)}
          />
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-4"
            onClick={handleNext}
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Enter Car Details</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Car Model"
              value={formData.carDetails.model}
              onChange={(e) =>
                handleInputChange('carDetails', 'model', e.target.value)
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Car Color"
              value={formData.carDetails.color}
              onChange={(e) =>
                handleInputChange('carDetails', 'color', e.target.value)
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="text"
              placeholder="License Plate"
              value={formData.carDetails.plate}
              onChange={(e) =>
                handleInputChange('carDetails', 'plate', e.target.value)
              }
              className="w-full p-2 border rounded"
            />
          </form>
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 className="text-xl font-semibold mb-4">Enter User Information</h2>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={formData.userInfo.name}
              onChange={(e) =>
                handleInputChange('userInfo', 'name', e.target.value)
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.userInfo.email}
              onChange={(e) =>
                handleInputChange('userInfo', 'email', e.target.value)
              }
              className="w-full p-2 border rounded"
            />
            <input
              type="tel"
              placeholder="Phone"
              value={formData.userInfo.phone}
              onChange={(e) =>
                handleInputChange('userInfo', 'phone', e.target.value)
              }
              className="w-full p-2 border rounded"
            />
          </form>
          <div className="flex justify-between mt-4">
            <button
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleBack}
            >
              Back
            </button>
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
              onClick={() => alert('Submitted Successfully!')}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MultiStepForm;