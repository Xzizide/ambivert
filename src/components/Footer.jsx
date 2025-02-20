import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="h-15">
      <hr className="border-gray-300"></hr>
      <div className="flex justify-evenly p-3">
        <Link to="/" className="text-2xl">
          Hem
        </Link>
        <Link to="/chat" className="text-2xl">
          Chat
        </Link>
      </div>
    </footer>
  );
}
