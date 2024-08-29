import React from "react";
import logo from "../Assets/icons/logo-footer.svg";
import fb from "../Assets/icons/facebook.svg";
import insta from "../Assets/icons/instagram.svg";
import github from "../Assets/icons/github.svg";

const Footer = () => {
  return (
    <div className="footer__container">
      <div className="footer__content">
        <div className="footer__content__upper">
          
        </div>
        <div className="footer__content__middle">
          <div className="footer__content__middle ml2">
            <div className="footer__content__middle__text">Reach us at</div>
            <div className="footer__content__middle__email">
              ashuacharya622@gmail.com
            </div>
            <hr />
            <div className="footer__content__middle__links">
              <a
                href="https://www.facebook.com/iamashuacharya/"
                target="_blank"
              >
                <img src={fb} alt="" />
              </a>
              <a
                href="https://www.instagram.com/iamashuacharya/"
                target="_blank"
              >
                <img src={insta} alt="" />
              </a>
              <a href="https://github.com/ashuacharya123" target="_blank">
                <img src={github} alt="" />
              </a>
            </div>
          </div>
        </div>
        <div className="footer__content__lower ml2">
          <div className="footer__content__lower__text">
            <span>Subscribe </span>for regular updates
          </div>
          <li>
            Email
            <input type="email" />
          </li>
          <button>Subscribe</button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
