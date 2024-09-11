import React, { useEffect, useState } from 'react';
import axios from 'axios';

const VerifySeller = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSellers(); // Initial fetch
  }, []);

  const fetchSellers = async () => {
    try {
      const res = await axios.get(
        "eteanepalbackend-production.up.railway.app/api/admin/sellers",
        {
          headers: {
            "x-auth-token": localStorage.getItem("x-auth-token"),
          },
        }
      );
      setSellers(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching sellers', err);
      setLoading(false);
    }
  };

  const handleVerification = async (sellerId) => {
    try {
      await axios.put(
        `eteanepalbackend-production.up.railway.app/api/admin/verify/seller/${sellerId}`,
        {},
        {
          headers: {
            "x-auth-token": localStorage.getItem("x-auth-token"),
          },
        }
      );
      alert("Success ✅")
      fetchSellers(); // Re-fetch sellers after verification
    } catch (err) {
      console.error('Error verifying seller', err);
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <div className="verify-seller">
      <h2>Verify Sellers</h2>
      <ul>
        {sellers.map(seller => (
          <li key={seller._id}>
            <span>{seller.name} ({seller.verified ? 'Verified' : 'Unverified'})</span>
            <span>{seller.email}</span>
            <button onClick={() => handleVerification(seller._id)}>
              {seller.verified ? 'Unverify' : 'Verify'}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default VerifySeller;
