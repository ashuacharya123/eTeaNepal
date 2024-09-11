import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // Fetch users
    useEffect(() => {
      const fetchUsers = async () => {
        try {
          const response = await axios.get(
            "https://eteanepalbackend-production.up.railway.app/api/admin/all-users",
            {
              headers: {
                "x-auth-token": localStorage.getItem("x-auth-token"),
              },
            }
          );
          setUsers(response.data);
          setFilteredUsers(response.data);
          setLoading(false);
        } catch (error) {
          console.error("Error fetching users:", error);
          setLoading(false);
        }
      };

      fetchUsers();
    }, []);

    // Handle search input change
    const handleSearchChange = (e) => {
      const query = e.target.value.toLowerCase();
      setSearchQuery(query);

      // Filter users based on search query
      const filtered = users.filter((user) =>
        user.name.toLowerCase().includes(query)
      );
      setFilteredUsers(filtered);
    };

    // Handle delete user
    const handleDelete = async (userId) => {
      if (window.confirm("Are you sure you want to delete this user?")) {
        try {
          await axios.delete(
            `https://eteanepalbackend-production.up.railway.app/api/admin/delete-user/${userId}`,
            {
              headers: {
                "x-auth-token": localStorage.getItem("x-auth-token"),
              },
            }
          );
          setUsers(users.filter((user) => user._id !== userId));
          setFilteredUsers(filteredUsers.filter((user) => user._id !== userId));
          alert("Successfully deleted");
        } catch (error) {
          console.error("Error deleting user:", error);
        }
      }
    };

    // Handle make admin
    const handleMakeAdmin = async (userId) => {
      if (
        window.confirm("Are you sure you want to make this user into admin?")
      ) {
        try {
          await axios.patch(
            `https://eteanepalbackend-production.up.railway.app/api/admin/make-admin/${userId}`,
            {},
            {
              headers: {
                "x-auth-token": localStorage.getItem("x-auth-token"),
              },
            }
          );
          const updatedUsers = users.map((user) =>
            user._id === userId ? { ...user, role: "admin" } : user
          );
          setUsers(updatedUsers);
          setFilteredUsers(
            updatedUsers.filter((user) =>
              user._id === userId ? { ...user, role: "admin" } : user
            )
          );
          alert("Successfully made admin");
        } catch (error) {
          console.error("Error making user admin:", error);
        }
      }
    };

    return (
      <div className="manage-users">
        <h1 className="heading-text">All Users</h1>
        <input
          type="text"
          placeholder="Search here"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        <div className="users-wrapper">
          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            filteredUsers.map((user) => (
              <div key={user._id} className="user-item">
                <span className="user-item-image">
                  <img
                    src={`https://eteanepalbackend-production.up.railway.app/public/${user.avatar}`}
                    alt="Avatar"
                    style={{
                      width: "70px",
                      height: "70px",
                      borderRadius: "50%",
                      objectFit: "cover",
                    }}
                  />
                </span>
                <div className="user-item-description">
                  <p className="user-item-description-name">{user.name}</p>
                  <p>{user.email}</p>
                  <p className="user-item-description-role">{user.role}</p>
                </div>
                <div className="buttons-container">
                  {user.role === "buyer" && (
                    <button
                      className="btn"
                      onClick={() => handleMakeAdmin(user._id)}
                    >
                      Make admin
                    </button>
                  )}
                  <button
                    className="btn"
                    style={{ backgroundColor: "#BF4B4B" }}
                    onClick={() => handleDelete(user._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
};

export default ManageUsers;
