import React, { useContext, useState } from 'react';
import axios from 'axios';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { PackageContext } from '../context/PackageContext';

const ScheduleCalendar = () => {
  const {
    selectedPackage,
    scheduledDates,
    setScheduledDates,
    carDetails,
    setCarDetails,
    userId, // Assuming userId is part of the context or can be passed as a prop
  } = useContext(PackageContext);

  const [calendarDate, setCalendarDate] = useState(new Date());
  const [isCarDetailsProvided, setIsCarDetailsProvided] = useState(
    carDetails.carModel && carDetails.licensePlate && carDetails.color && carDetails.carMake
  );
  const [isReviewing, setIsReviewing] = useState(false);

  const handleCarDetailChange = (e) => {
    const { name, value } = e.target;
    setCarDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleDateSelect = (date) => {
    if (!selectedPackage) {
      alert('Please select a package first.');
      return;
    }

    if (!isCarDetailsProvided) {
      alert('Please provide car details before scheduling.');
      return;
    }

    const packageEndDate = new Date();
    packageEndDate.setDate(packageEndDate.getDate() + selectedPackage.duration);

    if (date > packageEndDate) {
      alert(`Date exceeds the package duration (${selectedPackage.duration} days).`);
      return;
    }

    if (scheduledDates.length >= selectedPackage.washes) {
      alert(`You have reached the maximum of ${selectedPackage.washes} washes for this package.`);
      return;
    }

    if (scheduledDates.some((d) => d.getTime() === date.getTime())) {
      alert('This date is already scheduled.');
      return;
    }

    setScheduledDates([...scheduledDates, date]);
  };

  const handleRemoveDate = (date) => {
    setScheduledDates(scheduledDates.filter((d) => d.getTime() !== date.getTime()));
  };

  const handleCarDetailsSubmit = (e) => {
    e.preventDefault();
    if (carDetails.carModel && carDetails.licensePlate && carDetails.color && carDetails.carMake) {
      setIsCarDetailsProvided(true);
    } else {
      alert('Please fill out all car details.');
    }
  };

  const handleReview = () => {
    setIsReviewing(true);
  };

  const handleSubmit = async () => {
    try {
      const requestData = {
        userId: userId || '01',
        carMake: carDetails.carMake || '',
        carModel: carDetails.carModel,
        registrationNumber: carDetails.licensePlate,
        color: carDetails.color,
        additionalNotes: carDetails.additionalNotes || '',
        scheduledDates: scheduledDates.map((date) => date.toISOString()),
      };

      console.log('Request Payload:', requestData); // Debugging log

      const response = await axios.post('http://localhost:4000/api/car-details', requestData);

      alert('Booking submitted successfully!');
      console.log('Response:', response.data);

      setScheduledDates([]);
      setCarDetails({ carModel: '', licensePlate: '', color: '', carMake: '', additionalNotes: '' });
      setIsCarDetailsProvided(false);
      setIsReviewing(false);
    } catch (err) {
      console.error('Error submitting booking:', err.response?.data || err.message);
      alert('Failed to submit booking. Please try again later.');
    }
  };

  const handleAddAnotherCar = () => {
    setScheduledDates([]);
    setCarDetails({ carModel: '', licensePlate: '', color: '', carMake: '', additionalNotes: '' });
    setIsCarDetailsProvided(false);
    setIsReviewing(false);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Schedule Your Washes</h2>

      {!isCarDetailsProvided && (
        <div className="car-details-form mb-6">
          <h3 className="text-lg font-semibold mb-2">Provide Your Car Details</h3>
          <form onSubmit={handleCarDetailsSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="carMake">Car Make</label>
              <input
                type="text"
                id="carMake"
                name="carMake"
                value={carDetails.carMake || ''}
                onChange={handleCarDetailChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter your car make"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="carModel">Car Model</label>
              <input
                type="text"
                id="carModel"
                name="carModel"
                value={carDetails.carModel || ''}
                onChange={handleCarDetailChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter your car model"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="licensePlate">License Plate</label>
              <input
                type="text"
                id="licensePlate"
                name="licensePlate"
                value={carDetails.licensePlate || ''}
                onChange={handleCarDetailChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter your license plate"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="color">Color</label>
              <input
                type="text"
                id="color"
                name="color"
                value={carDetails.color || ''}
                onChange={handleCarDetailChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter your car color"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="additionalNotes">Additional Notes</label>
              <textarea
                id="additionalNotes"
                name="additionalNotes"
                value={carDetails.additionalNotes || ''}
                onChange={handleCarDetailChange}
                className="w-full border rounded px-3 py-2"
                placeholder="Enter any additional notes (optional)"
              />
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white py-2 px-4 rounded"
            >
              Save Car Details
            </button>
          </form>
        </div>
      )}

      {isCarDetailsProvided && !isReviewing && (
        <>
          <Calendar
            onChange={setCalendarDate}
            value={calendarDate}
            onClickDay={handleDateSelect}
            tileClassName={({ date }) =>
              scheduledDates.some((d) => d.getTime() === date.getTime())
                ? 'bg-green-200'
                : ''
            }
          />
          {scheduledDates.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold">Scheduled Dates:</h3>
              <ul className="list-disc ml-6">
                {scheduledDates.map((date, index) => (
                  <li key={index} className="flex justify-between items-center">
                    {date.toDateString()}
                    <button
                      className="ml-4 bg-red-500 text-white py-1 px-2 rounded-lg"
                      onClick={() => handleRemoveDate(date)}
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          <button
            onClick={handleReview}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
            Review & Submit
          </button>
        </>
      )}

      {isReviewing && (
        <div className="review-section mt-6">
          <h3 className="text-lg font-semibold mb-4">Review Your Booking</h3>
          <p><strong>Car Make:</strong> {carDetails.carMake}</p>
          <p><strong>Car Model:</strong> {carDetails.carModel}</p>
          <p><strong>License Plate:</strong> {carDetails.licensePlate}</p>
          <p><strong>Car Color:</strong> {carDetails.color}</p>
          <p><strong>Additional Notes:</strong> {carDetails.additionalNotes || 'None'}</p>
          <h4 className="mt-4 text-md font-semibold">Scheduled Wash Dates:</h4>
          <ul className="list-disc ml-6">
            {scheduledDates.map((date, index) => (
              <li key={index}>{date.toDateString()}</li>
            ))}
          </ul>
          <div className="mt-4">
            <button
              onClick={handleSubmit}
              className="bg-green-500 text-white py-2 px-4 rounded mr-4"
            >
              Submit
            </button>
            <button
              onClick={handleAddAnotherCar}
              className="bg-gray-500 text-white py-2 px-4 rounded"
            >
              Add Another Car
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ScheduleCalendar;