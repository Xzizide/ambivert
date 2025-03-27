import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-50 to-pink-100 shadow-inner">
      <div className="h-0.5 bg-gradient-to-r from-pink-200 via-pink-400 to-pink-200 opacity-50 mb-4"></div>
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center space-x-8 items-center">
          <Link to="/" className="group flex flex-col items-center">
            <span className="text-pink-600 font-medium group-hover:text-pink-800 transition-colors duration-300">
              Home
            </span>
            <span className="h-0.5 w-0 bg-pink-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <div className="h-6 w-0.5 bg-pink-300"></div>
          <Link to="/about" className="group flex flex-col items-center">
            <span className="text-pink-600 font-medium group-hover:text-pink-800 transition-colors duration-300">
              About
            </span>
            <span className="h-0.5 w-0 bg-pink-600 group-hover:w-full transition-all duration-300"></span>
          </Link>
        </div>
        <div className="text-center text-sm text-pink-500 mt-4">
          © {new Date().getFullYear()} Ambivert. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
