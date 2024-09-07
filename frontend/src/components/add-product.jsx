import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProduct = () => {
  const [productName, setProductName] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productStock, setProductStock] = useState("");
  const [initialPrice, setInitialPrice] = useState("");
  const [finalPrice, setFinalPrice] = useState("");
  const [productImage, setProductImage] = useState(null);
  const navigate = useNavigate(); // Hook to navigate programmatically

  useEffect(() => {
    const userRole = localStorage.getItem("role"); // Retrieve role from local storage
    if (userRole !== "seller") {
      navigate("/"); // Redirect to home page if not a seller
    }
  }, [navigate]);

  const handleFileChange = (event) => {
    setProductImage(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", productName);
    formData.append("description", productDescription);
    formData.append("stock", productStock);
    formData.append("initialPrice", initialPrice);
    formData.append("price", finalPrice);
    if (productImage) {
      formData.append("productImage", productImage);
    }

    try {
      const response = await axios.post(
        "http://localhost:8000/api/seller/product",
        formData,
        {
          headers: {
            "x-auth-token": localStorage.getItem("x-auth-token"),
            "Content-Type": "multipart/form-data", // Required for file uploads
          },
        }
      );

      if (response.status === 200) {
        // Redirect to home page on successful product addition
        alert("Successfully added the new product!")
        navigate("/");
      } else {
        // Handle error
        alert("Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleCancel = () => {
    navigate("/"); // Navigate back to home page
  };

  return (
    <div className="add-product-page">
      <h1>Add a Product</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="productName">Product Name</label>
          <input
            type="text"
            id="productName"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="productDescription">Product Description</label>
          <textarea
            id="productDescription"
            value={productDescription}
            onChange={(e) => setProductDescription(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="productStock">Product Stock</label>
          <input
            type="number"
            id="productStock"
            value={productStock}
            onChange={(e) => setProductStock(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="initialPrice">Initial Price</label>
          <input
            type="number"
            id="initialPrice"
            value={initialPrice}
            onChange={(e) => setInitialPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="finalPrice">Final Price</label>
          <input
            type="number"
            id="finalPrice"
            value={finalPrice}
            onChange={(e) => setFinalPrice(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="productImage">Upload Photo of Product</label>
          <input
            type="file"
            id="productImage"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
        <div className="form-group">
          <button type="submit">Add New Product</button>
          <button type="button" onClick={handleCancel} className="cancel-button">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
