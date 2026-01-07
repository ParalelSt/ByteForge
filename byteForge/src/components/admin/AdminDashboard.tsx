import { useState } from "react";
import AddProduct from "@/components/admin/AddProduct";
import AdminProductList from "@/components/admin/AdminProductList";
import "@/styles/admin/adminDashboard.scss";
import AdminPromo from "./AdminPromo";
import AdminPromoList from "./AdminPromoList";

const AdminDashboard = () => {
  const [adminPassword, setAdminPassword] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [error, setError] = useState("");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleProductAdded = () => {
    console.log("handleProductAdded called, current trigger:", refreshTrigger);
    setRefreshTrigger((prev) => {
      console.log("Setting refresh trigger from", prev, "to", prev + 1);
      return prev + 1;
    });
  };

  const handleLogin = async () => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/admin-login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: adminPassword }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setAuthorized(true);
      } else {
        setError("Wrong password.");
      }
    } catch (error) {
      setError(`Login failed. Please try again. ${error}`);
    }
  };

  if (!authorized) {
    return (
      <div className="admin-login-container">
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin password"
          onChange={(e) => setAdminPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>

        {error && <p className="error">{error}</p>}
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <h2>Admin Dashboard</h2>

      <AddProduct onProductAdded={handleProductAdded} />
      <AdminProductList refreshTrigger={refreshTrigger} />
      <AdminPromo />
      <AdminPromoList />
    </div>
  );
};

export default AdminDashboard;
