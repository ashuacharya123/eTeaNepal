import "./App.scss";
import Hero from "./components/hero.jsx";
import Details from "./components/details";
import HealthBenifits from "./components/healthBenifits";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Shop from "./components/shop";
import Contact from "./components/contact";
import SellerDashboard from "./components/seller-dashboard";
import AdminDashboard from "./components/admin-dashboard";
import Footer from "./components/footer";
import Cart from "./components/cart";
import Login from "./components/login";
import PendingProducts from "./components/product-approval.jsx";
import ManageProducts from "./components/manage-products.jsx";
import ManageUsers from "./components/manage-users.jsx";
import BestDeals from "./components/best-deals.jsx";
import AddProduct from "./components/add-product";
import CompareProducts from "./components/compare-products";
import OrderPage from "./components/orders.jsx";
import SellerOrder from "./components/seller-orders.jsx";
import SellersList from "./components/sellers-list.jsx"
import SellerReport from "./components/seller-report.jsx"
import Profile from "./components/profile";
import SellerSignup from "./components/seller-signup";
import VerifyOTP from "./components/verify-otp.jsx";
import ForgotResetPassword from "./components/forgot-password.jsx";
import MobileMenu from "./components/mobile_menu";
import Navbar from "./components/navbar";
import { useState } from "react";
import { cartContext, showCart, buy } from "./helper/context";

import Error404Page from "./components/error404page.jsx";
import Error500Page from "./components/error500page.jsx";
import ErrorBoundary from "./components/errorBoundary.jsx";

import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51PxLIv084b8IR9XHcyR2jfYQA0gs6yibXHiO2vYNEqHRQOxUXNZuTv9xna3q7F02AoXId9bx7W9yqY5yfUTiw2HL00gkRrQG5o');

function App() {
  const [cart, setCart] = useState([]);
  const [cartShow, setCartShow] = useState(false);
  const [buyNow, setBuyNow] = useState([]);

  return (
    <div className="App">
      {/* <Loader /> */}
      <Router>
        <cartContext.Provider value={{ cart, setCart }}>
          <buy.Provider value={{ buyNow, setBuyNow }}>
            <showCart.Provider value={{ cartShow, setCartShow }}>
              <ErrorBoundary>
                <Elements stripe={stripePromise}>
                  <Cart />
                </Elements>
                <Navbar />
                <MobileMenu />
                <Routes>
                  {localStorage.getItem("role") === "seller" ? (
                    <>
                      <Route path="/seller-orders" element={<SellerOrder />} />
                      <Route
                        path="/"
                        element={
                          <>
                            <SellerDashboard />
                            <Contact />
                          </>
                        }
                      />
                    </>
                  ) : localStorage.getItem("role") === "admin" ? (
                    <>
                      <Route path="/sellers-list" element={<SellersList />} />
                      <Route
                        path="/seller-report/:sellerId"
                        element={<SellerReport />}
                      />
                      <Route
                        path="/product-approval"
                        element={<PendingProducts />}
                      />
                      <Route
                        path="/manage-products"
                        element={<ManageProducts />}
                      />
                      <Route path="/manage-users" element={<ManageUsers />} />
                      <Route
                        path="/"
                        element={
                          <>
                            <AdminDashboard />
                            <Contact />
                          </>
                        }
                      />
                    </>
                  ) : (
                    <Route
                      path="/"
                      element={
                        <>
                          <Hero />
                          <Details />
                          <HealthBenifits />
                          <Shop />
                          <Contact />
                        </>
                      }
                    />
                  )}

                  <Route path="/add-product" element={<AddProduct />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/seller-signup" element={<SellerSignup />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  <Route path="/best-deals" element={<BestDeals />} />
                  <Route
                    path="/compare-products"
                    element={<CompareProducts />}
                  />
                  <Route path="/orders" element={<OrderPage />} />
                  <Route
                    path="/forgot-password"
                    element={<ForgotResetPassword />}
                  />

                  <Route path="/profile" element={<Profile />} />
                  <Route path="/500" element={<Error500Page />} />
                  <Route path="*" element={<Error404Page />} />
                </Routes>
                <Footer />
              </ErrorBoundary>
            </showCart.Provider>
          </buy.Provider>
        </cartContext.Provider>
      </Router>
    </div>
  );
}

export default App;
