import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../helper/context'; // Ensure this hook provides necessary auth context
import { Link } from 'react-router-dom'; // Import Link for navigation

const AdminDashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalSellers: 0,
    totalBuyers: 0,
    totalProducts: 0,
    totalSales: 0 
  });
  const { user, isAuthenticated } = useAuth(); // Use context to get authenticated user info

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get(
          "https://eteanepalbackend-production.up.railway.app/api/admin/dashboard",
          {
            headers: {
              "x-auth-token": localStorage.getItem("x-auth-token"),
            },
          }
        );
        setDashboardData(response.data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    if (isAuthenticated && localStorage.getItem("role") === "admin") {
      fetchDashboardData();
    }
  }, [isAuthenticated, user]);

  return (
    <div className="seller-dashboard">
      <div className="admin-dashboard__container seller-dashboard__upper__left">
        <h1 className="heading-text">Dashboard</h1>
        <h2>
          Welcome, <span>{localStorage.getItem("name") || "User"}!</span>
        </h2>
        <div className=" seller-dashboard__upper__right">
          <div className="seller-dashboard__upper__right__dashboard-stats">
            <div className="stat">
              <h3>Total Sellers</h3>
              <p>{dashboardData.totalSellers}</p>
            </div>
            <div className="stat">
              <h3>Total Buyers</h3>
              <p>{dashboardData.totalBuyers}</p>
            </div>
            <div className="stat">
              <h3>Total Products</h3>
              <p>{dashboardData.totalProducts}</p>
            </div>
            <div className="stat">
              <h3>Total Sales</h3>
              <p>Rs{dashboardData.totalSales.toFixed(2)}</p>
            </div>
          </div>
        </div>
        <div className="seller-dashboard__upper__right__dashboard-actions">
          <Link
            to="/product-approval"
            className="btn btn-primary clickAnimation"
          >
            Product Approval
          </Link>
          <Link to="/sellers-list" className="btn btn-primary clickAnimation">
            Seller Report
          </Link>
          <Link
            to="/manage-products"
            className="btn btn-primary clickAnimation"
          >
            Manage Products
          </Link>
          <Link to="/manage-users" className="btn  clickAnimation">
            Manage Users
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
