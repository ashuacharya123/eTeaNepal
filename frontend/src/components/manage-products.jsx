import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ManageProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    initialPrice: ''
  });

  // Fetch products from the server
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://eteanepalbackend-production.up.railway.app/api/products",
          {
            headers: {
              "x-auth-token": localStorage.getItem("x-auth-token"),
            },
          }
        );
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Handle product deletion
  const handleDelete = async (productId) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (confirmed) {
      try {
        await axios.delete(
          `https://eteanepalbackend-production.up.railway.app/api/products/${productId}`,
          {
            headers: {
              "x-auth-token": localStorage.getItem("x-auth-token"),
            },
          }
        );
        alert("Successfully Deleted ✅");
        setProducts(products.filter((product) => product._id !== productId));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  // Handle product editing
  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: product.price || '',
      stock: product.stock || '',
      initialPrice: product.initialPrice || ''
    });
  };

  // Handle form data change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Submit updated product data
  const handleSave = async () => {
    if (editingProduct) {
      try {
        await axios.put(
          `https://eteanepalbackend-production.up.railway.app/api/products/${editingProduct._id}`,
          formData,
          {
            headers: {
              "x-auth-token": localStorage.getItem("x-auth-token"),
            },
          }
        );
        // Update product list with new data
        setProducts(products.map(product =>
          product._id === editingProduct._id ? { ...product, ...formData } : product
        ));
        alert("Successfully Updated ✅")
        setEditingProduct(null); // Close the edit form
      } catch (error) {
        console.error('Error updating product:', error);
        alert('Error updating product:');
      }
    }
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  return (
    <div className="manage-products">
      {editingProduct ? (
        <div className="edit-product-form">
          <h1>Edit Product</h1>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Price</label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <label>Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
            />
          </div>
          

          <div className="form-group">
            <label>Initial Price</label>
            <input
              type="number"
              name="initialPrice"
              value={formData.initialPrice}
              onChange={handleChange}
            />
          </div>
          <div className="form-actions">
            <button onClick={handleSave}>Save</button>
            <button onClick={handleCancel}>Cancel</button>
          </div>
        </div>
      ) : (
        <>
          <h1>Manage Products</h1>
          <h2>Welcome, Ashish!</h2>
          {loading ? (
            <p className="loading">Loading...</p>
          ) : (
            <div className="product-list">
              {products.map(product => (
                <div key={product._id} className="product-item">
                  <div className="product-info">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>In Stock {product.stock}</p>
                    <p>Final price Rs {product.price}</p>
                    {product.initialPrice && <p>Initial price Rs {product.initialPrice}</p>}
                  </div>
                  <div className="product-actions">
                    <button onClick={() => handleEdit(product)}>Edit</button>
                    <button onClick={() => handleDelete(product._id)}>Delete</button>

                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ManageProducts;
