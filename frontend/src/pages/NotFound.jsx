import React from 'react';
import { Link } from 'react-router-dom';
import { HiHome, HiExclamation } from 'react-icons/hi';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-8">
      <div className="text-center">
        <HiExclamation className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
        
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        
        <h2 className="text-2xl font-bold text-gray-800 mt-4 mb-2">Page Not Found</h2>
        
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-4">
          <Link
            to="/dashboard"
            className="inline-flex items-center btn-primary px-6 py-3"
          >
            <HiHome className="w-5 h-5 mr-2" />
            Go to Dashboard
          </Link>
          
          <p className="text-sm text-gray-500">
            Or{' '}
            <Link to="/login" className="text-primary hover:text-primary/80">
              return to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;