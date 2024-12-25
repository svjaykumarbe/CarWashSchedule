import React from 'react';
import ReactDOM from 'react-dom/client'; // Use 'react-dom/client' for React 18
import App from './App';
import { PackageProvider } from './context/PackageContext'; // Import the PackageProvider
import './styles/tailwind.css';

const root = ReactDOM.createRoot(document.getElementById('root')); // Use createRoot
root.render(
  <React.StrictMode>
    <PackageProvider> {/* Wrap App with PackageProvider */}
      <App />
    </PackageProvider>
  </React.StrictMode>
);