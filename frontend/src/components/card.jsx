import React, { useContext, useEffect } from "react";
import { cartContext, buy } from "../helper/context";
import { useAuth } from '../helper/context';
import tea from "../Assets/teabag.png";
import { useNavigate } from 'react-router-dom';

const Card = (props) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Extract data from props
  const { name, price, description, stock, ratingCount, initialPrice } =
    props.props;
  let { rating, image } = props.props;
  if (rating) rating = parseFloat(rating.toFixed(1)); // Formatting rating
  if (!rating) rating = 0;
  if (!image) {
    image = "";
  }

  const quantity = 1;
  const trigger = true;
  const delivery = 0;

  const { cart, setCart } = useContext(cartContext);
  const { buyNow, setBuyNow } = useContext(buy);

  // Load cart from localStorage on component mount
  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, [setCart]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Function to handle adding item to cart
  const updateCart = async () => {
    if (!isAuthenticated) {
      alert("Please login first to perform this action");
      navigate("/login");
      return;
    }

    // Check if stock is available
    if (stock < 1) {
      alert("This item is out of stock!");
      return;
    }

    let newCart = cart || [];
    let itemFound = false;
    let totalQty = 0;

    newCart = newCart.map((item) => {
      if (item[0].name === name) {
        item[0].quantity += quantity;
        itemFound = true;
      }
      totalQty += item[0].quantity;
      return item;
    });

    if (!itemFound) {
      newCart.push([{ ...props.props, quantity }]);
    }

    setCart(newCart);
    localStorage.setItem("cart", JSON.stringify(newCart));
  };

  return (
    <div className="shop__container__content">
      <div
        className={`shop__container__content__card__container ${
          stock < 1 ? "out-of-stock" : ""
        }`}
      >
        <div id="hoverDescription">
          <b>Description</b>
          {description}
        </div>
        <div className="shop__container__content__card__container__card__image">
          <img
            src={image === "" ? tea : `http://localhost:8000/public/${image}`}
            alt="tea"
            className={stock < 1 ? "blurred" : ""}
          />
        </div>
        <div className="shop__container__content__card__container__card__details">
          <h3 className="asl mb1 rating">
            <b>{rating}</b>
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12.0001 17.27L16.1501 19.78C16.9101 20.24 17.8401 19.56 17.6401 18.7L16.5401 13.98L20.2101 10.8C20.8801 10.22 20.5201 9.12001 19.6401 9.05001L14.8101 8.64001L12.9201 4.18001C12.5801 3.37001 11.4201 3.37001 11.0801 4.18001L9.19007 8.63001L4.36007 9.04001C3.48007 9.11001 3.12007 10.21 3.79007 10.79L7.46007 13.97L6.36007 18.69C6.16007 19.55 7.09007 20.23 7.85007 19.77L12.0001 17.27Z"
                fill="#E7D400"
              />
            </svg>{" "}
            ({ratingCount} ratings)
          </h3>
          <span>
            Rs{price} <li>Rs{initialPrice}</li>{" "}
            <button>only {stock} left</button>
          </span>
          <span>
            <h6>{name}</h6>
            <button
              onClick={updateCart}
              disabled={stock < 1}
              className={stock < 1 ? "disabled-button" : ""}
            >
              Add to cart
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
