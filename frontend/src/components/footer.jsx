import React, { useState } from "react";
import logo from "../Assets/icons/logo-footer.svg";
import fb from "../Assets/icons/facebook.svg";
import insta from "../Assets/icons/instagram.svg";
import github from "../Assets/icons/github.svg";
import axios from 'axios';

const Footer = () => {
  const [email, setEmail] = useState('');

  // Handle email input change
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  // Handle form submission
  const handleSubscribe = async () => {
    if (!email) {
      alert('Please enter an email address.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:8000/api/subscribe', { email });
      if (response.status === 200) {
        alert('Subscription successful!');
        setEmail(''); // Clear the input field
      } else {
        alert('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  };

  return (
    <div className="footer__container">
      <div className="footer__content">
        <div className="footer__content__upper">
          {/* Content remains the same */}
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
                rel="noopener noreferrer"
              >
                <img src={fb} alt="Facebook" />
              </a>
              <a
                href="https://www.instagram.com/iamashuacharya/"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={insta} alt="Instagram" />
              </a>
              <a
                href="https://github.com/ashuacharya123"
                target="_blank"
                rel="noopener noreferrer"
              >
                <img src={github} alt="GitHub" />
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
            <input
              type="email"
              value={email}
              onChange={handleEmailChange}
              // placeholder="Enter your email"
            />
          </li>
          <button className="clickAnimation" onClick={handleSubscribe}>
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Footer;
