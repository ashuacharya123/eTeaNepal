import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const SellerDashboard = () => {
  const [totalSales, setTotalSales] = useState(0);
  const [totalProducts, setTotalProducts] = useState(0);
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [updatedProduct, setUpdatedProduct] = useState({
    name: "",
    stock: "",
    finalPrice: "",
    initialPrice: "",
    description: "",
    image: null,
    id: "",
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const token = localStorage.getItem("x-auth-token");
        const response = await fetch("/api/seller/dashboard", {
          headers: { "x-auth-token": token },
        });
        const data = await response.json();
        setTotalSales(data.totalSales);
        setTotalProducts(data.totalProducts);
        setProducts(data.products);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleEditClick = (product) => {
    setEditingProduct(product);
    setUpdatedProduct({ ...product, image: null });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedProduct((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    setUpdatedProduct((prevState) => ({
      ...prevState,
      image: e.target.files[0],
    }));
  };

  const handleUpdateProduct = async () => {
    try {
      const token = localStorage.getItem("x-auth-token");

      const formData = new FormData();
      formData.append("name", updatedProduct.name);
      formData.append("stock", updatedProduct.stock);
      formData.append("price", updatedProduct.finalPrice);
      formData.append("initialPrice", updatedProduct.initialPrice);
      formData.append("description", updatedProduct.description);
      if (updatedProduct.image) {
        formData.append("productImage", updatedProduct.image);
      }

      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: "PUT",
        headers: {
          "x-auth-token": token,
        },
        body: formData,
      });

      if (response.ok) {
        const updatedProductData = await response.json();
        setProducts(
          products.map((product) =>
            product._id === updatedProductData._id
              ? updatedProductData
              : product
          )
        );
        setEditingProduct(null);
        alert("Updated successfully");
        window.location.reload();
      } else {
        console.error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  const handleDeleteClick = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const deleteProduct = async () => {
        try {
          const token = localStorage.getItem("x-auth-token");
          const response = await fetch(`/api/products/${productId}`, {
            method: "DELETE",
            headers: { "x-auth-token": token },
          });
          if (response.ok) {
            window.location.reload(); // Reload the page after deleting the product
          } else {
            console.error("Failed to delete product");
          }
        } catch (error) {
          console.error("Error deleting product:", error);
        }
      };

      deleteProduct();
    }
  };

  return (
    <div className="seller-dashboard">
      <div className="seller-dashboard__upper">
        <header className="seller-dashboard__upper__left">
          <h1>Dashboard</h1>
          <h2>
            Welcome, <span>{localStorage.getItem("name") || "User"}!</span>
          </h2>
        </header>
        <div className="seller-dashboard__upper__right">
          <div className="seller-dashboard__upper__right__dashboard-stats">
            <div className="stat">
              <h2>Total Sales</h2>
              <p>Rs {totalSales}</p>
            </div>
            <div className="stat">
              <h2>Total Products</h2>
              <p>{totalProducts}</p>
            </div>
          </div>

          <div className="seller-dashboard__upper__right__dashboard-actions">
            <Link to="/add-product" className="btn btn-primary clickAnimation">
              Add a Product
            </Link>
            <Link to="/seller-orders" className="btn btn-info clickAnimation">
              View Orders
            </Link>
          </div>
        </div>
      </div>
      <div className="seller-dashboard__lower">
        <h1>Your Products</h1>
        <div className="seller-dashboard__lower__product__wrapper">
          {products &&
            products.map((product) => (
              <div
                key={product._id}
                className="seller-dashboard__lower__product__wrapper__product"
              >
                <div className="seller-dashboard__lower__product__wrapper__product__image">
                  <img
                    src={`/public/${product.image}`}
                    alt={product.name}
                    className="product-image"
                  />
                </div>
                <div className="seller-dashboard__lower__product__wrapper__product__details">
                  <p>{product.name}</p>
                  <p>In Stock: {product.stock}</p>
                  <p>Final Price: Rs {product.finalPrice}</p>
                  <p>Initial Price: Rs {product.initialPrice}</p>
                  <div className="seller-dashboard__lower__product__wrapper__product__details__button">
                    <button
                      className="btn btn-edit clickAnimation"
                      onClick={() => handleEditClick(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-delete clickAnimation"
                      style={{ backgroundColor: "red" }}
                      onClick={() => handleDeleteClick(product.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      {editingProduct && (
        <div className="edit-form">
          <h2>Edit Product</h2>
          <label>
            Name:
            <input
              type="text"
              name="name"
              value={updatedProduct.name}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Stock:
            <input
              type="number"
              name="stock"
              value={updatedProduct.stock}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Final Price:
            <input
              type="number"
              name="finalPrice"
              value={updatedProduct.finalPrice}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Initial Price:
            <input
              type="number"
              name="initialPrice"
              value={updatedProduct.initialPrice}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Description:
            <textarea
              name="description"
              value={updatedProduct.description}
              onChange={handleInputChange}
            />
          </label>
          <label>
            Image:
            <input type="file" name="image" onChange={handleImageChange} />
          </label>
          <button
            className="btn btn-update clickAnimation"
            onClick={handleUpdateProduct}
          >
            Update
          </button>
          <button
            className="btn btn-cancel clickAnimation"
            onClick={() => setEditingProduct(null)}
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
