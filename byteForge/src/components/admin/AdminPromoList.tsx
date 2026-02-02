import { useEffect, useState } from "react";
import { getImageUrl } from "@/utils/imageUrl";
import "@/styles/admin/adminPromoList.scss";

interface Promo {
  id: number;
  title: string;
  description: string;
  image: string | null;
  link?: string;
  is_active: boolean;
  created_at: string;
}

interface AdminPromoListProps {
  refreshTrigger?: number;
}

const AdminPromoList = ({ refreshTrigger }: AdminPromoListProps) => {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editLink, setEditLink] = useState("");
  const [editImage, setEditImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");

  const fetchPromos = async () => {
    try {
      setLoading(true);
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/admin/promos`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to load promos");
      setPromos(data);
    } catch (err: any) {
      setError(err.message ?? "Error loading promos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromos();
  }, [refreshTrigger]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (editingId && !target.closest(".admin-promo-list")) {
        handleCancelEdit();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingId]);

  const handleActivate = async (id: number) => {
    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/admin/promos/${id}/activate`, {
        method: "PATCH",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to activate promo");
      fetchPromos();
    } catch (err: any) {
      alert(err.message ?? "Error activating promo");
    }
  };

  const handleEdit = (promo: Promo) => {
    if (editingId !== null) {
      handleCancelEdit();
    }
    setEditingId(promo.id);
    setEditTitle(promo.title);
    setEditDescription(promo.description);
    setEditLink(promo.link || "");
    setImagePreview(
      promo.image
        ? `${
            import.meta.env.VITE_SUPABASE_URL
          }/storage/v1/object/public/promo_images/promo_images/${promo.image}`
        : "",
    );
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditLink("");
    setEditImage(null);
    setImagePreview("");
  };

  const handleSaveEdit = async (id: number) => {
    try {
      if (!editTitle.trim()) {
        alert("Title is required");
        return;
      }

      const formData = new FormData();
      formData.append("title", editTitle);
      formData.append("description", editDescription);
      formData.append("link", editLink);
      if (editImage) formData.append("image", editImage);

      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/admin/promos/${id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const data = await res
          .json()
          .catch(() => ({ error: "Failed to update promo" }));
        throw new Error(data.error || "Failed to update promo");
      }

      handleCancelEdit();
      fetchPromos();
    } catch (err: any) {
      console.error("Update error:", err);
      alert(err.message ?? "Error updating promo");
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this promo?")) return;

    try {
      const apiUrl = import.meta.env.VITE_API_URL;
      const res = await fetch(`${apiUrl}/admin/promos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to delete promo");
      }

      fetchPromos();
    } catch (err: any) {
      alert(err.message ?? "Error deleting promo");
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  if (loading) return <p className="loading">Loading promos…</p>;
  if (error) return <p className="error">Error: {error}</p>;

  return (
    <div className="admin-promo-list">
      <h3>Existing promos</h3>
      {promos.length === 0 && <p className="no-promos">No promos yet.</p>}
      <ul>
        {promos.map((promo) => (
          <li key={promo.id} className={promo.is_active ? "active" : ""}>
            {editingId === promo.id ? (
              <div className="promo-edit-form">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  placeholder="Title"
                  className="edit-input"
                />
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  placeholder="Description"
                  className="edit-textarea"
                />
                <input
                  type="text"
                  value={editLink}
                  onChange={(e) => setEditLink(e.target.value)}
                  placeholder="Link (optional)"
                  className="edit-input"
                />
                <div className="image-upload-section">
                  <label htmlFor={`image-${promo.id}`} className="image-label">
                    {imagePreview ? "Change Image" : "Upload Image"}
                  </label>
                  <input
                    id={`image-${promo.id}`}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="edit-file-input"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="image-preview"
                    />
                  )}
                </div>
                <div className="edit-actions">
                  <button
                    onClick={() => handleSaveEdit(promo.id)}
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
              <div className="promo-item">
                <div className="promo-info">
                  <strong>{promo.title}</strong>
                  <span className="promo-date">
                    {new Date(promo.created_at).toLocaleString()}
                  </span>
                  {promo.is_active && (
                    <span className="active-badge">Active</span>
                  )}
                </div>
                <img
                  src={
                    promo.image
                      ? `${getImageUrl(null, promo.image, "promo")}?t=${Date.parse(
                          promo.created_at,
                        )}`
                      : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100'%3E%3Crect fill='%23141414' width='100' height='100'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23666' font-family='Arial' font-size='12'%3ENo Image%3C/text%3E%3C/svg%3E"
                  }
                  alt={promo.title}
                  className="promo-image"
                />
                <div className="promo-actions">
                  {!promo.is_active && (
                    <button
                      onClick={() => handleActivate(promo.id)}
                      className="activate-btn"
                    >
                      Activate
                    </button>
                  )}
                  <button
                    onClick={() => handleEdit(promo)}
                    className="edit-btn"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(promo.id)}
                    className="delete-btn"
                  >
                    Delete
                  </button>
                </div>
                <div className="promo-description">
                  {promo.description.length > 100
                    ? `${promo.description.substring(0, 100)}...`
                    : promo.description}
                </div>
                {promo.link && (
                  <a
                    href={promo.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="promo-link"
                  >
                    {promo.link}
                  </a>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AdminPromoList;
