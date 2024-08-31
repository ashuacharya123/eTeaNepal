import React, { useState } from "react";

import MobileMenu from "./mobile_menu";
import Navbar from "./navbar";


const Hero = () => {
  const [move, setMove] = useState();
  document.addEventListener("scroll", () => {
    const maxHeight = document.body.scrollHeight - window.innerHeight;
    setMove((window.pageYOffset * 100) / maxHeight);
  });

  const yOffset = 10;
  return (
    <div className="hero__container" id="home">
      <MobileMenu />

      <div className="hero__content ">
        <Navbar/>
        
        <div className="hero__upper ">
          <h2 className="hero__upper__text" id="margin">
          Bringing Nepal’s best tea to your doorstep
          </h2>
          <div className="df fdc g2">
          <a href="#shop">
            <button className="ml2 btn-primary">Shop Now</button>
          </a>
          <a href="#">
            <button className="ml2 " id="btn-secondary">Best Deals</button>
          </a>
          </div>
        </div>
        <div className="hero__lower">
          <h2 className="hero__lower__text ml2 mr2">
            Nutritional facts Per 100 grams
          </h2>
          <ul className="ml2 mr2">
            <div
              id={
                move > yOffset || window.visualViewport.width > 756
                  ? "card__animation"
                  : ""
              }
              type="animation"
            >
              <li>
                <div num="1">37</div>
                <span>Calories</span>
              </li>
              <li>
                <div num="1">3mg</div>
                <span>Sodium</span>
              </li>
              <li>
                <div num="1">0.4g</div>
                <span>Protein</span>
              </li>
            </div>
            <div
              id={
                move > yOffset || window.visualViewport.width > 756
                  ? "card__animation"
                  : ""
              }
              type="animation"
            >
              <li>
                <div className="">0.7g</div>
                <span>Total Fat</span>
              </li>
              <li>
                <div className="">9mg</div>
                <span>Potassium</span>
              </li>
              <li>
                <div className="">7mg</div>
                <span>Carbohydrate</span>
              </li>
            </div>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Hero;