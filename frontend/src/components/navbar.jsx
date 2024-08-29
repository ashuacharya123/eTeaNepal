import React from 'react'
import logo from "../Assets/icons/LOGO.svg";

export default function Navbar() {
  return (
    <div className="hero__menu">
          <a href="#home" className="hero__menu__logo ml2 ">
            <img src={logo} alt="LOGO" />
          </a>
          <div className="nav-btn mr2"><button className="mr2">login/signup</button></div>
        </div>
  )
}
