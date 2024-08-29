import "./App.scss";
import Hero from "./components/hero.jsx";
import Details from "./components/details";
import HealthBenifits from "./components/healthBenifits";
import Shop from "./components/shop";
import Contact from "./components/contact";
import Footer from "./components/footer";
import Cart from "./components/cart";
import { useState } from "react";
import { cartContext, showCart, buy } from "./helper/context";

function App() {
  const [cart, setCart] = useState([]);
  const [cartShow, setCartShow] = useState(false);
  const [buyNow, setBuyNow] = useState([]);

  return (
    <div className="App ">
      <cartContext.Provider value={{ cart, setCart }}>
        <buy.Provider value={{ buyNow, setBuyNow }}>
          <showCart.Provider value={{ cartShow, setCartShow }}>
            <Cart />
            <Hero />
          </showCart.Provider>
          <Details />
          <HealthBenifits />
          <Shop />
          <Contact />
          <Footer />
        </buy.Provider>
      </cartContext.Provider>
    </div>
  );
}

export default App;
