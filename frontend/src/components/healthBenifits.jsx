import React, { useState } from "react";
import health from "../Assets/icons/Heathbenifits.svg";
import health2 from "../Assets/icons/Healthbenifuts2.svg";

const HealthBenifits = () => {
  const [move, setMove] = useState(); //[44,54,64,74]
  document.addEventListener("scroll", () => {
    const maxHeight = document.body.scrollHeight - window.innerHeight;
    setMove((window.pageYOffset * 100) / maxHeight);
  });

  const yOffset = 33;
  return (
    <div className="health__container">
      <div className="health__container__content">
        <div className="health__container__content__text ml2 mr2">
          Health Benefits of Herbal Tea
        </div>
        <div
          className="health__container__content__health"
          id={move > yOffset ? "card__animation" : ""}
        >
          <img
            src={window.visualViewport.width > 756 ? health2 : health}
            alt="Health Benifits"
          />
        </div>
      </div>
    </div>
  );
};

export default HealthBenifits;
