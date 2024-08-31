import React, { useContext } from "react";
import { cartContext, buy } from "../helper/context";
import tea from "../Assets/teabag.png";

const Card = (props) => {
  // Extract data from props
  const { name, price, description, stock, ratingCount } = props.props;
  let { rating } = props.props;
  rating = parseFloat(rating.toFixed(1)); //making rating like 2.4 from 2.454352452

  const image = tea;

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
      if (cart[i][0].name === name && cart[i][0].price === price) {
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
          stock,
          price,
          name,
          quantity,
          trigger,
          totalQuantity,
          delivery,
        },
      ],
    ]);
  };

  return (
    <div className="shop__container__content">
      <div className="shop__container__content__card__container">
        <div id="hoverDescription"><b>Description</b>{description}</div>
        <div className="shop__container__content__card__container__card__image">
          <img src={image} alt="tea" />
        </div>
          <h3 className=" asl mb1 rating">
          <b>
            {rating}
            </b>
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
            </svg>  ({ratingCount} ratings)
          </h3>
        <div className="shop__container__content__card__container__card__details">
          <span>
            Rs{price} <li>Rs19</li> <button>only {stock} left</button>
          </span>
          <span>
            <h6>{name}</h6>
            {/* <p>{description}</p> */}
            <button onClick={updateCart}>Add to cart</button>
            <button onClick={() => buyNowFunction(name, quantity, price)}>
              Buy now
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Card;