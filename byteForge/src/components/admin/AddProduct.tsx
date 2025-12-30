import { useState } from "react";
import "@/styles/admin/addProduct.scss";

interface AddProductProps {
  onProductAdded?: () => void;
}

const AddProduct = ({ onProductAdded }: AddProductProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
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
      formData.append("category", category);
      formData.append("subcategory", subcategory);
      if (image) {
        formData.append("image", image);
      }

      console.log("Submitting product:", {
        name,
        description,
        price,
        category,
        subcategory,
        hasImage: !!image,
      });

      const res = await fetch("http://192.168.1.105:3000/admin/products", {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", res.status);
      const data = await res.json();
      console.log("Response data:", data);

      if (data.success) {
        setMessage("Product successfully added!");
        setName("");
        setDescription("");
        setPrice("");
        setCategory("");
        setSubcategory("");
        setImage(null);

        // Reset file input
        const fileInput = document.querySelector(
          'input[type="file"]'
        ) as HTMLInputElement;
        if (fileInput) fileInput.value = "";

        console.log("Product added, calling onProductAdded");
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
        type="text"
        placeholder="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
      />
      <input
        type="text"
        placeholder="Subcategory"
        value={subcategory}
        onChange={(e) => setSubcategory(e.target.value)}
      />

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
