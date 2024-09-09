import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Card from './card';  // Import the Card component

const BestDeals = () => {
    const [topProducts, setTopProducts] = useState([]);  // State to store top products
    const [loading, setLoading] = useState(true);        // State to handle loading

    // Fetch top products data
    useEffect(() => {
        const fetchTopProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/algorithms/top-products');
                setTopProducts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching top products:', error);
                setLoading(false);  // Set loading to false even if there is an error
            }
        };
        
        fetchTopProducts();
    }, []);  

    return (
        <div className="best-deals" style={{
           marginTop:'12rem'
          }}>
            <h1 className='heading-text'>Best Deals</h1>
            {loading ? (
                <p className="loading">Loading...</p>  // Show loading message while fetching data
            ) : (
                    <div className="shop__container ml2 mr2">
                    {topProducts.map(product => (
                        <Card key={product._id} props={product} />  // Render each product with the Card component
                    ))}
                </div>
            )}
        </div>
    );
};

export default BestDeals;
