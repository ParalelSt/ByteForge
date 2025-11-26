import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "@/styles/globalStyles.scss";
import Home from "@/pages/Home";
import Shop from "@/pages/Shop";
import { CartProvider } from "@/components/context/CartContext";
import { ProductProvider } from "@/components/context/ProductContext";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Layout from "@/components/Layout";
import AdminDashboard from "@/components/admin/AdminDashboard";

function App() {
  return (
    <ProductProvider>
      <CartProvider>
        <Router>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />}></Route>
              <Route path="/shop" element={<Shop />}></Route>
              <Route path="/about" element={<About />}></Route>
              <Route path="/contact" element={<Contact />}></Route>
              <Route path="/account" element={""}></Route>
              <Route path="/admin" element={<AdminDashboard />}></Route>
            </Routes>
          </Layout>
        </Router>
      </CartProvider>
    </ProductProvider>
  );
}

export default App;
