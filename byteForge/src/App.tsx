import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@/styles/globalStyles.scss";
import Home from "@/pages/Home";
import Shop from "./pages/Shop";
import { CartProvider } from "./components/context/CartContext";
import { ProductProvider } from "./components/context/ProductContext";
import About from "./pages/About";
import Contact from "./pages/Contact";

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/shop" element={<Shop />}></Route>
            <Route path="/about" element={<About />}></Route>
            <Route path="/contact" element={<Contact />}></Route>
          </Routes>
        </Router>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
