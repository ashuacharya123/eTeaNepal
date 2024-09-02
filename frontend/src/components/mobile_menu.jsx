import React, { useState, useContext, useEffect } from "react";
import home from "../Assets/icons/home.svg";
import { useLocation, useNavigate } from 'react-router-dom';
import explore from "../Assets/icons/explore.svg";
import shop from "../Assets/icons/shop.svg";
import contact from "../Assets/icons/contact.svg";
import cartIcon from "../Assets/icons/cart.svg";
import { cartContext, showCart } from "../helper/context";

const Mobile_menu = () => {
  const [move, setMove] = useState(0);
  const location = useLocation();  // Detect the current route
  const navigate = useNavigate();  // Use for navigation

  document.addEventListener("scroll", () => {
    const maxHeight = document.body.scrollHeight - window.innerHeight;
    setMove((window.pageYOffset * 100) / maxHeight);
  });

  const { cartShow, setCartShow } = useContext(showCart);
  const { cart, setCart } = useContext(cartContext);

  const [trigger, setTrigger] = useState(0);

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

  // Check if cart is defined and has items
  let quantity = null;
  if (cart && cart.length > 0) {
    quantity = cart[cart.length - 1][0]?.totalQuantity || 0;
  }

  useEffect(() => {
    if (cart) {
      setTrigger(trigger + 1);
    }
  }, [cart.length]);

  return (
    <div className="hero__mobile__menu">
      <a
        href="#home"
        onClick={() => handleNavigationAndScroll('/', 'home')}
      >
        <div className={move < 12 ? "active" : ""}>
          <img src={home} alt="" />
        </div>
        <span>Home</span>
      </a>
      <a
        href="#explore"
        onClick={() => handleNavigationAndScroll('/', 'explore')}
      >
        <div className={(move > 12) && (move < 45) ? "active" : ""}>
          <img src={explore} alt="Explore" />
        </div>
        <span>Explore</span>
      </a>
      <a
        href="#nothing"
        id={trigger % 2 === 0 ? "trigger" : ""}
        className={trigger % 2 !== 0 ? "trigger" : ""}
        onClick={() => {
          setCartShow(!cartShow);
        }}
      >
        <span type="quantity">{quantity}</span>
        <img src={cartIcon} alt="Cart" />
      </a>
      <a
        href="#shop"
        onClick={() => handleNavigationAndScroll('/', 'shop')}
      >
        <div className={(move > 45) && (move < 85) ? "active" : ""}>
          <img src={shop} alt="Shop" />
        </div>
        <span>Shop</span>
      </a>
      <a
        href="#contact"
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
