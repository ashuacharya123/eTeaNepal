import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const VerifyOTP = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = async () => {
    try {
      const response = await axios.post(
        "https://eteanepalbackend-production.up.railway.app/api/auth/verify",
        { email, otp }
      );
      // Handle successful verification
      alert("OTP has been verified, now you can login");
      navigate("/login"); // Redirect to a dashboard or homepage after successful verification
    } catch (error) {
      setError("Verification failed. Please check your OTP and email.");
      alert("Verification failed. Please check your OTP and email.");
    }
  };

  const handleResendOTP = async () => {
    try {
      await axios.post(
        "https://eteanepalbackend-production.up.railway.app/api/auth/resend-otp",
        { email }
      );
      alert("OTP has been resent to your email.");
    } catch (error) {
      setError("Failed to resend OTP. Please try again later.");
      alert("Enter your email to resend OTP");
    }
  };

  return (
    <div className="login__container">
      <div className="verify-otp__container">
        <div className="login__container__content">
          <h1 className="heading-text">Verify OTP</h1>
          <div
            className="login__container__content__lower__right__fields "
            style={{ marginTop: "2rem" }}
          >
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div
            className="login__container__content__lower__right__fields"
            style={{ marginTop: "2rem" }}
          >
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              placeholder="Enter your OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
          </div>
          <div
            className="login__container__content__lower__right__fields "
            style={{ marginTop: "2rem" }}
          >
            <button onClick={handleVerify} className="btn clickAnimation">
              Verify OTP
            </button>
          </div>
          <div>
            <p style={{ marginTop: "2rem" }}>
              Didn't receive the OTP?{" "}
              <a href="#" onClick={handleResendOTP}>
                Resend OTP
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
