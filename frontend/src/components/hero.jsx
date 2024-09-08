import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';



const Hero = () => {
  const [move, setMove] = useState();
  document.addEventListener("scroll", () => {
    const maxHeight = document.body.scrollHeight - window.innerHeight;
    setMove((window.pageYOffset * 100) / maxHeight);
  });

  const yOffset = 10;
  return (
    <div className="hero__container" id="home">


      <div className="hero__content ">

        
        <div className="hero__upper ">
          <h2 className="hero__upper__text" id="margin">
          Bringing Nepal’s best tea to your doorstep
          </h2>
          <div className="df fdc g2">
          <ScrollLink 
        to="shop" 
        smooth={true} 
        duration={200} 

      >
          {/* <Link to="shop"> */}
            <button className="ml2 btn-primary">Shop Now</button>
          {/* </Link> */}
          </ScrollLink>
          <Link to="/best-deals">
            <button className="ml2 clickAnimation" id="btn-secondary">Best Deals</button>
          </Link>
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
