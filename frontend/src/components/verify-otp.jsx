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
        "eteanepalbackend-production.up.railway.app/api/auth/verify",
        { email, otp }
      );
      // Handle successful verification
      alert('OTP has been verified, now you can login');
      navigate('/login'); // Redirect to a dashboard or homepage after successful verification
    } catch (error) {
      setError('Verification failed. Please check your OTP and email.');
    }
  };

  const handleResendOTP = async () => {
    try {
      await axios.post(
        "eteanepalbackend-production.up.railway.app/api/auth/resend-otp",
        { email }
      );
      alert('OTP has been resent to your email.');
    } catch (error) {
      setError('Failed to resend OTP. Please try again later.');
    }
  };

  return (
    <div className='container'>
      <div className='verify-otp__container'>
        <div className="verify-otp__content">
          <h1>Verify OTP</h1>
          <div>
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
          <div>
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
          <button onClick={handleVerify}>Verify OTP</button>
          {error && <p className="error">{error}</p>}
          <div>
            <p>
              Didn't receive the OTP?{' '}
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
