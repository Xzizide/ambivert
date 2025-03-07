import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav className="flex justify-evenly p-2">
        <Link to="/">
          <img src="src/assets/logo.png" alt="" className="w-60" />
        </Link>
        <div className="p-10 flex justify-evenly w-100">
          <Link
            to="/chat"
            className="text-3xl text-red-300 hover:underline hover:text-red-500"
          >
            To chatroom
          </Link>
          <Link
            to="/register"
            className="text-3xl text-red-300 hover:underline hover:text-red-500"
          >
            Register
          </Link>
        </div>
      </nav>
      <hr className="border-gray-300"></hr>
    </header>
  );
}
