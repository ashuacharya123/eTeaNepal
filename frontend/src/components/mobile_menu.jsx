import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import home from "../Assets/icons/home.svg";
import explore from "../Assets/icons/explore.svg";
import shop from "../Assets/icons/shop.svg";
import contact from "../Assets/icons/contact.svg";
import cartIcon from "../Assets/icons/cart.svg";
import { cartContext, showCart } from "../helper/context";

const Mobile_menu = () => {
  const [move, setMove] = useState(0);
  const location = useLocation(); // Detect the current route
  const navigate = useNavigate(); // Use for navigation

  const { cartShow, setCartShow } = useContext(showCart);
  const { cart } = useContext(cartContext);

  const [trigger, setTrigger] = useState(0);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const maxHeight = document.body.scrollHeight - window.innerHeight;
      setMove((window.pageYOffset * 100) / maxHeight);
    };

    // Add scroll event listener
    document.addEventListener("scroll", handleScroll);

    // Clean up event listener on component unmount
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Handle navigation and scroll to section
  const handleNavigationAndScroll = (path, sectionId) => {
    if (location.pathname !== path) {
      navigate(path);
    }
    setTimeout(() => {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }, 0);
    setCartShow(false);
  };

  // Calculate total quantity in the cart
  const calculateTotalQuantity = () => {
    return cart.reduce((total, item) => total + item[0]?.quantity || 0, 0);
  };

  // Update quantity when cart changes
  const quantity = calculateTotalQuantity();

  useEffect(() => {
    setTrigger(prevTrigger => prevTrigger + 1);
  }, [cart]);

  return (
    <div className="hero__mobile__menu">
      <a
        href="#home"
        className="clickAnimation"
        onClick={() => handleNavigationAndScroll('/', 'home')}
      >
        <div className={move < 12 ? "active" : ""}>
          <img src={home} alt="Home" />
        </div>
        <span>Home</span>
      </a>
      <a
        href="#explore"
        className="clickAnimation"
        id={localStorage.getItem("role") === "seller" || localStorage.getItem("role") === "admin"?"dn":""}
        onClick={() => handleNavigationAndScroll('/', 'explore')}
      >
        <div className={(move > 12) && (move < 45) ? "active" : ""}>
          <img src={explore} alt="Explore" />
        </div>
        <span>Explore</span>
      </a>
      <a
        href="#cart"
        id={localStorage.getItem("role") === "seller" || localStorage.getItem("role") === "admin"?"dn":""}
        className={trigger % 2 !== 0 ? "trigger clickAnimation" : "clickAnimation"}
        onClick={() => setCartShow(prev => !prev)}
      >
        <span type="quantity">{quantity}</span>
        <img src={cartIcon} alt="Cart" />
      </a>
      <a
        href="#shop"
        id={localStorage.getItem("role") === "seller" || localStorage.getItem("role") === "admin"?"dn":""}
        className="clickAnimation"
        onClick={() => handleNavigationAndScroll('/', 'shop')}
      >
        <div className={(move > 45) && (move < 85) ? "active" : ""}>
          <img src={shop} alt="Shop" />
        </div>
        <span>Shop</span>
      </a>
      <a
        href="#contact"
        className="clickAnimation"
        id={localStorage.getItem("role") === "seller" || localStorage.getItem("role") === "admin"?"dn":""}
        onClick={() => handleNavigationAndScroll('/', 'contact')}
      >
        <div className={move > 85 ? "active" : ""}>
          <img src={contact} alt="Contact" />
        </div>
        <span>Contact us</span>
      </a>
    </div>
  );
};

export default Mobile_menu;
