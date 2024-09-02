import React from 'react';
import { Link } from 'react-router-dom';
import logo from "../Assets/icons/LOGO.svg";

export default function Navbar() {
  return (
    <div className="hero__menu">
      <Link to="/" className="hero__menu__logo ml2">
        <img src={logo} alt="LOGO" />
      </Link>
      <div className="nav-btn mr2">
        <Link to="/login">
          <button className="mr2">Login/Signup</button>
        </Link>
      </div>
    </div>
  );
}
