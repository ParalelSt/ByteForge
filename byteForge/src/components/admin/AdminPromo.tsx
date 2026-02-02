import { useState } from "react";
import "@/styles/admin/adminPromo.scss";

interface AdminPromoProps {
  onPromoCreated?: () => void;
}

const AdminPromo = ({ onPromoCreated }: AdminPromoProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [link, setLink] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  return (
    <div className="admin-promo-form">
      <h3>Create promo</h3>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      <form
        onSubmit={async (e) => {
          e.preventDefault();
          setLoading(true);
          setError("");
          setSuccess("");

          const formData = new FormData();
          formData.append("title", title);
          formData.append("description", description);
          formData.append("link", link);
          if (image) formData.append("image", image);

          try {
            const apiUrl = import.meta.env.VITE_API_URL;
            const res = await fetch(`${apiUrl}/admin/promos`, {
              method: "POST",
              body: formData,
            });
            const data = await res.json();
            if (!res.ok)
              throw new Error(data.message || "Failed to create promo");
            setSuccess("Promo created successfully!");
            setTitle("");
            setDescription("");
            setLink("");
            setImage(null);
            onPromoCreated?.();
          } catch (err) {
            setError((err as Error).message);
          } finally {
            setLoading(false);
          }
        }}
      >
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="text"
          placeholder="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
          required
        />
        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Create Promo"}
        </button>
      </form>
    </div>
  );
};

export default AdminPromo;
