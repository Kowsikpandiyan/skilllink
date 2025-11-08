import React from 'react';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-600 absolute top-0 left-0" 
             style={{ animationDelay: '0.2s', animationDirection: 'reverse' }}></div>
      </div>
      <p className="mt-4 text-lg text-gray-600 font-medium">Analyzing your resume...</p>
      <p className="mt-2 text-sm text-gray-500">This may take a few seconds</p>
    </div>
  );
};

export default LoadingSpinner;
