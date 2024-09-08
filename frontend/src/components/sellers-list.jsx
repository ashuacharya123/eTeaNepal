import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const SellersList = () => {
  const [sellers, setSellers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchSellers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/sellers', {
          headers: {
            'x-auth-token': localStorage.getItem('x-auth-token'),
          },
        });
        setSellers(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch sellers');
        setLoading(false);
      }
    };

    fetchSellers();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>List of Sellers</h2>
      {sellers.length === 0 ? (
        <p>No sellers found.</p>
      ) : (
        <ul>
          {sellers.map(seller => (
            <li key={seller._id}>
              <Link to={`/seller-report/${seller._id}`}>
                {seller.name}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SellersList;
