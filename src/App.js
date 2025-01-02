import { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { PackageProvider } from './context/PackageContext';
import PackageSelector from './components/PackageSelector';
import ScheduleCalendar from './components/ScheduleCalendar';
import SignInPage from './components/SignInPage';
import SignupPage from './components/SignupPage';
import './styles/App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSignUpMode, setIsSignUpMode] = useState(true);

  const handleToggleAuth = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  return (
    <Router>
      <PackageProvider>
        <div className="min-h-screen bg-gray-50 text-gray-800">
          {/* Header */}
          <header className="bg-blue-600 text-white py-6 shadow-lg">
            <div className="container mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/logo.png"
                  alt="Car Wash Scheduler Logo"
                  className="w-16 h-16 object-contain"
                />
                <h1 className="text-3xl font-bold">Car Wash Scheduler</h1>
              </div>
              {!isAuthenticated ? (
                <Link
                  to={isSignUpMode ? '/signup' : '/signin'}
                  onClick={handleToggleAuth}
                  className="bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold shadow hover:bg-gray-100"
                >
                  {isSignUpMode ? 'Sign Up' : 'Sign In'}
                </Link>
              ) : (
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="bg-white text-blue-600 py-2 px-4 rounded-lg font-semibold shadow hover:bg-gray-100"
                >
                  Sign Out
                </button>
              )}
            </div>
          </header>

          {/* Hero Section */}
          <section className="relative bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-16">
            <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
              {/* Left Content */}
              <div className="text-center md:text-left md:w-1/2 space-y-6">
                <h2 className="text-5xl font-extrabold">
                  Schedule Your Car Wash <br /> With Ease
                </h2>
                <p className="text-lg">
                  Choose your package, pick a date, and let us handle the rest. Effortless car wash scheduling for a busy life.
                </p>
                <p></p>
                <Link
                  to="/signup"
                  className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow hover:bg-gray-200"
                >
                  Get Started
                </Link>
              </div>

              {/* Right Content */}
              <div className="mt-10 md:mt-0 md:w-1/2 flex justify-center">
                <img
                  src="/Logo.png"
                  alt="Car Wash Illustration"
                  className="w-3/4 md:w-full max-w-md"
                />
              </div>
            </div>
          </section>

          {/* Main Content */}
          <main className="container mx-auto py-12 space-y-12">
            <Routes>
              <Route path="/signin" element={<SignInPage onSignIn={() => setIsAuthenticated(true)} />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/dashboard"
                element={
                  isAuthenticated ? (
                    <>
                      <section className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Select Your Package</h2>
                        <PackageSelector />
                      </section>
                      <section className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Schedule Your Washes</h2>
                        <ScheduleCalendar />
                      </section>
                    </>
                  ) : (
                    <SignInPage onSignIn={() => setIsAuthenticated(true)} />
                  )
                }
              />
              <Route
                path="/"
                element={
                  isAuthenticated ? (
                    <>
                      <section className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Select Your Package</h2>
                        <PackageSelector />
                      </section>
                      <section className="bg-white shadow rounded-lg p-6">
                        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Schedule Your Washes</h2>
                        <ScheduleCalendar />
                      </section>
                    </>
                  ) : (
                    <SignInPage onSignIn={() => setIsAuthenticated(true)} />
                  )
                }
              />
            </Routes>
          </main>

          {/* Footer */}
          <footer className="bg-blue-600 text-white py-6">
            <div className="container mx-auto text-center">
              <p>&copy; 2024 Car Wash Scheduler. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </PackageProvider>
    </Router>
  );
}

export default App;