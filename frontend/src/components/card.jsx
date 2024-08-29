import React, { useContext, useState } from "react";

import tea from "../Assets/teabag.png";
import tea2 from "../Assets/teabag2.png";
import { cartContext, buy } from "../helper/context";

const Card = (props) => {
  const [move, setMove] = useState(); //[44,54,64,74]
  document.addEventListener("scroll", () => {
    const maxHeight = document.body.scrollHeight - window.innerHeight;
    setMove((window.pageYOffset * 100) / maxHeight);
  });

  // console.log(props.props[0]);
  const yOffset =
    props.props[0] === 0
      ? 40
      : props.props[0] === 1
      ? 50
      : props.props[0] === 2
      ? 60
      : props.props[0] === 3
      ? window.visualViewport.width > 756
        ? 62
        : 70
      : 200;

  const image = props.props[0] % 2 === 1 ? tea2 : tea;
  const price = props.props[1];
  const cutPrice = props.props[2];
  const discount = props.props[3];
  const name = props.props[4];
  const quantity = 1;
  const trigger = true;
  let totalQuantity = 1;
  const delivery = 0;

  const { cart, setCart } = useContext(cartContext);
  const { buyNow, setBuyNow } = useContext(buy);

  const buyNowFunction = (name, quantity, price) => {
    setBuyNow([name, quantity, price]);
  };

  const updateCart = () => {
    for (let i = 0; i < cart.length; i++) {
      totalQuantity += cart[i][0].quantity;
    }

    for (let i = 0; i < cart.length; i++) {
      if (
        cart[i][0].image === image &&
        cart[i][0].price === price &&
        cart[i][0].cutPrice === cutPrice &&
        cart[i][0].discount === discount &&
        cart[i][0].name === name
      ) {
        cart[i][0].quantity++;
        if (cart[cart.length - 1][0].price === undefined) {
          cart[cart.length - 1].pop();
          cart.pop();
        }
        setCart([...cart, [{ totalQuantity, quantity: 0 }]]);

        return;
      }
    }
    setCart([
      ...cart,
      [
        {
          image,
          price,
          cutPrice,
          discount,
          name,
          quantity,
          trigger,
          totalQuantity,
          delivery,
        },
      ],
    ]);
  };
  // console.log(cart);

  return (
    <div className="shop__container__content">
      <div
        className="shop__container__content__card__container"
        id={move > yOffset ? "card__animation" : ""}
      >
        <div className="shop__container__content__card__container__card__image">
          <img src={image} alt="tea" />
        </div>
        <div className="shop__container__content__card__container__card__details">
          <span>
            ${price} <li>${cutPrice}</li> <button>{discount}% off</button>
          </span>

          <span>
            <h6>{name}</h6>
            <button
              onClick={(e) => {
                updateCart();
              }}
            >
              Add to cart
            </button>
            <button
              onClick={(e) => {
                buyNowFunction(name, quantity, price);
              }}
            >
              Buy now
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;
