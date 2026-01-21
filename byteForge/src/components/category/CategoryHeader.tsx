import { CATEGORY_LABELS, type CategoryKey } from "@/api/categoryData";
import "@/styles/category/categoryHeader.scss";
import { RiArrowRightSLine } from "react-icons/ri";

/**
 * Category header component
 * Displays current selected category/subcategory and toggles accordion visibility
 */

interface CategoryHeaderProps {
  selectedCategory: CategoryKey | null;
  selectedSubCategory: string | null;
  onToggle: () => void;
  onClearCategory: () => void;
}

const CategoryHeader = ({
  selectedCategory,
  selectedSubCategory,
  onToggle,
}: CategoryHeaderProps) => {
  const displayValue = selectedSubCategory
    ? selectedSubCategory
    : selectedCategory
      ? CATEGORY_LABELS[selectedCategory]
      : "All products";

  return (
    <button className="category-header-container" onClick={onToggle}>
      <div className="category-header-left">
        <div className="category-header-label">CATEGORY</div>
        <div className="category-header-value">{displayValue}</div>
      </div>
      <div className="category-header-right">
        <RiArrowRightSLine />
      </div>
    </button>
  );
};

export default CategoryHeader;
