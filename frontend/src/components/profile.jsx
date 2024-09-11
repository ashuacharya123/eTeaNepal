import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
    address: '',
    avatar: null,
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: ''
  });

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "https://eteanepalbackend-production.up.railway.app/api/user/me",
          {
            headers: {
              "x-auth-token": localStorage.getItem("x-auth-token"),
            },
          }
        );
        setUserData(response.data);
        setFormData({
          name: response.data.name,
          email: response.data.email,
          mobileNumber: response.data.mobileNumber || "",
          address: response.data.address || "",
          avatar: null, // Initialize avatar as null
        });
      } catch (error) {
        setError("Failed to fetch user data. Please try again.");
        navigate("/login");
      }
    };

    fetchUserData();
  }, [isAuthenticated, navigate]);

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, avatar: e.target.files[0] });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdateDetails = async () => {
    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("email", formData.email);
    formDataToSend.append("mobileNumber", formData.mobileNumber);
    formDataToSend.append("address", formData.address);
    if (formData.avatar) {
      formDataToSend.append("avatar", formData.avatar);
    }

    try {
      await axios.put(
        "https://eteanepalbackend-production.up.railway.app/api/user/me",
        formDataToSend,
        {
          headers: {
            "x-auth-token": localStorage.getItem("x-auth-token"),
            "Content-Type": "multipart/form-data", // Important for file upload
          },
        }
      );
      setEditDetails(false);
      const response = await axios.get(
        "https://eteanepalbackend-production.up.railway.app/api/user/me",
        {
          headers: {
            "x-auth-token": localStorage.getItem("x-auth-token"),
          },
        }
      );
      setUserData(response.data);
      const { avatar, role, name, address, mobileNumber } = response.data;
      localStorage.setItem("avatar", avatar);
      localStorage.setItem("name", name);
      localStorage.setItem("role", role);
      if (address) {
        localStorage.setItem("address", address);
      } else {
        localStorage.setItem("address", "");
      }
      if (mobileNumber) {
        localStorage.setItem("mobileNumber", mobileNumber);
      } else {
        localStorage.setItem("mobileNumber", "");
      }
      alert("Successfully changed the details");
    } catch (error) {
      setError("Failed to update details. Please try again.");
      alert("Failed to update details. Please try again.");
    }
  };

  const handleChangePassword = async () => {
    try {
      await axios.put(
        "https://eteanepalbackend-production.up.railway.app/api/user/change-password",
        passwordData,
        {
          headers: {
            "x-auth-token": localStorage.getItem("x-auth-token"),
          },
        }
      );
      setEditPassword(false);
      alert("Password Changed Successfully");
    } catch (error) {
      setError("Failed to change password. Please try again.");
    }
  };

  const handleDeleteAccount = async () => {
    const password = prompt("Enter your password to confirm account deletion:");
    if (!password) {
      alert("Password is required to delete the account.");
      return;
    }

    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone."
      )
    ) {
      try {
        await axios.delete(
          "https://eteanepalbackend-production.up.railway.app/api/user/me",
          {
            headers: {
              "x-auth-token": localStorage.getItem("x-auth-token"),
            },
            data: { password },
          }
        );
        logout();
        navigate("/");
      } catch (error) {
        setError("Failed to delete account. Please try again.");
      }
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!userData) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="profile__container">
      <h1>
        Hi, <span>{userData.name.split(" ")[0]}</span>
      </h1>
      <div className="profile__details">
        {!editDetails ? (
          <div className="profile__details__content">
            <img
              src={`https://eteanepalbackend-production.up.railway.app/public/${userData.avatar}`}
              alt="Your Avatar"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
            <h2>{userData.name}</h2>
            <p>{userData.email}</p>
            <p>{userData.mobileNumber || "+977 XXXXXXXX"}</p>
            <p>{userData.address || "Your address here"}</p>
            <button className="btn" onClick={() => setEditDetails(true)}>
              Change Details
            </button>
          </div>
        ) : (
          <div className="profile__details__content__edit">
            <label>Name:</label>
            <input
              name="name"
              value={formData.name}
              onChange={handleFormChange}
            />
            <label>Email:</label>
            <input
              name="email"
              value={formData.email}
              onChange={handleFormChange}
            />
            <label>Mobile Number:</label>
            <input
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleFormChange}
            />
            <label>Address:</label>
            <input
              name="address"
              value={formData.address}
              onChange={handleFormChange}
            />
            <label>Avatar:</label>
            <input type="file" name="avatar" onChange={handleFileChange} />
            <button className="btn" onClick={handleUpdateDetails}>
              OK
            </button>
            <button className="btn" onClick={() => setEditDetails(false)}>
              Cancel
            </button>
          </div>
        )}
      </div>
      <div className="profile__actions">
        <button
          onClick={() => setEditPassword(true)}
          className="btn"
          style={{ backgroundColor: "#E7D400", color: "black" }}
        >
          Change Password
        </button>
        <button
          onClick={handleDeleteAccount}
          className="btn"
          style={{ backgroundColor: "#BF4B4B" }}
        >
          Delete Account
        </button>
        <Link
          to="/orders"
          className="nav-btn"
          id={
            localStorage.getItem("role") === "seller" ||
            localStorage.getItem("role") === "admin"
              ? "dn"
              : ""
          }
        >
          <button>View Orders</button>
        </Link>
        <button onClick={handleLogout} className="btn">
          Logout
        </button>
      </div>
      {editPassword && (
        <div className="profile__details__content__edit">
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
          <button className="btn" onClick={handleChangePassword}>
            Change Password
          </button>
          <button className="btn" onClick={() => setEditPassword(false)}>
            Cancel
          </button>
        </div>
      )}
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default Profile;
