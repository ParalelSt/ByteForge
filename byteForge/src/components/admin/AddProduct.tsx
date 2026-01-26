import { useState } from "react";
import "@/styles/admin/addProduct.scss";

interface AddProductProps {
  onProductAdded?: () => void;
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

const AddProduct = ({ onProductAdded }: AddProductProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [category, setCategory] = useState("");
  const [subcategory, setSubcategory] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!image) {
      setMessage("Please select an image.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("price", price);
      formData.append("stock", stock);
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      if (image) {
        formData.append("image", image);
      }

      // submit product
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/products`,
        {
          method: "POST",
          body: formData,
        },
      );

      const data = await res.json();

      if (data.success) {
        setMessage("Product successfully added!");
        setName("");
        setDescription("");
        setPrice("");
        setStock("");
        setCategory("");
        setSubcategory("");
        setImage(null);

        // Reset file input
        const fileInput = document.querySelector(
          'input[type="file"]',
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        onProductAdded?.();
      } else {
        setMessage("Failed to add product.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      setMessage(`Failed to add product. ${error}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-product-form">
      <h3>Add Product</h3>

      <input
        type="text"
        placeholder="Product Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="number"
        placeholder="Stock"
        value={stock}
        onChange={(e) => setStock(e.target.value)}
        min="0"
      />

      <select
        value={category}
        onChange={(e) => {
          setCategory(e.target.value);
          setSubcategory(""); // Reset subcategory when category changes
        }}
      >
        <option value="">Select Category</option>
        {Object.keys(CATEGORIES).map((cat) => (
          <option key={cat} value={cat}>
            {cat}
          </option>
        ))}
      </select>

      <select
        value={subcategory}
        onChange={(e) => setSubcategory(e.target.value)}
        disabled={!category}
      >
        <option value="">Select Subcategory</option>
        {category &&
          CATEGORIES[category as keyof typeof CATEGORIES]?.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
      </select>

      <input
        type="file"
        onChange={(e) => setImage(e.target.files?.[0] ?? null)}
      />

      <button type="submit">Add Product</button>

      {message && <p className="message">{message}</p>}
    </form>
  );
};

export default AddProduct;
