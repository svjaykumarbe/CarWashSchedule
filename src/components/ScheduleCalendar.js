import React, { useContext, useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { PackageContext } from '../context/PackageContext';

const ScheduleCalendar = () => {
  const { selectedPackage, scheduledDates, setScheduledDates } = useContext(PackageContext);
  const [calendarDate, setCalendarDate] = useState(new Date());

  const handleDateSelect = (date) => {
    if (!selectedPackage) {
      alert('Please select a package first.');
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

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Schedule Your Washes</h2>
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
      {selectedPackage && (
        <p className="mt-4 text-gray-700">
          Remaining Washes: {selectedPackage.washes - scheduledDates.length}
        </p>
      )}
    </div>
  );
};

export default ScheduleCalendar;