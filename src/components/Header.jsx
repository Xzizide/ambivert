import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="flex justify-evenly">
      <Link to="/">
        <img src="src/assets/logo.png" alt="" />
      </Link>
      <Link to="/hello">Hello</Link>
    </header>
  );
}
