import { useEffect, useState } from "react";
import { useCart } from "@/components/context/CartContext";
import { getImageUrl } from "@/utils/imageUrl";
import "@/styles/admin/adminProductList.scss";
import { BsCurrencyEuro } from "react-icons/bs";

interface Discount {
  id: number;
  productId: number;
  percentage: number;
  active: boolean;
}

const CATEGORIES = {
  Games: ["PC Games", "Console Games", "Gift Cards"],
  "PC Components": [
    "Case",
    "SSD",
    "Power Supply",
    "CPUs",
    "GPUs",
    "RAM",
    "Storage",
  ],
  Peripherals: ["Keyboards", "Mice", "Headsets", "Mousepads"],
  "PC Cases": ["ATX Cases", "mATX Cases", "Mini-ITX Cases"],
  Phones: ["Android Phones", "iPhones", "Gaming Phones"],
  Accessories: ["Monitor Lights", "USB Hubs", "Cables", "Mounts"],
  Bundles: ["Keyboard + Mouse Bundle", "Streaming Starter Kit"],
};

interface AdminProduct {
  id: number;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  imageUrl?: string;
  category?: string;
  subcategory?: string;
  featured?: boolean;
}

interface AdminProductListProps {
  refreshTrigger?: number;
}

const AdminProductList = ({ refreshTrigger }: AdminProductListProps) => {
  const { cart, updateItemPrice } = useCart();
  // Discount state
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [selectedProduct, setSelectedProduct] = useState("");
  const [discountPercent, setDiscountPercent] = useState("");
  const [discountMessage, setDiscountMessage] = useState("");
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountFilterHasDiscount, setDiscountFilterHasDiscount] =
    useState("");
  // Fetch discounts
  const fetchDiscounts = async () => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/admin/discounts`);
      if (!res.ok) {
        console.error("Failed to fetch discounts:", res.status);
        return;
      }
      const data = await res.json();
      setDiscounts(data);
    } catch (err: any) {
      console.error("Error fetching discounts:", err);
    }
  };

  useEffect(() => {
    fetchDiscounts();
  }, [refreshTrigger]);
  // Add discount handler
  const handleAddDiscount = async (e: React.FormEvent) => {
    e.preventDefault();
    setDiscountLoading(true);
    setDiscountMessage("");
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/admin/discounts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: selectedProduct,
          percentage: Number(discountPercent),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setDiscountMessage("Discount added!");
        setSelectedProduct("");
        setDiscountPercent("");
        fetchDiscounts();

        // Update cart price if item is in cart
        const product = products.find((p) => String(p.id) === selectedProduct);
        if (
          product &&
          cart.some((item) => String(item.id) === selectedProduct)
        ) {
          const discountedPrice =
            product.price * (1 - Number(discountPercent) / 100);
          updateItemPrice(selectedProduct, discountedPrice);
        }
      } else {
        setDiscountMessage(data.error || "Failed to add discount");
      }
    } finally {
      setDiscountLoading(false);
    }
  };
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    subcategory: "",
  });
  const [editImage, setEditImage] = useState<File | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  // Filter state
  const [filterCategory, setFilterCategory] = useState("");
  const [filterSubcategory, setFilterSubcategory] = useState("");
  const [filterFeatured, setFilterFeatured] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/admin/products`);
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

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (editingId && !target.closest(".admin-product-list")) {
        handleCancelEdit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingId]);

  const handleDelete = async (id: number) => {
    if (!confirm("Delete this product?")) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/admin/products/${id}`, {
        method: "DELETE",
      });

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
    if (editingId !== null) {
      handleCancelEdit();
    }
    setEditingId(product.id);
    setEditForm({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category || "",
      subcategory: product.subcategory || "",
    });
    setEditImage(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditForm({
      name: "",
      description: "",
      price: "",
      category: "",
      subcategory: "",
    });
    setEditImage(null);
  };

  const handleUpdateProduct = async (id: number) => {
    try {
      const formData = new FormData();
      formData.append("name", editForm.name);
      formData.append("description", editForm.description);
      formData.append("price", editForm.price);
      formData.append("category", editForm.category);
      formData.append("subcategory", editForm.subcategory);
      if (editImage) {
        formData.append("image", editImage);
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/products/${id}`,
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
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/admin/products/${id}/featured`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ featured: !currentFeatured }),
      });

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

  // Filtered products
  const filteredProducts = products.filter((product) => {
    const matchesName = product.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !filterCategory || product.category === filterCategory;
    const matchesSubcategory =
      !filterSubcategory || product.subcategory === filterSubcategory;
    const matchesFeatured =
      !filterFeatured ||
      (filterFeatured === "featured" ? product.featured : !product.featured);

    // Discount filter
    const hasDiscount = discounts.some(
      (d) => d.productId === product.id && d.active
    );
    const matchesDiscount =
      !discountFilterHasDiscount ||
      (discountFilterHasDiscount === "with_discount"
        ? hasDiscount
        : !hasDiscount);

    return (
      matchesName &&
      matchesCategory &&
      matchesSubcategory &&
      matchesFeatured &&
      matchesDiscount
    );
  });

  if (loading) return <p className="loading">Loading products…</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="admin-product-list">
      <h3>Existing products</h3>

      <div className="search-bar-container">
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={filterCategory}
          onChange={(e) => {
            setFilterCategory(e.target.value);
            setFilterSubcategory("");
          }}
        >
          <option value="">All Categories</option>
          {Object.keys(CATEGORIES).map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <select
          value={filterSubcategory}
          onChange={(e) => setFilterSubcategory(e.target.value)}
          disabled={!filterCategory}
        >
          <option value="">All Subcategories</option>
          {filterCategory &&
            CATEGORIES[filterCategory as keyof typeof CATEGORIES]?.map(
              (sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              )
            )}
        </select>
        <select
          value={filterFeatured}
          onChange={(e) => setFilterFeatured(e.target.value)}
        >
          <option value="">All</option>
          <option value="featured">Featured</option>
          <option value="not_featured">Not Featured</option>
        </select>
      </div>

      {filteredProducts.length === 0 && (
        <p className="no-products">
          {searchTerm ? "No products match your search." : "No products yet."}
        </p>
      )}

      <ul>
        {filteredProducts.map((p) => (
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
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      category: e.target.value,
                      subcategory: "",
                    })
                  }
                >
                  <option value="">Select Category</option>
                  {Object.keys(CATEGORIES).map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                <select
                  value={editForm.subcategory}
                  onChange={(e) =>
                    setEditForm({ ...editForm, subcategory: e.target.value })
                  }
                  disabled={!editForm.category}
                >
                  <option value="">Select Subcategory</option>
                  {editForm.category &&
                    CATEGORIES[
                      editForm.category as keyof typeof CATEGORIES
                    ]?.map((sub) => (
                      <option key={sub} value={sub}>
                        {sub}
                      </option>
                    ))}
                </select>
                <input
                  type="file"
                  onChange={(e) => setEditImage(e.target.files?.[0] || null)}
                />
                {p.image && (
                  <img
                    src={getImageUrl(p.imageUrl, p.image, "product")}
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
              <>
                <img
                  src={
                    p.image
                      ? getImageUrl(p.imageUrl, p.image, "product")
                      : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23141414' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-family='Arial' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E"
                  }
                  alt={p.name}
                  className="product-image"
                />
                <div className="product-info">
                  <strong>{p.name}</strong>
                  {/* Discounted price display layered on top */}
                  {(() => {
                    const discount = discounts.find(
                      (d) => d.productId === p.id && d.active
                    );
                    if (discount) {
                      const discounted = (
                        p.price *
                        (1 - discount.percentage / 100)
                      ).toFixed(2);
                      return (
                        <span className="price-group">
                          <span className="price-flex original-price">
                            {Number(p.price).toFixed(2)}
                            <BsCurrencyEuro className="currency-icon" />
                          </span>
                          <span className="price-flex discounted-price">
                            {discounted}
                            <BsCurrencyEuro className="currency-icon" />
                          </span>
                        </span>
                      );
                    }
                    return (
                      <span className="price-flex price">
                        {Number(p.price).toFixed(2)}
                        <BsCurrencyEuro className="currency-icon" />
                      </span>
                    );
                  })()}
                  {p.featured && (
                    <span className="featured-badge">⭐ Featured</span>
                  )}
                </div>
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
              </>
            )}
          </li>
        ))}
      </ul>
      {/* Discount assignment UI layered below product list */}
      <div className="discount-assignment-container">
        <h4>Assign Discount to Product</h4>

        {/* Discount status filter */}
        <div className="discount-status-filter">
          <select
            value={discountFilterHasDiscount}
            onChange={(e) => setDiscountFilterHasDiscount(e.target.value)}
          >
            <option value="">All Products</option>
            <option value="with_discount">With Discount</option>
            <option value="no_discount">No Discount</option>
          </select>
        </div>

        {/* Filtered product list */}
        <div className="product-list-grid">
          {products
            .filter((p) => {
              const matchesSearch = p.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
              const matchesCategory =
                !filterCategory || p.category === filterCategory;
              const matchesSubcategory =
                !filterSubcategory || p.subcategory === filterSubcategory;
              const hasDiscount = discounts.some(
                (d) => d.productId === p.id && d.active
              );
              const matchesDiscountStatus =
                !discountFilterHasDiscount ||
                (discountFilterHasDiscount === "with_discount"
                  ? hasDiscount
                  : !hasDiscount);

              return (
                matchesSearch &&
                matchesCategory &&
                matchesSubcategory &&
                matchesDiscountStatus
              );
            })
            .map((p) => {
              const hasDiscount = discounts.some(
                (d) => d.productId === p.id && d.active
              );
              const discountInfo = discounts.find(
                (d) => d.productId === p.id && d.active
              );
              return (
                <div
                  key={p.id}
                  className={`product-item ${
                    selectedProduct === String(p.id) ? "selected" : ""
                  }`}
                  onClick={() => setSelectedProduct(String(p.id))}
                >
                  <p className="product-name">
                    {p.name}
                    {hasDiscount && (
                      <span className="discount-badge">
                        {discountInfo?.percentage}% OFF
                      </span>
                    )}
                  </p>
                  <p className="product-price">
                    <span className="price-flex">
                      {Number(p.price || 0).toFixed(2)}
                      <BsCurrencyEuro className="currency-icon" />
                    </span>
                  </p>
                </div>
              );
            })}
        </div>

        <form onSubmit={handleAddDiscount} className="add-discount-form">
          <input
            type="number"
            min="1"
            max="99"
            placeholder="Discount %"
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            required
            disabled={!selectedProduct}
          />
          <button type="submit" disabled={discountLoading || !selectedProduct}>
            {discountLoading ? "Adding..." : "Add Discount"}
          </button>
          {discountMessage && <p className="message">{discountMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default AdminProductList;
