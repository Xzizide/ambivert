import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer>
      <hr className="border-gray-300"></hr>
      <Link to="/">Hem</Link>
    </footer>
  );
}
