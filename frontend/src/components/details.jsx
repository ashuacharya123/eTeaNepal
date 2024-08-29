import React, { useState } from "react";

import garden from "../Assets/mobile/Mobile_Mask Group.png";

const Details = () => {
  const [vw, setVw] = useState(window.visualViewport.width);

  const resizeHandler = () => {
    setVw(window.visualViewport.width);
  };
  window.visualViewport.addEventListener("resize", resizeHandler);
  return (
    <div className="details__container" id="explore">
      <div className="details__container__content">
        <div className="details__container__content__text ml2 mr2">
          <div>Sourcing the Finest Nepali Tea</div>
          <div
            className="details__container__content__paragraph  mr2 "
            id={vw < 656 ? "dn" : ""}
          >
            Our teas are sourced from the pristine hills of Nepal, where traditional farming methods meet modern quality standards. Each leaf is carefully selected from organically grown tea gardens, ensuring a pesticide-free and sustainable harvest. By working directly with local farmers, we not only bring you the freshest tea but also support the communities that cultivate these exquisite flavors. Experience the true essence of Nepali tea with every sip, knowing that each cup contributes to a fair and eco-friendly trade.
          </div>
        </div>

        <div className="details__container__content__image ml2">
          <img src={garden} alt="" />
        </div>
        <div
          className="details__container__content__paragraph ml2 mr2"
          id={vw > 656 ? "dn" : ""}
        >
          Our teas are sourced from the pristine hills of Nepal, where traditional farming methods meet modern quality standards. Each leaf is carefully selected from organically grown tea gardens, ensuring a pesticide-free and sustainable harvest. By working directly with local farmers, we not only bring you the freshest tea but also support the communities that cultivate these exquisite flavors. Experience the true essence of Nepali tea with every sip, knowing that each cup contributes to a fair and eco-friendly trade.
        </div>
      </div>
    </div>
  );
};

export default Details;
