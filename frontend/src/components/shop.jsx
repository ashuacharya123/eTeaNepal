import React, { useEffect, useState } from "react";
import Card from "./card";
import axios from 'axios';

const Shop = () => {
  const [cardList, setCardList] = useState([]);  // State to store the products
  const [loading, setLoading] = useState(true);  // State to handle loading

  // Fetch data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/products');
        // Assuming the backend returns an array of products
        // Map through the products and set image to empty string if not present
        const products = response.data.map(product => ({
          ...product,
          image: product.image || ""  // Set image to "" if it's missing
        }));
        setCardList(products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);  // Set loading to false even if there is an error
      }
    };

    fetchData();
  }, []);  // Empty dependency array means this effect runs only once when the component mounts

  return (
    <>
      <div className="shop__container ml2 mr2" id="shop">
        {loading ? (
          <p>Loading...</p>  // Show loading message while fetching data
        ) : (
          cardList.map((card) => (
            <Card key={card._id} props={card} />  // Assuming each card has a unique _id from the database
          ))
        )}
      </div>
      <div id="contact"></div>
    </>
  );
};

export default Shop;
