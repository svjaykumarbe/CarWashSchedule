import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [fullName, setFullName] = useState(''); // Changed FullName to fullName for consistency
  const [phoneNumber, setPhoneNumber] = useState(''); // Changed PhoneNumber to phoneNumber
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // Changed Password to password
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    // Check for empty fields
    if (!fullName || !phoneNumber || !email || !password) {
      alert('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:4000/api/signup', {
        fullName,
        phoneNumber,
        email,
        password,
      });

      if (response.status === 201) {
        alert('User registered successfully! Redirecting to Sign In page.');
        // Clear form fields
        setFullName('');
        setPhoneNumber('');
        setEmail('');
        setPassword('');
        // Redirect to Sign In page
        navigate('/signin');
      }
    } catch (error) {
      console.error('Error during signup:', error);
      if (error.response && error.response.data) {
        // Show backend error message if available
        alert(`Failed to register user: ${error.response.data.message}`);
      } else {
        alert('Failed to register user. Please try again later.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Sign Up</h2>
        <form onSubmit={handleSignup} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Number</label>
            <input
              type="text"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 mt-1 border rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-lg shadow hover:bg-blue-700"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;