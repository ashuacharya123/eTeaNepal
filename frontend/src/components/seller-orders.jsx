import React, { useState, useEffect } from "react";
import axios from "axios";

const SellerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [sellerId, setSellerId] = useState(""); // Assuming seller ID is fetched from auth or stored in localStorage
  const [userRole, setUserRole] = useState(""); // User role (seller/admin)
  const [statusUpdate, setStatusUpdate] = useState({ orderId: '', status: '' });

  useEffect(() => {
    // Fetch seller ID and role from localStorage or other auth mechanism
    const fetchUserDetails = () => {
      const id = localStorage.getItem('id'); // Fetch seller ID
      const role = localStorage.getItem('role'); // Fetch user role (seller/admin)
      setSellerId(id);
      setUserRole(role);
    };

    fetchUserDetails();
  }, []);

  // Fetch orders for the seller
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get(
          "https://eteanepalbackend-production.up.railway.app/api/orders/seller",
          {
            headers: {
              "x-auth-token": localStorage.getItem("x-auth-token"),
            },
          }
        );
        // Filter orders where sellerId is present in the items array
        const filteredOrders = response.data.filter((order) =>
          order.items.some((item) => item.sellerId.toString() === sellerId)
        );
        setOrders(filteredOrders);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      }
    };

    if (sellerId) {
      fetchOrders();
    }
  }, [sellerId]);

  // Handle status change
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(
        `https://eteanepalbackend-production.up.railway.app/api/orders/${orderId}/status`,
        { status: newStatus },
        { headers: { "x-auth-token": localStorage.getItem("x-auth-token") } }
      );
      setOrders(
        orders.map((order) =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      alert("Order status updated successfully");
    } catch (error) {
      console.error("Failed to update order status:", error);
      alert("Failed to update order status. Please try again later.");
    }
  };

  return (
    <div className="seller-orders__container">
      <h2 className="heading-text">Seller Orders</h2>
      <div className="seller-orders__container__content">
        {orders.length === 0 ? (
          <p>No orders found for you.</p>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              className="seller-orders__container__content__order"
            >
              <h3>Order ID: {order._id}</h3>
              <p>Buyer Name: {order.buyerName}</p>
              <p>
                Ordered on: {new Date(order.orderedAt).toLocaleDateString()}
              </p>
              <p>Address: {order.address}</p>
              <p>Mobile Number: {order.mobileNumber}</p>
              <p>Total: Rs {order.total + order.delivery}</p>
              <p>Status: {order.status}</p>

              {/* Status Update Form */}
              {(userRole === "seller" || userRole === "admin") && (
                <div>
                  <select
                    value={
                      statusUpdate.orderId === order._id
                        ? statusUpdate.status
                        : order.status
                    }
                    onChange={(e) =>
                      setStatusUpdate({
                        orderId: order._id,
                        status: e.target.value,
                      })
                    }
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                  <button
                    className="clickAnimation"
                    onClick={() =>
                      handleStatusChange(order._id, statusUpdate.status)
                    }
                  >
                    Update Status
                  </button>
                </div>
              )}

              <div className="order-items">
                {order.items
                  .filter((item) => item.sellerId.toString() === sellerId) // Filter items for this seller
                  .map((item) => (
                    <div key={item._id} className="order-item">
                      <h4>Product: {item.name}</h4>
                      <p>Quantity: {item.quantity}</p>
                      <p>Price: Rs {item.price}</p>
                    </div>
                  ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default SellerOrder;
