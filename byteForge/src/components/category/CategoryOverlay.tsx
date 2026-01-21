import {
  CATEGORY_ITEMS,
  CATEGORY_LABELS,
  type CategoryKey,
} from "@/api/categoryData";
import "@/styles/category/categoryOverlay.scss";
import { RiArrowLeftSLine, RiCloseLine } from "react-icons/ri";

interface CategoryOverlayProps {
  category: CategoryKey | null;
  isOpen?: boolean;
  onBack: () => void;
  onClose: () => void;
  onSelectSubCategory: (sub: string) => void;
  onSelectMainCategory: (category: CategoryKey) => void;
}

const CategoryOverlay = ({
  category,
  isOpen,
  onBack,
  onClose,
  onSelectSubCategory,
  onSelectMainCategory,
}: CategoryOverlayProps) => {
  if (!isOpen || !category) {
    return null;
  }

  return (
    <>
      <div className="overlay-backdrop" onClick={onClose} />
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
          <button
            className="overlay-list-item overlay-all-category"
            onClick={() => onSelectMainCategory(category)}
          >
            All {CATEGORY_LABELS[category]}
          </button>
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
    </>
  );
};

export default CategoryOverlay;
