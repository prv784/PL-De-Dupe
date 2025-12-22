// frontend/src/components/DebugRoutes.jsx
import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';

const DebugRoutes = () => {
  const location = useLocation();
  
  return (
    <div className="fixed bottom-4 right-4 bg-red-500 text-white p-4 rounded-lg shadow-lg z-50">
      <h3 className="font-bold">Route Debug Info:</h3>
      <p>Current path: {location.pathname}</p>
      <p>Hash: {location.hash}</p>
      <p>Search: {location.search}</p>
    </div>
  );
};

export default DebugRoutes;