import { Brain, Loader2 } from 'lucide-react';

const LoadingSpinner = ({ 
  message = "Loading...", 
  size = "large", 
  showBrain = true,
  className = "" 
}) => {
  const sizeClasses = {
    small: "h-6 w-6",
    medium: "h-10 w-10", 
    large: "h-16 w-16"
  };

  const brainSizes = {
    small: "h-3 w-3",
    medium: "h-5 w-5",
    large: "h-6 w-6"
  };

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="relative">
        {/* Spinning border */}
        <div className={`animate-spin rounded-full border-b-2 border-primary-600 ${sizeClasses[size]}`}></div>
        
        {/* Brain icon in center */}
        {showBrain && (
          <Brain className={`text-primary-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${brainSizes[size]}`} />
        )}
      </div>
      
      {message && (
        <div className="mt-4 text-center">
          <p className="text-gray-600 font-medium">{message}</p>
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Alternative spinner with different animation
export const PulseSpinner = ({ message = "Processing...", className = "" }) => {
  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="relative">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
          <div className="w-12 h-12 bg-primary-200 rounded-full flex items-center justify-center animate-pulse">
            <Brain className="h-6 w-6 text-primary-600" />
          </div>
        </div>
        
        {/* Pulse rings */}
        <div className="absolute inset-0 rounded-full border-2 border-primary-300 pulse-ring"></div>
        <div className="absolute inset-0 rounded-full border-2 border-primary-300 pulse-ring" style={{ animationDelay: '0.5s' }}></div>
      </div>
      
      {message && (
        <p className="mt-4 text-gray-600 font-medium text-center">{message}</p>
      )}
    </div>
  );
};

// Skeleton loader for content
export const SkeletonLoader = ({ lines = 3, className = "" }) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div key={index} className="mb-4">
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        </div>
      ))}
    </div>
  );
};

// Progress spinner with percentage
export const ProgressSpinner = ({ 
  progress = 0, 
  message = "Loading...", 
  className = "" 
}) => {
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className={`flex flex-col items-center justify-center p-8 ${className}`}>
      <div className="relative w-24 h-24">
        <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            className="text-gray-200"
          />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="currentColor"
            strokeWidth="8"
            fill="transparent"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary-600 transition-all duration-300 ease-in-out"
          />
        </svg>
        
        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-semibold text-primary-600">
            {Math.round(progress)}%
          </span>
        </div>
      </div>
      
      {message && (
        <p className="mt-4 text-gray-600 font-medium text-center">{message}</p>
      )}
    </div>
  );
};

// Simple inline spinner
export const InlineSpinner = ({ size = "small", className = "" }) => {
  const sizeClass = size === "small" ? "h-4 w-4" : "h-6 w-6";
  
  return (
    <Loader2 className={`animate-spin ${sizeClass} ${className}`} />
  );
};

export default LoadingSpinner;