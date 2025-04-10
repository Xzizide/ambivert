import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import accountStorage from "./TokenStorage";

export default function Header() {
  const { token } = accountStorage();
  const removeToken = accountStorage((state) => state.removeToken);
  const clientData = accountStorage((state) => state.clientData);
  const getClientData = accountStorage((state) => state.getClientData);

  const isLoggedIn = !!token;

  function logoutClient() {
    removeToken();
  }

  useEffect(() => {
    if (isLoggedIn) {
      getClientData();
    }
  }, [token]);

  return (
    <header className="bg-gradient-to-r from-pink-50 to-pink-100 shadow-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="src/assets/ambifav.png"
            alt="Ambivert Logo"
            className="w-12 h-12 rounded-full object-cover border-2 border-pink-200 hover:scale-110 transition-transform duration-300"
          />
          <span className="text-2xl font-bold text-pink-700 tracking-wider">
            Ambivert
          </span>
        </Link>
        {isLoggedIn ? (
          <nav className="flex items-center space-x-6">
            <p className="text-pink-600 font-medium mr-10">
              Welcome {clientData && clientData.username}
            </p>
            <button
              onClick={() => logoutClient()}
              className="relative group text-pink-600 font-medium px-3 py-2 rounded-lg hover:bg-pink-100 transition-all duration-300 ease-in-out cursor-pointer"
            >
              <span className="relative">
                Log out
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </button>
          </nav>
        ) : (
          <nav className="flex items-center space-x-6">
            <Link
              to="/login"
              className="relative group text-pink-600 font-medium px-3 py-2 rounded-lg hover:bg-pink-100 transition-all duration-300 ease-in-out"
            >
              <span className="relative">
                Log in
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
            <Link
              to="/register"
              className="relative group text-pink-600 font-medium px-3 py-2 rounded-lg hover:bg-pink-100 transition-all duration-300 ease-in-out"
            >
              <span className="relative">
                Register
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-pink-600 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </Link>
          </nav>
        )}
      </div>
      <div className="h-0.5 bg-gradient-to-r from-pink-200 via-pink-400 to-pink-200 opacity-50"></div>
    </header>
  );
}
