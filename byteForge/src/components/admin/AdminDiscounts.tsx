import { useState, useEffect } from "react";
import "@/styles/admin/adminDiscounts.scss";

interface Discount {
  id: number;
  productId: number;
  productName: string;
  percentage: number;
  active: boolean;
}

const AdminDiscounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [products, setProducts] = useState<{ id: number; name: string }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [percentage, setPercentage] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
    fetchDiscounts();
  }, []);

  const fetchProducts = async () => {
    const res = await fetch("http://192.168.1.105:3000/admin/products");
    const data = await res.json();
    setProducts(data.map((p: any) => ({ id: p.id, name: p.name })));
  };

  const fetchDiscounts = async () => {
    const res = await fetch("http://192.168.1.105:3000/admin/discounts");
    const data = await res.json();
    setDiscounts(data);
  };

  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try {
      const res = await fetch("http://192.168.1.105:3000/admin/discounts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct,
          percentage: Number(percentage),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Discount added!");
        setSelectedProduct("");
        setPercentage("");
        fetchDiscounts();
      } else {
        setMessage(data.error || "Failed to add discount");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (id: number, active: boolean) => {
    await fetch(`http://192.168.1.105:3000/admin/discounts/${id}/active`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    fetchDiscounts();
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Delete this discount?")) return;
    await fetch(`http://192.168.1.105:3000/admin/discounts/${id}`, {
      method: "DELETE",
    });
    fetchDiscounts();
  };

  return (
    <div className="admin-discounts">
      <h3>Manage Discounts</h3>
      <form onSubmit={handleAddDiscount} className="add-discount-form">
        <select
          value={selectedProduct}
          onChange={(e) => setSelectedProduct(e.target.value)}
          required
        >
          <option value="">Select Product</option>
          {products.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
        <input
          type="number"
          min="1"
          max="99"
          placeholder="Discount %"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Adding..." : "Add Discount"}
        </button>
        {message && <p className="message">{message}</p>}
      </form>
      <ul className="discount-list">
        {discounts.map((d) => (
          <li key={d.id}>
            <span>
              {d.productName} - {d.percentage}%{" "}
              {d.active ? "(Active)" : "(Inactive)"}
            </span>
            <button onClick={() => handleToggleActive(d.id, d.active)}>
              {d.active ? "Deactivate" : "Activate"}
            </button>
            <button onClick={() => handleDelete(d.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminDiscounts;
