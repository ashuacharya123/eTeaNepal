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
        const response = await axios.get('http://localhost:8000/api/products'); // Replace with your API endpoint
        setCardList(response.data);  // Assuming your backend returns an array of products
        setLoading(false);  // Set loading to false after data is fetched
        console.log(cardList)
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


// const Shop = () => {
//   const cardList = [
//     [0, 2.99, 3.99, 30, "Spritize minize zirotone"],
//     [1, 3.99, 4.99, 40, "Tulsi"],
//     [2, 2.99, 3.99, 10, "Spritize minize zirotone"],
//     [3, 3.99, 5.99, 40, "Tulsi"],
//   ];

//   return (
//     <>
//       <div className="shop__container ml2 mr2" id="shop">
//         {cardList.map((card) => {
//           return <Card key={card} props={card} />;
//         })}
//       </div>
//       <div id="contact"></div>
//     </>
//   );
// };


