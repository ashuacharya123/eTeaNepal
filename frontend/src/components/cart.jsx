import React, { useState, useEffect, useContext } from "react";
import { cartContext, showCart, buy } from "../helper/context";
import close from "../Assets/icons/close.svg";
import deleteIcon from "../Assets/icons/delete.svg";
import tea from "../Assets/teabag.png"

const Cart = () => {
  const { cart, setCart } = useContext(cartContext);
  const { cartShow, setCartShow } = useContext(showCart);
  const { buyNow, setBuyNow } = useContext(buy);

  const [checkout, setCheckout] = useState(false);

  // Retrieve cart data from localStorage when component mounts
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, [setCart]);

  // Update localStorage whenever the cart state changes
  // useEffect(() => {
  //   localStorage.setItem('cart', JSON.stringify(cart));
  // }, [cart]);

  let totalPrice = 0;

  const data = cart.filter(item => item[0].quantity > 0).map(item => {
    totalPrice += item[0].price * item[0].quantity;
    return item[0];
  });

  totalPrice = parseFloat(totalPrice.toFixed(2));

  const itemQuantity = (sign, image, price, cutPrice, discount, name) => {
    const updatedCart = cart.map(item => {
      if (item[0].image === image &&
          item[0].price === price &&
          item[0].cutPrice === cutPrice &&
          item[0].discount === discount &&
          item[0].name === name) {
        if (sign === "+") {
          item[0].quantity += 1;
          item[0].totalQuantity += 1;
        } else if (sign === "-" && item[0].quantity > 0) {
          item[0].quantity -= 1;
          item[0].totalQuantity -= 1;
        }
      }
      return item;
    }).filter(item => item[0].quantity > 0);

    setCart(updatedCart);
  };

  const deleteItem = (image, price, cutPrice, discount, name) => {
    const updatedCart = cart.filter(item => {
      return !(item[0].image === image &&
               item[0].price === price &&
               item[0].cutPrice === cutPrice &&
               item[0].discount === discount &&
               item[0].name === name);
    });

    setCart(updatedCart);
  };


  return (
    <div
      className="cart__container"
      id={cartShow || buyNow.length > 0 ? "cartShow" : ""}
    >
      <div
        className="cart__container__close"
        id={buyNow.length > 0 ? "dn" : ""}
        onClick={() => {
          setCartShow(false);
        }}
      >
        <div className="cart__container__close__image">
          <img src={close} alt="close icon" />
        </div>
        <span>Close</span>
      </div>
      <div
        className="cart__container__container"
        id={checkout || buyNow.length > 0 ? "dn" : ""}
      >
        {data.length > 0 ? (
          data.map(d => (
            <div key={d.name} className="cart__container__content">
              <div className="cart__container__content__upper">
                <div className="cart__container__content__upper__image">
                  {!d.image?(d.image=""):""}
                <img src={d.image.length === 0 ? tea : `http://localhost:8000/public/${d.image}`} alt="" />
                </div>
                <div className="cart__container__content__upper__details">
                  <span>
                    Rs {d.price} <li>{d.cutPrice}</li>
                    <button>{d.stock} left</button>
                  </span>
                  <h6>{d.name}</h6>
                  <span>
                    <button
                      onClick={() => itemQuantity("-", d.image, d.price, d.cutPrice, d.discount, d.name)}
                    >
                      -
                    </button>
                    <h5>{d.quantity}</h5>
                    <button
                      onClick={() => itemQuantity("+", d.image, d.price, d.cutPrice, d.discount, d.name)}
                    >
                      +
                    </button>
                    <button
                      onClick={() => deleteItem(d.image, d.price, d.cutPrice, d.discount, d.name)}
                    >
                      <div className="image__container">
                        <img src={deleteIcon} alt="delete icon" />
                      </div>
                      <span>Delete</span>
                    </button>
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <h2 className="cart__container__empty">Empty Cart</h2>
        )}
      </div>

      <div
        className="checkout cart__container__content__lower"
        id={checkout || buyNow.length > 0 ? "" : "dn"}
      >
        <span>
          <h6>Order Details</h6>
          <h6>Quantity</h6>
        </span>
        {data.map(d => (
          <span key={d.name} id={buyNow.length > 0 ? "dn" : ""}>
            <h6>{buyNow.length > 0 ? buyNow[0] : d.name}</h6>
            <h6>X{buyNow.length > 0 ? buyNow[1] : d.quantity}</h6>
          </span>
        ))}
        <span id={buyNow.length > 0 ? "" : "dn"}>
          <h6>{buyNow.length > 0 ? buyNow[0] : ""}</h6>
          <h6>X{buyNow.length > 0 ? buyNow[1] : ""}</h6>
        </span>
      </div>

      <div className="cart__container__content__lower">
        <hr />
        <span>
          <h6>Total</h6>
          <h5>
            ${buyNow.length > 0 ? buyNow[2] : totalPrice ? totalPrice : "0.00"}
          </h5>
        </span>
        <span>
          <h6>Delivery</h6>
          <h5>$100</h5>
        </span>
        <span>
          <h6>Sub-Total</h6>
          <h5>
            ${buyNow.length > 0 ? buyNow[2] : totalPrice ? totalPrice : "0.00"}
          </h5>
        </span>
        <span>
          <button
            onClick={() => {
              setCartShow(false);
              setCheckout(false);
              setBuyNow([]);
            }}
          >
            Cancel
          </button>
          <button>
            <label htmlFor="btn">{checkout ? "Order Now" : "Checkout"}</label>
          </button>
        </span>
      </div>
    </div>
  );
};

export default Cart;
