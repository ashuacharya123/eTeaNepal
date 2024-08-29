import React from "react";
import fb from "../Assets/icons/facebook.svg";
import insta from "../Assets/icons/instagram.svg";
import github from "../Assets/icons/github.svg";

const Contact = () => {
  return (
    <div className="contact__container">
      <div className="contact__content ">
        <div className="contact__content__text ml2 mr2">Contact us</div>
        <form className="contact__content__form">
          <div className="contact__content__form__upper ml2">
            <li>
              Name
              <input type="text" />
            </li>
            <li>
              Email
              <input type="email" />
            </li>
            <li>
              Message
              <input type="text" />
            </li>
            <button>Contact us</button>
          </div>
          <div className="contact__content__form__lower ml2">
            <div className="contact__content__form__lower__text">
              Reach us at
            </div>
            <div className="contact__content__form__lower__email">
              ashuacharya622@gmail.com
            </div>
            <hr />
            <div className="contact__content__form__lower__links">
              <a href="https://www.facebook.com/iamashuacharya/">
                <img src={fb} alt="" />
              </a>
              <a href="https://www.instagram.com/iamashuacharya/">
                <img src={insta} alt="" />
              </a>
              <a href="https://github.com/ashuacharya123">
                <img src={github} alt="" />
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Contact;
