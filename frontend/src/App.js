import React from "react";
import "./App.scss";
import Hero from "./components/hero.jsx";
import Details from "./components/details";
import HealthBenifits from "./components/healthBenifits";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Shop from "./components/shop";
import Contact from "./components/contact";
import Footer from "./components/footer";
import Cart from "./components/cart";
import Login from "./components/login";
import Profile from "./components/profile";
import SellerSignup from "./components/seller-signup";
import VerifyOTP from "./components/verify-otp.jsx";
import ForgotResetPassword from "./components/forgot-password.jsx";
import MobileMenu from "./components/mobile_menu";
import Navbar from "./components/navbar";
import { useState } from "react";
import { cartContext, showCart, buy } from "./helper/context";
import Loader from './components/loader.jsx';
import useHttpService from './services/httpService';
import Error500 from './components/505Error';


// ErrorBoundary Component (Optional)
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render shows the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught in ErrorBoundary: ", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  const [cart, setCart] = useState([]);
  const [cartShow, setCartShow] = useState(false);
  const [buyNow, setBuyNow] = useState([]);

  const { loading } = useHttpService();

  return (
    <div className="App">
      {loading && <Loader />}
      
      <ErrorBoundary>
        <Router>
          <cartContext.Provider value={{ cart, setCart }}>
            <buy.Provider value={{ buyNow, setBuyNow }}>
              <showCart.Provider value={{ cartShow, setCartShow }}>
                <Cart />
                <Navbar />
                <MobileMenu />
                <Routes>
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
                  <Route path="/login" element={<Login />} />
                  <Route path="/seller-signup" element={<SellerSignup />} />
                  <Route path="/verify-otp" element={<VerifyOTP />} />
                  <Route path="/forgot-password" element={<ForgotResetPassword />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/500" element={<Error500 />} />

                </Routes>
                <Footer />
              </showCart.Provider>
            </buy.Provider>
          </cartContext.Provider>
        </Router>
      </ErrorBoundary>
    </div>
  );
}

export default App;
