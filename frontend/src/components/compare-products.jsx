import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompareProducts = () => {
    const [products, setProducts] = useState([]);
    const [selectedProductIds, setSelectedProductIds] = useState([]);
    const [comparisonData, setComparisonData] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch all products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/products', {
                    headers: {
                        'x-auth-token': localStorage.getItem('x-auth-token'),
                    },
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };

        fetchProducts();
    }, []);

    // Handle product selection
    const handleProductSelect = (productId) => {
        setSelectedProductIds(prevIds =>
            prevIds.includes(productId)
                ? prevIds.filter(id => id !== productId)
                : [...prevIds, productId]
        );
    };

    // Handle compare button click
    const handleCompare = async () => {
        if (selectedProductIds.length < 2) {
            alert('Select at least two products to compare.');
            return;
        }

        setLoading(true);

        try {
            const response = await axios.get('http://localhost:8000/api/algorithms/compare-products', {
                params: { ids: selectedProductIds.join(',') },
                headers: {
                    'x-auth-token': localStorage.getItem('x-auth-token'),
                },
            });

            setComparisonData(response.data);
        } catch (error) {
            console.error('Error fetching comparison data:', error);
        }

        setLoading(false);
    };

    return (
        <div className="compare-products">
            <h1>Compare Products</h1>
            <div>
                <h2>Select Products</h2>
                {products.length === 0 ? (
                    <p>Loading products...</p>
                ) : (
                    products.map(product => (
                        <div key={product._id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={selectedProductIds.includes(product._id)}
                                    onChange={() => handleProductSelect(product._id)}
                                />
                                {product.name}
                            </label>
                        </div>
                    ))
                )}
            </div>
            <button onClick={handleCompare} disabled={loading}>
                {loading ? 'Comparing...' : 'Compare'}
            </button>
            {comparisonData && (
                <div className="comparison-results">
                    <h2>Comparison Results</h2>
                    {comparisonData.map((product, index) => (
                        <div key={product._id} className="comparison-item">
                            <h3>{index + 1}. {product.name}</h3>
                            <p>Description: {product.description}</p>
                            <p>Price: Rs {product.price}</p>
                            <p>Stock: {product.stock}</p>
                            {/* Add more product details here */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CompareProducts;
