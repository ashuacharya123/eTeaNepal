import React, { useState } from 'react';
import axios from 'axios';

import { useNavigate } from 'react-router-dom';

const ForgotResetPassword = () => {
  const [isForgotPassword, setIsForgotPassword] = useState(true);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSwitchToForgotPassword = () => {
    setIsForgotPassword(true);
    setError('');
  };

  const handleSwitchToResetPassword = () => {
    setIsForgotPassword(false);
    setError('');
  };

  const handleForgotPassword = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/resend-otp', { email });
      alert('OTP has been sent to your email.');
      handleSwitchToResetPassword();
    } catch (error) {
      setError('Failed to send OTP. Please check your email.');
    }
  };

  const handleResetPassword = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/reset-password', { email, otp, newPassword });
      alert('Password reset successful!');
      navigate('/login'); // Redirect to login after successful reset
    } catch (error) {
      setError('Failed to reset password. Please check your details.');
    }
  };

  return (
    <div className='container'>
      <div className='login__container'>
        <div className="login__container__content">
          <div className="login__container__content__upper">
            <h1>{isForgotPassword ? 'Forgot Password' : 'Reset Password'}</h1>
          </div>
          <div className="login__container__content__lower">
            <div className="login__container__content__lower__left">
            </div>
            <div className="login__container__content__lower__right">
              {isForgotPassword ? (
                <>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <button onClick={handleForgotPassword}>Send OTP</button>
                </>
              ) : (
                <>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor="otp">OTP</label>
                  <input
                    type="text"
                    id="otp"
                    placeholder='Enter OTP'
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder='Enter your new password'
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  <button onClick={handleResetPassword}>Reset Password</button>
                </>
              )}
              {error && <p className="error">{error}</p>}
              <div>
                {isForgotPassword ? (
                  <p>
                    Remembered your password?{' '}
                    <a href="#" onClick={handleSwitchToResetPassword}>
                      Reset Password
                    </a>
                  </p>
                ) : (
                  <p>
                    Forgot your password?{' '}
                    <a href="#" onClick={handleSwitchToForgotPassword}>
                      Send OTP
                    </a>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotResetPassword;