import React, { useEffect, useState, useCallback } from "react";
import Card from "./card";
import axios from 'axios';
import { Link } from 'react-router-dom';
import debounce from 'lodash.debounce';  // To handle debouncing of search input

const Shop = () => {
  const [cardList, setCardList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('Default');
  const [searchLoading, setSearchLoading] = useState(false);

  // Function to fetch products with sorting and searching
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "eteanepalbackend-production.up.railway.app/api/products",
        {
          params: {
            sort: sortOption === "Default" ? undefined : sortOption,
          },
        }
      );
      const products = response.data.map(product => ({
        ...product,
        image: product.image || "",
      }));
      setCardList(products);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
    setLoading(false);
  };

  // Debounced search function
  const debouncedSearch = useCallback(
    debounce(async (query) => {
      setSearchLoading(true);
      try {
        const response = await axios.get(
          "eteanepalbackend-production.up.railway.app/api/algorithms/search",
          {
            params: { query },
          }
        );
        const products = response.data.map(product => ({
          ...product,
          image: product.image || "",
        }));
        setCardList(products);
      } catch (error) {
        console.error('Error searching products:', error);
      }
      setSearchLoading(false);
    }, 1000),
    []
  );

  useEffect(() => {
    fetchProducts();
  }, [sortOption]);  // Fetch products when sort option changes

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    debouncedSearch(query);
  };

  // Handle sort option change
  const handleSortChange = (e) => {
    setSortOption(e.target.value);
  };

  return (
    <>
      <div className="shop__container ml2 mr2" id="shop">
        <div className="shop__controls">
          <input
            type="text"
            placeholder="search here..."
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <Link to="/compare-products" className="nav-btn">
            <button >Compare Products</button>
          </Link>
          {searchLoading && <p className="loading">Searching...</p>}
          <div className="shop__controls__sort">
          <p>Sort by:</p>
          <select value={sortOption} onChange={handleSortChange}>
            <option value="Default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating-asc">Rating: Low to High</option>
            <option value="rating-desc">Rating: High to Low</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>
          </div>
          
        </div>
        {loading ? (
          <p className="loading">Loading...</p>
        ) : (
          cardList.map((card) => (
            <Card key={card._id} props={card} />
          ))
        )}
      </div>
      <div id="contact"></div>
    </>
  );
};

export default Shop;
