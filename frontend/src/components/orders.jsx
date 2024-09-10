import React, { useState, useEffect } from "react";
import axios from "axios";

const OrderPage = () => {
  const [orders, setOrders] = useState([]);
  const [ratedProducts, setRatedProducts] = useState([]);

  const user = localStorage.getItem('name');

  // Load ratedProducts from localStorage on mount
  useEffect(() => {
    const storedRatedProducts = JSON.parse(localStorage.getItem('ratedProducts')) || [];
    setRatedProducts(storedRatedProducts);

    // Fetch orders from backend
    const fetchOrders = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/orders", {
          headers: {
            'x-auth-token': localStorage.getItem('x-auth-token'),
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    fetchOrders();
  }, []);

  // Handle rating submission
  const handleRating = async (productId, newRating) => {
    try {
      await axios.put(
        "http://localhost:8000/api/user/product/rating",
        { productId, newRating },
        {
          headers: {
            'x-auth-token': localStorage.getItem('x-auth-token'),
          },
        }
      );

      alert("Rating submitted successfully!");

      // Update localStorage with the new rating
      const updatedRatedProducts = [...ratedProducts, { productId, rating: newRating }];
      localStorage.setItem('ratedProducts', JSON.stringify(updatedRatedProducts));
      setRatedProducts(updatedRatedProducts);

    } catch (error) {
      console.error("Failed to submit rating", error);
      if (error.response?.data?.message === "You have already rated this product") {
        alert("You have already rated this product");
      } else {
        alert("Failed to submit rating. Please try again later.");
      }
    }
  };

  // Check if a product is already rated
  const isProductRated = (productId) => {
    return ratedProducts.some((ratedProduct) => ratedProduct.productId === productId);
  };

  // Get the rating value from localStorage for a product
  const getProductRating = (productId) => {
    const ratedProduct = ratedProducts.find((ratedProduct) => ratedProduct.productId === productId);
    return ratedProduct ? ratedProduct.rating : 0;
  };

  return (
    <div className="orders__container">
      <h1>Hi, <span>{user}</span></h1>
      <div className="orders__container__content">
      {orders.map((order, index) => (
        <div key={index} className="orders__container__content__order">
          {order.items.map((item, idx) => (
            <div key={idx} className="order-item">
              <h3>{item.name}</h3>
              <p>Ordered on {new Date(order.createdAt).toLocaleDateString()}</p>
              <p>Quantity: {item.quantity}</p>
              <p>Order Total Rs{order.total+order.delivery}</p>

              {/* Rating */}
              {isProductRated(item.product) ? (
                <p>Rated {getProductRating(item.product)} out of 5</p>
              ) : (
                <>
                  <p>Rate Out of 5</p>
                  <Rating
                    rating={getProductRating(item.product)}
                    onRatingChange={(newRating) => handleRating(item.product, newRating)}
                  />
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
    </div>
  );
};

// Rating Component
const Rating = ({ rating, onRatingChange }) => {
  const [currentRating, setCurrentRating] = useState(rating);

  const handleRatingClick = (newRating) => {
    setCurrentRating(newRating);
    onRatingChange(newRating);
  };

  return (
    <div>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          onClick={() => handleRatingClick(star)}
          style={{ cursor: "pointer", color: star <= currentRating ? "gold" : "grey" }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default OrderPage;
