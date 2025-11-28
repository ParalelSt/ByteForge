import { useEffect, useState } from "react";
import "@/styles/admin/adminProductList.scss";

interface AdminProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  featured?: boolean;
}

interface AdminProductListProps {
  refreshTrigger?: number;
}

const AdminProductList = ({ refreshTrigger }: AdminProductListProps) => {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
  });
  const [editImage, setEditImage] = useState<File | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://192.168.1.105:3000/admin/products");
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to load products");
      }

      console.log("Fetched products:", data);
      setProducts(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message ?? "Error loading products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log(
      "AdminProductList useEffect triggered, refreshTrigger:",
      refreshTrigger
    );
    fetchProducts();
  }, [refreshTrigger]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;

    try {
      const res = await fetch(
        `http://192.168.1.105:3000/admin/products/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to delete product");
      }

      setProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Error deleting product");
    }
  };

  const handleEdit = (product: AdminProduct) => {
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
    });
    setEditImage(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({ name: "", description: "", price: "" });
    setEditImage(null);
  };

  const handleUpdateProduct = async (id: number) => {
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", editForm.price);
      if (editImage) {
        formData.append("image", editImage);
      }

      const res = await fetch(
        `http://192.168.1.105:3000/admin/products/${id}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to update product");
      }

      await fetchProducts();
      handleCancelEdit();
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Error updating product");
    }
  };

  const handleToggleFeatured = async (id: number, currentFeatured: boolean) => {
    try {
      const res = await fetch(
        `http://192.168.1.105:3000/admin/products/${id}/featured`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ featured: !currentFeatured }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to toggle featured status");
      }

      setProducts((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, featured: !currentFeatured } : p
        )
      );
    } catch (err: any) {
      console.error(err);
      alert(err.message ?? "Error toggling featured status");
    }
  };

  if (loading) return <p className="loading">Loading products…</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="admin-product-list">
      <h3>Existing products</h3>
      {products.length === 0 && <p className="no-products">No products yet.</p>}

      <ul>
        {products.map((p) => (
          <li key={p.id}>
            {editingId === p.id ? (
              <div className="edit-mode">
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm({ ...editForm, name: e.target.value })
                  }
                  placeholder="Product Name"
                />
                <textarea
                  value={editForm.description}
                  onChange={(e) =>
                    setEditForm({ ...editForm, description: e.target.value })
                  }
                  placeholder="Description"
                />
                <input
                  type="number"
                  value={editForm.price}
                  onChange={(e) =>
                    setEditForm({ ...editForm, price: e.target.value })
                  }
                  placeholder="Price"
                />
                <input
                  type="file"
                  onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                />
                {p.image && (
                  <img
                    src={`http://192.168.1.105:3000/images/product_images/${p.image}`}
                    alt={p.name}
                    className="current-image"
                  />
                )}
                <div className="edit-actions">
                  <button
                    onClick={() => handleUpdateProduct(p.id)}
                    className="save-btn"
                  >
                    Save
                  </button>
                  <button onClick={handleCancelEdit} className="cancel-btn">
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="product-item">
                <div className="product-info">
                  <strong>{p.name}</strong>
                  <span className="price">${Number(p.price).toFixed(2)}</span>
                  {p.featured && (
                    <span className="featured-badge">⭐ Featured</span>
                  )}
                </div>
                <img
                  src={
                    p.image
                      ? `http://192.168.1.105:3000/images/product_images/${p.image}`
                      : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23141414' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-family='Arial' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E"
                  }
                  alt={p.name}
                  className="product-image"
                />
                <div className="product-actions">
                  <button
                    onClick={() =>
                      handleToggleFeatured(p.id, p.featured || false)
                    }
                    className={
                      p.featured ? "featured-btn active" : "featured-btn"
                    }
                  >
                    {p.featured ? "⭐ Featured" : "☆ Feature"}
                  </button>
                  <button onClick={() => handleEdit(p)} className="edit-btn">
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminProductList;
