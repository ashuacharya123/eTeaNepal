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
                  "eteanepalbackend-production.up.railway.app/api/admin/all-users",
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
                console.error('Error fetching users:', error);
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
        const filtered = users.filter(user =>
            user.name.toLowerCase().includes(query)
        );
        setFilteredUsers(filtered);
    };

    // Handle delete user
    const handleDelete = async (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            try {
                await axios.delete(
                  `eteanepalbackend-production.up.railway.app/api/admin/delete-user/${userId}`,
                  {
                    headers: {
                      "x-auth-token": localStorage.getItem("x-auth-token"),
                    },
                  }
                );
                setUsers(users.filter(user => user._id !== userId));
                setFilteredUsers(filteredUsers.filter(user => user._id !== userId));
                alert('Successfully deleted');
            } catch (error) {
                console.error('Error deleting user:', error);
            }
        }
    };

    // Handle make admin
    const handleMakeAdmin = async (userId) => {
        try {
            await axios.patch(
              `eteanepalbackend-production.up.railway.app/api/admin/make-admin/${userId}`,
              {},
              {
                headers: {
                  "x-auth-token": localStorage.getItem("x-auth-token"),
                },
              }
            );
            const updatedUsers = users.map(user => 
                user._id === userId ? { ...user, role: 'admin' } : user
            );
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers.filter(user => 
                user._id === userId ? { ...user, role: 'admin' } : user
            ));
        } catch (error) {
            console.error('Error making user admin:', error);
        }
    };

    return (
        <div className="manage-users">
            <h1>All Users</h1>
            <input
                type="text"
                placeholder="Search here"
                value={searchQuery}
                onChange={handleSearchChange}
            />
            {loading ? (
                <p className="loading">Loading...</p>
            ) : (
                filteredUsers.map(user => (
                    <div key={user._id} className="user-item">
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                        <p>{user.role}</p>
                        {user.role === 'buyer' && (
                            <button onClick={() => handleMakeAdmin(user._id)}>Make admin</button>
                        )}
                        <button onClick={() => handleDelete(user._id)}>Delete</button>
                    </div>
                ))
            )}
        </div>
    );
};

export default ManageUsers;
