import React from "react";
import Card from "./card";

const Shop = () => {
  const cardList = [
    [0, 2.99, 3.99, 30, "Spritize minize zirotone"],
    [1, 3.99, 4.99, 40, "Tulsi"],
    [2, 2.99, 3.99, 10, "Spritize minize zirotone"],
    [3, 3.99, 5.99, 40, "Tulsi"],
  ];
  return (
    <>
      <div className="shop__container ml2 mr2" id="shop">
        {cardList.map((card) => {
          return <Card key={card} props={card} />;
        })}
      </div>
      <div id="contact"></div>
    </>
  );
};

export default Shop;
