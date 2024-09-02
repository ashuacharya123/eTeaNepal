import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../helper/context';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Fetch user data on component mount
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/user/me', {
          headers: {
            'x-auth-token': localStorage.getItem('x-auth-token'),
          },
        });
        setUserData(response.data);
      } catch (error) {
        setError('Failed to fetch user data. Please try again.');
        // Optionally, redirect to login page if the token is invalid
        navigate('/login');
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate]);

  // Handle Logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!userData) {
    return <div>Loading...</div>; // Show a loading state while fetching data
  }

  return (
    <div className="profile__container">
      <h1>Hi, {userData.name.split(' ')[0]}</h1> {/* Display first name */}
      <div className="profile__details">
        <h2>{userData.name}</h2>
        <p>{userData.email}</p>
        <p>{userData.phone || '+977 XXXXXXXX'}</p> {/* Replace with actual phone number if available */}
        <p>{userData.address || 'Your address here'}</p> {/* Replace with actual address if available */}
      </div>
      <div className="profile__actions">
        <button onClick={() => navigate('/change-details')}>Change Details</button>
        <button onClick={() => navigate('/change-password')}>Change Password</button>
        <button onClick={() => navigate('/orders')}>View Orders</button>
        <button onClick={() => navigate('/delete-account')}>Delete Account</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Profile;
