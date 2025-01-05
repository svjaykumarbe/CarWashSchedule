import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // To handle API calls
import './SignInPage.css';

function SignInPage({ onSignIn }) {
  const [identifier, setIdentifier] = useState(''); // Identifier can be email or username
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState(''); // For displaying error messages

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = { identifier, password }; // Sending email or username along with password

    try {
      console.log('Sending login request:', loginData);

      // Make an API call to authenticate the user
      const response = await axios.post(
        'http://localhost:4000/api/login',
        loginData,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.data.success) {
        console.log('Login successful:', response.data);

        // Store the token if provided
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }

        // Optionally save user info (can be expanded based on requirements)
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        // Notify App.js that the user is signed in
        if (onSignIn) onSignIn();

        // Redirect to the dashboard
        navigate('/dashboard');
      } else {
        setErrorMessage(response.data.message || 'Invalid credentials, please try again.');
      }
    } catch (error) {
      console.error('Error during login:', error.response?.data || error.message);

      // Display appropriate error messages
      const serverError = error.response?.data?.message || 'An error occurred during login. Please try again later.';
      setErrorMessage(serverError);
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <header className="signin-title">
          <h2>Book Your Car Wash in Minutes</h2>
        </header>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="input-group">
            <label htmlFor="identifier">Email or Username</label>
            <input
              type="text"
              id="identifier"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              placeholder="Enter your email or username"
              className="input-field"
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="input-field"
            />
          </div>

          <div className="remember-me">
            <input
              type="checkbox"
              id="rememberMe"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
            />
            <label htmlFor="rememberMe">Remember Me</label>
          </div>

          {errorMessage && <div className="error-message">{errorMessage}</div>}

          <button type="submit" className="signin-button">Sign In</button>

          <div className="forgot-password">
            <a href="/forgot-password">Forgot your password?</a>
          </div>

          <div className="signup-prompt">
            <span>Don't have an account? </span>
            <a href="/signup">Sign up</a>
          </div>
        </form>

        <footer className="signin-footer">
          <a href="/privacy-policy">Privacy Policy</a> | <a href="/terms-of-service">Terms of Service</a>
        </footer>
      </div>
    </div>
  );
}

export default SignInPage;