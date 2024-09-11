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

  const handleVerification = async (sellerId) => {
    try {
      await axios.put(
        `https://eteanepalbackend-production.up.railway.app/api/admin/verify/seller/${sellerId}`,
        {},
        {
          headers: {
            "x-auth-token": localStorage.getItem("x-auth-token"),
          },
        }
      );
      alert("Success ✅");
      window.location.reload();
    } catch (err) {
      console.error("Error verifying seller", err);
    }
  };

  if (loading) return <p className="loading">Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="seller-report">
      <h2>Seller Report for </h2>
      <h4 className="seller-report-name">
        {report.seller.name}
        {report.seller.verified ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            x="0px"
            y="0px"
            width="14"
            height="14"
            viewBox="0 0 48 48"
          >
            <circle cx="24" cy="24" r="20" fill="#4dd0e1"></circle>
            <path
              fill="#fff"
              d="M22.491,30.69c-0.576,0-1.152-0.22-1.591-0.659l-6.083-6.084c-0.879-0.878-0.879-2.303,0-3.182 c0.878-0.879,2.304-0.879,3.182,0l6.083,6.084c0.879,0.878,0.879,2.303,0,3.182C23.643,30.47,23.067,30.69,22.491,30.69z"
            ></path>
            <path
              fill="#fff"
              d="M22.491,30.69c-0.576,0-1.152-0.22-1.591-0.659c-0.879-0.878-0.879-2.303,0-3.182l9.539-9.539 c0.878-0.879,2.304-0.879,3.182,0c0.879,0.878,0.879,2.303,0,3.182l-9.539,9.539C23.643,30.47,23.067,30.69,22.491,30.69z"
            ></path>
          </svg>
        ) : (
          ""
        )}
      </h4>
      <p>Email: {report.seller.email}</p>
      <p>Total Sales: Rs{report.totalSales}</p>
      <p>Number of Orders: {report.numberOfOrders}</p>
      <p>Business Name: {report.seller.businessName}</p>
      <p>Business Address: {report.seller.businessAddress}</p>
      <p>Mobile Number {report.seller.mobileNumber}</p>
      <p>panCard Number {report.seller.panCard}</p>
      <p>
        <img
          src={`https://eteanepalbackend-production.up.railway.app/public/${report.seller.panCardDocument}`}
          alt={"Pan card"}
        />
      </p>
      {console.log(report)}
      <h3>Products</h3>
      <ul>
        {report.products.map((product) => (
          <li key={product.id}>
            <h4>
              {product.name}{" "}
              {product.verified ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  x="0px"
                  y="0px"
                  width="14"
                  height="14"
                  viewBox="0 0 48 48"
                >
                  <circle cx="24" cy="24" r="20" fill="#4dd0e1"></circle>
                  <path
                    fill="#fff"
                    d="M22.491,30.69c-0.576,0-1.152-0.22-1.591-0.659l-6.083-6.084c-0.879-0.878-0.879-2.303,0-3.182 c0.878-0.879,2.304-0.879,3.182,0l6.083,6.084c0.879,0.878,0.879,2.303,0,3.182C23.643,30.47,23.067,30.69,22.491,30.69z"
                  ></path>
                  <path
                    fill="#fff"
                    d="M22.491,30.69c-0.576,0-1.152-0.22-1.591-0.659c-0.879-0.878-0.879-2.303,0-3.182l9.539-9.539 c0.878-0.879,2.304-0.879,3.182,0c0.879,0.878,0.879,2.303,0,3.182l-9.539,9.539C23.643,30.47,23.067,30.69,22.491,30.69z"
                  ></path>
                </svg>
              ) : (
                ""
              )}
            </h4>
            <p>Stock: {product.stock}</p>
            <p>Price: Rs{product.price}</p>
            <p>Initial Price: Rs{product.initialPrice}</p>
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
            <p>Ordered Status: {order.status}</p>
          </li>
        ))}
      </ul>
      <li>
        <button
          className="btn clickAnimation"
          onClick={() => handleVerification(sellerId)}
        >
          {report.seller.verified ? "Unverify" : "Verify"}
        </button>
      </li>
    </div>
  );
};

export default SellerReport;
