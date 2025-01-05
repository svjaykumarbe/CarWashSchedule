import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './DashboardPage.css';

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Added loading state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token'); // Retrieve token
        if (!token) {
          // If token is not available, redirect to signin page
          navigate('/signin');
          return;
        }

        const response = await axios.get('http://localhost:4000/api/dashboard', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('API Response:', response.data); // Log API response

        // Assuming the backend sends the user and schedules in the expected format
        setUser(response.data.user); // The user object with car details
        setSchedules(response.data.schedules); // List of schedule details
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        if (error.response?.status === 401) {
          navigate('/signin');
        }
      } finally {
        setIsLoading(false); // Loading completed
      }
    };

    fetchData();
  }, [navigate]);

  const handleBack = () => {
    navigate('/'); // Navigate to the main page
  };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Welcome, {user?.FullName || 'User'}!</h1>
        <button className="back-button" onClick={handleBack}>
          Back
        </button>
      </header>

      {isLoading ? (
        <p>Loading your dashboard...</p>
      ) : (
        <section className="dashboard-details">
          <h2>Your Schedule Details</h2>
          {schedules.length > 0 ? (
            <div className="schedules">
              {schedules.map((schedule) => (
                <div className="schedule-card" key={schedule.ScheduleID}>
                  <h3>Package: {schedule.ScheduledPackage}</h3>
                  <p>
                    Status: 
                    <span 
                      className={
                        schedule.Status === 'Used'
                          ? 'red'
                          : schedule.Status === 'Missed'
                          ? 'grey'
                          : 'green'
                      }
                    >
                      {schedule.Status}
                    </span>
                  </p>
                  <div className="car-details">
                    {user?.carDetails ? (
                      <>
                        <p><strong>Car Make:</strong> {user.carDetails.CarMake}</p>
                        <p><strong>Car Model:</strong> {user.carDetails.CarModel}</p>
                        <p><strong>Registration:</strong> {user.carDetails.RegistrationNumber}</p>
                        <p><strong>Color:</strong> {user.carDetails.Color}</p>
                      </>
                    ) : (
                      <p>Car details are not available.</p>
                    )}
                  </div>
                  <div className="scheduled-dates">
                    <h4>Scheduled Dates:</h4>
                    {Array.isArray(schedule.ScheduledDates) && schedule.ScheduledDates.length > 0 ? (
                      schedule.ScheduledDates.map((date, index) => (
                        <p
                          key={index}
                          className={
                            date.Status === 'Used'
                              ? 'red'
                              : date.Status === 'Missed'
                              ? 'grey'
                              : 'green'
                          }
                        >
                          {new Date(date.ScheduledDateTime).toLocaleDateString()} - {date.Status}
                        </p>
                      ))
                    ) : (
                      <p>No scheduled dates available.</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>No schedules found.</p>
          )}
        </section>
      )}
    </div>
  );
}

export default DashboardPage;