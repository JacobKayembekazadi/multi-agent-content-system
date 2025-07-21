import React, { useState, useEffect } from 'react';
import ContentMarketingDashboard from './components/ContentMarketingDashboard';
import './App.css';

function App() {
  const [apiConnection, setApiConnection] = useState(false);

  useEffect(() => {
    // Check API connection on app startup
    const checkApiConnection = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/health`);
        if (response.ok) {
          setApiConnection(true);
        }
      } catch (error) {
        console.error('API connection failed:', error);
        setApiConnection(false);
      }
    };

    checkApiConnection();
    
    // Set up periodic health checks
    const interval = setInterval(checkApiConnection, 30000);
    return () => clearInterval(interval);
  }, []);

  if (!apiConnection) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Connecting to AI Framework...</h2>
          <p className="text-gray-600">Establishing connection with backend services</p>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <ContentMarketingDashboard />
    </div>
  );
}

export default App; 