import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const SellerReport = () => {
  const { sellerId } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellerReport = async () => {
      try {
        const response = await axios.get(
          `https://eteanepalbackend-production.up.railway.app/api/admin/seller-report/${sellerId}`,
          {
            headers: {
              "x-auth-token": localStorage.getItem("x-auth-token"),
            },
          }
        );
        setReport(response.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch seller report");
        setLoading(false);
      }
    };

    fetchSellerReport();
  }, [sellerId]);

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Seller Report for {report.seller.name}</h2>
      <p>Email: {report.seller.email}</p>
      <p>Total Sales: Rs{report.totalSales}</p>
      <p>Number of Orders: {report.numberOfOrders}</p>

      <h3>Products</h3>
      <ul>
        {report.products.map((product) => (
          <li key={product.id}>
            <h4>{product.name}</h4>
            <p>Stock: {product.stock}</p>
            <p>Price: Rs{product.price}</p>
            <p>Initial Price: Rs{product.initialPrice}</p>
            <img
              src={`https://eteanepalbackend-production.up.railway.app/public/${product.image}`}
              alt={product.name}
              style={{ width: "100px" }}
            />
          </li>
        ))}
      </ul>

      <h3>Orders</h3>
      <ul>
        {report.orders.map((order) => (
          <li key={order.orderId}>
            <h4>Order ID: {order.orderId}</h4>
            <p>Total: Rs{order.total}</p>
            <p>Delivery: Rs{order.delivery}</p>
            <p>Ordered At: {new Date(order.orderedAt).toLocaleDateString()}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SellerReport;
