import {
  CATEGORY_ITEMS,
  CATEGORY_LABELS,
  type CategoryKey,
} from "@/api/categoryData";
import "@/styles/categoryOverlay.scss";
import { RiArrowLeftSLine, RiCloseLine } from "react-icons/ri";

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
        <div className="overlay-btns">
          <button className="overlay-back-btn" onClick={onBack}>
            <RiArrowLeftSLine /> BACK
          </button>

          <button className="overlay-close-btn" onClick={onClose}>
            <RiCloseLine />
          </button>
        </div>

        <div className="overlay-title-container">
          <h2 className="overlay-title">{CATEGORY_LABELS[category]}</h2>
        </div>
      </div>
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
  );
};

export default CategoryOverlay;
