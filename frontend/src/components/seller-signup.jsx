import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate,Link } from 'react-router-dom';
import loginPhoto from "../Assets/login.png";

const SellerSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    businessAddress: '',
    password: '',
    confirmPassword: '',
    panCardNumber: '',
    panCardDocument: null, // For file upload
    mobileNumber: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'panCardDocument') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSignup = async () => {
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      const formDataToSend = new FormData();
      for (let key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      const response = await axios.post(
        "eteanepalbackend-production.up.railway.app/api/seller/register",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      navigate('/verify-otp'); // Redirect to verify OTP page
    } catch (error) {
      setError('Signup failed. Please check your details.');
    }
  };

  return (
    <div className='container'>
      <div className='login__container'>
        <div className="login__container__content">
          <div className="login__container__content__upper">
            <h1 className='heading-text'>Seller Signup</h1>
            <div>
                <p>Already signed up? <Link to="/login">Login</Link></p>
              </div>
          </div>
          <div className="login__container__content__lower">
            <div className="login__container__content__lower__right">
              {/* <img src={loginPhoto} alt="Seller Signup" /> */}
              <div className="login__container__content__lower__right__fields">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="your name here"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="login__container__content__lower__right__fields">
                <label htmlFor="businessName">Business Name</label>
                <input
                  type="text"
                  id="businessName"
                  name="businessName"
                  placeholder="your business name"
                  value={formData.businessName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="login__container__content__lower__right__fields">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="jonhdoe@gmail.com"
                  value={formData.email}
                  onChange={handleInputChange}
                />
              </div>
              <div className="login__container__content__lower__right__fields">
                <label htmlFor="businessAddress">Business Address</label>
                <input
                  type="text"
                  id="businessAddress"
                  name="businessAddress"
                  placeholder="your business address"
                  value={formData.businessAddress}
                  onChange={handleInputChange}
                />
              </div>
              <div className="login__container__content__lower__right__fields">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="min. 8 characters"
                  value={formData.password}
                  onChange={handleInputChange}
                />
              </div>
             
            </div>
            <div className="login__container__content__lower__right">
              
              
              <div className="login__container__content__lower__right__fields">
                <label htmlFor="panCardNumber">PAN Card Number</label>
                <input
                  type="text"
                  id="panCardNumber"
                  name="panCardNumber"
                  placeholder="Enter your PAN card number"
                  value={formData.panCardNumber}
                  onChange={handleInputChange}
                />
              </div>
              <div className="login__container__content__lower__right__fields">
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="min. 8 characters"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                />
              </div>
              <div className="login__container__content__lower__right__fields">
                <label htmlFor="panCardDocument">Upload PAN Card Document</label>
                <input
                  type="file"
                  id="panCardDocument"
                  name="panCardDocument"
                  onChange={handleInputChange}
                />
              </div>
              <div className="login__container__content__lower__right__fields">
                <label htmlFor="mobileNumber">Mobile Number</label>
                <input
                  type="text"
                  id="mobileNumber"
                  name="mobileNumber"
                  placeholder="98........"
                  value={formData.mobileNumber}
                  onChange={handleInputChange}
                />
              </div>
              <button onClick={handleSignup}>Signup</button>
              {error && <p className="error">{error}</p>}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SellerSignup;
