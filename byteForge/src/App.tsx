import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@/styles/globalStyles.scss";
import Home from "@/pages/Home";
import Shop from "./pages/Shop";
import { CartProvider } from "./components/context/CartContext";
import { ProductProvider } from "./components/context/ProductContext";

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />}></Route>
            <Route path="/shop" element={<Shop />}></Route>
          </Routes>
        </Router>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
