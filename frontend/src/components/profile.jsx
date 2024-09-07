import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../helper/context';

const Profile = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState('');
  const [editDetails, setEditDetails] = useState(false);
  const [editPassword, setEditPassword] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    address: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

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
        setFormData({
          name: response.data.name,
          email: response.data.email,
          mobileNumber: response.data.mobileNumber || '',
          address: response.data.address || '',
        });
      } catch (error) {
        setError('Failed to fetch user data. Please try again.');
        navigate('/login');
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateDetails = async () => {
    try {
      await axios.put('http://localhost:8000/api/user/me', formData, {
        headers: {
          'x-auth-token': localStorage.getItem('x-auth-token'),
        },
      });
      setEditDetails(false);
      const response = await axios.get('http://localhost:8000/api/user/me', {
        headers: {
          'x-auth-token': localStorage.getItem('x-auth-token'),
        },
      });
      setUserData(response.data);
      alert("Successfully changed the details");
    } catch (error) {
      setError('Failed to update details. Please try again.');
      alert("Failed to update details. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.put('http://localhost:8000/api/user/change-password', passwordData, {
        headers: {
          'x-auth-token': localStorage.getItem('x-auth-token'),
        },
      });
      setEditPassword(false);
      alert("Password Changed Successfully");
    } catch (error) {
      setError('Failed to change password. Please try again.');
    }
  };

 // Delete Account Function
const handleDeleteAccount = async () => {
  const password = prompt("Enter your password to confirm account deletion:");
  if (!password) {
    alert("Password is required to delete the account.");
    return;
  }

  if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
    try {
      await axios.delete('http://localhost:8000/api/user/me', {
        headers: {
          'x-auth-token': localStorage.getItem('x-auth-token'),
        },
        data: { password } // Include the password in the request body
      });
      logout();
      navigate('/');
    } catch (error) {
      setError('Failed to delete account. Please try again.');
    }
  }
};


  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!userData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="profile__container">
      <h1>Hi, {userData.name.split(' ')[0]}</h1>
      <div className="profile__details">
        {!editDetails ? (
          <>
            <h2>{userData.name}</h2>
            <p>{userData.email}</p>
            <p>{userData.mobileNumber || '+977 XXXXXXXX'}</p>
            <p>{userData.address || 'Your address here'}</p>
          </>
        ) : (
          <div>
            <label>Name:</label>
            <input name="name" value={formData.name} onChange={handleFormChange} />
            <label>Email:</label>
            <input name="email" value={formData.email} onChange={handleFormChange} />
            <label>mobileNumber:</label>
            <input name="mobileNumber" value={formData.mobileNumber} onChange={handleFormChange} />
            <label>Address:</label>
            <input name="address" value={formData.address} onChange={handleFormChange} />
            <button onClick={handleUpdateDetails}>OK</button>
            <button onClick={() => setEditDetails(false)}>Cancel</button>
          </div>
        )}
      </div>
      <div className="profile__actions">
        <button onClick={() => setEditDetails(true)}>Change Details</button>
        <button onClick={() => setEditPassword(true)}>Change Password</button>
        <button onClick={handleDeleteAccount}>Delete Account</button>
        <button onClick={handleLogout}>Logout</button>
      </div>
      {editPassword && (
        <div>
          <label>Current Password:</label>
          <input
            name="currentPassword"
            placeholder="Current Password"
            type="password"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
          />
          <label>New Password:</label>
          <input
            name="newPassword"
            placeholder="New Password"
            type="password"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
          />
          <button onClick={handleChangePassword}>Change Password</button>
          <button onClick={() => setEditPassword(false)}>Cancel</button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Profile;
