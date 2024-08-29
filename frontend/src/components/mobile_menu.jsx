import React, { useState, useContext, useEffect } from "react";
import home from "../Assets/icons/home.svg";
import explore from "../Assets/icons/explore.svg";
import shop from "../Assets/icons/shop.svg";
import contact from "../Assets/icons/contact.svg";
import cartIcon from "../Assets/icons/cart.svg";
import { cartContext, showCart } from "../helper/context";

const Mobile_menu = () => {
  const [move, setMove] = useState();
  document.addEventListener("scroll", () => {
    const maxHeight = document.body.scrollHeight - window.innerHeight;
    setMove((window.pageYOffset * 100) / maxHeight);
  });

  const { cartShow, setCartShow } = useContext(showCart);

  const [trigger, setTrigger] = useState(0);

  const { cart, setCart } = useContext(cartContext);

  let quantity = null;
  if (cart.length > 0) {
    quantity = cart[cart.length - 1][0].totalQuantity;
  }

  useEffect(() => {
    setTrigger(trigger + 1);
  }, [cart.length]);

  return (
    <div className="hero__mobile__menu ">
      <a
        href="#home"
        onClick={() => {
          setCartShow(false);
        }}
      >
        <div className={move < 12 || move === undefined ? "active" : ""}>
          <img src={home} alt="" />
        </div>

        <span>Home</span>
      </a>
      <a
        href="#explore"
        onClick={() => {
          setCartShow(false);
        }}
      >
        <div
          className={(move > 12) & (move < 45) ? "active" : ""}
          type="explore"
        >
          <img src={explore} alt="" />
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
        onClick={() => {
          setCartShow(false);
        }}
      >
        <div className={(move > 45) & (move < 85) ? "active" : ""}>
          <img src={shop} alt="" />
        </div>

        <span>Shop</span>
      </a>
      <a
        href="#contact"
        onClick={() => {
          setCartShow(false);
        }}
      >
        <div className={move > 85 ? "active" : ""} type="contact">
          <img src={contact} alt="" />
        </div>
        <span>Contact us</span>
      </a>
    </div>
  );
};

export default Mobile_menu;
