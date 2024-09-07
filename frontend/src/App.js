import "./App.scss";
import Hero from "./components/hero.jsx";
import Details from "./components/details";
import HealthBenifits from "./components/healthBenifits";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Shop from "./components/shop";
import Contact from "./components/contact";
import SellerDashboard from "./components/seller-dashboard";
import Footer from "./components/footer";
import Cart from "./components/cart";
import Login from "./components/login";
import AddProduct from "./components/add-product";
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
              <Cart />
              <Navbar />
              <MobileMenu />
              <Routes>
                {localStorage.getItem("role") !== ("seller" || "admin") ? (
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
                ) : (
                  localStorage.getItem("role") === "seller"?
                  <Route
                    path="/"
                    element={
                      <>
                       <SellerDashboard/>
                        <Contact />
                      </>
                    }
                    />:""
                  )}
                  <Route path="/add-product" element={<AddProduct />} />
                <Route path="/login" element={<Login />} />
                <Route path="/seller-signup" element={<SellerSignup />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route
                  path="/forgot-password"
                  element={<ForgotResetPassword />}
                />
                <Route path="/profile" element={
                 
                  
                  <Profile/>
                 
                  } />
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
