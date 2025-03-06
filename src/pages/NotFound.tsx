
import React, { useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

const NotFound: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 py-24">
      <div className="text-center max-w-md">
        <span className="inline-block text-xs font-medium px-3 py-1 bg-gray-100 rounded-full text-gray-600 mb-6 animate-fade-down">
          404 Error
        </span>
        <h1 className="text-4xl md:text-5xl font-semibold mb-6 animate-fade-up" style={{ animationDelay: '100ms' }}>
          Page not found
        </h1>
        <p className="text-lg text-gray-600 mb-8 animate-fade-up" style={{ animationDelay: '200ms' }}>
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center justify-center px-6 py-3 rounded-full bg-gray-900 text-white font-medium transition-all duration-300 hover:bg-gray-800 hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] animate-fade-up"
          style={{ animationDelay: '300ms' }}
        >
          Return Home
        </Link>
      </div>
      
      <div className="mt-12 relative w-48 h-48 animate-fade-up" style={{ animationDelay: '400ms' }}>
        <div className="absolute inset-0 rounded-3xl border-2 border-gray-100 transform rotate-6"></div>
        <div className="absolute inset-0 rounded-3xl border-2 border-gray-200 transform -rotate-3"></div>
        <div className="absolute inset-0 rounded-3xl bg-gray-50 flex items-center justify-center">
          <div className="text-9xl font-light text-gray-300">?</div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
