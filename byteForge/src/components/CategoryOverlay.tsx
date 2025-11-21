import {
  CATEGORY_ITEMS,
  CATEGORY_LABELS,
  type CategoryKey,
} from "@/api/categoryData";

interface CategoryOverlayProps {
  category: CategoryKey | null;
  isOpen?: boolean;
  onBack: () => void;
  onClose: () => void;
  onSelectSubCategory: (sub: string) => void;
}

const CategoryOverlay = ({
  category,
  isOpen,
  onBack,
  onClose,
  onSelectSubCategory,
}: CategoryOverlayProps) => {
  if (!isOpen || !category) {
    return null;
  }

  return (
    <div className="overlay-container">
      <div className="overlay-top">
        <button className="overlay-back" onClick={onBack}>
          &lt; BACK
        </button>

        <h2 className="overlay-title">{CATEGORY_LABELS[category]}</h2>

        <button className="overlay-close" onClick={onClose}>
          X
        </button>

        <div className="overlay-list">
          {CATEGORY_ITEMS[category].map((item: string) => (
            <button
              key={item}
              className="overlay-list-item"
              onClick={() => onSelectSubCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CategoryOverlay;
