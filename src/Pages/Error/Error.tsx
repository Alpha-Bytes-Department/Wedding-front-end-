import React from "react";
import { Link } from "react-router-dom";

const Error: React.FC = () => {
  return (
    <div className="bg-[url('/background.jpg')] min-h-screen bg-cover bg-center flex items-center justify-center">
      <div className="text-center font-secondary">
        <h1 className="text-4xl font-secondary font-bold mb-4 text-red-700">
          Error
        </h1>
        <h2 className="text-9xl font-primary mb-2 text-primary">404</h2>
        <p className="text-lg text-gray-700">Sorry, Page not found.</p>
        <Link to="/" >
          <p className="text-text text-lg font-semibold rounded-xl p-4 border border-primary mt-10 hover:bg-primary">
            Go back to Home
          </p>
        </Link>
      </div>
    </div>
  );
};

export default Error;
