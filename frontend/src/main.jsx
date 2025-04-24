import React from 'react';
import ReactDOM from 'react-dom/client';
import { StrictMode } from 'react';
import App from './App.jsx';

// Import CSS
import './index.css';
import './App.css';

// Import Firebase auth context provider
import { AuthProvider } from './context/AuthContext';

// Create root element
const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

// Render app wrapped in providers
root.render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);