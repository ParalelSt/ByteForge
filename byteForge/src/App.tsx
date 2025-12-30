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
import Authorization from "@/pages/Authorization";
import UserProvider from "@/components/context/UserContext";
import ProtectedRoute from "./pages/ProtectedRoute";
import Account from "./pages/Account";
import ProductDetail from "./pages/ProductDetail";

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <Router>
            <Layout>
              <Routes>
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Home />}></Route>
                  <Route path="/shop" element={<Shop />}></Route>
                  <Route path="/about" element={<About />}></Route>
                  <Route path="/contact" element={<Contact />}></Route>
                  <Route path="/account" element={<Account />}></Route>
                  <Route
                    path="/products/:id"
                    element={<ProductDetail />}
                  ></Route>
                </Route>
                <Route path="/admin" element={<AdminDashboard />}></Route>
                <Route path="/auth" element={<Authorization />}></Route>
              </Routes>
            </Layout>
          </Router>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;
