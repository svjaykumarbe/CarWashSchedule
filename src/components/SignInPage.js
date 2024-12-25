import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // Using useNavigate
import './SignInPage.css';

function SignInPage({ onSignIn }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');  // For displaying error messages

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulated authentication logic
    const isAuthenticated = email === 'jey@test.com' && password === '12345';

    if (isAuthenticated) {
      onSignIn(); // Notify App.js that the user is signed in
      navigate('/dashboard'); // Navigate to the dashboard or main page
    } else {
      setErrorMessage('Invalid credentials, please try again.');
    }
  };

  return (
    <div className="signin-container">
      <div className="signin-box">
        <header className="signin-header">
          <img src="/Logo.png" alt="Car Wash Logo" className="signin-logo" />
          <h2>Book Your Car Wash in Minutes</h2>
        </header>

        <form onSubmit={handleSubmit} className="signin-form">
          <div className="input-group">
            <label htmlFor="email">Email or Username</label>
            <input 
              type="text" 
              id="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
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