import { CATEGORY_LABELS, type CategoryKey } from "@/api/categoryData";
import "@/styles/category/categoryAccordion.scss";
import SectionContainer from "@/components/common/SectionContainer";
import { RiArrowRightSLine } from "react-icons/ri";

interface CategoryAccordionProps {
  onSelectCategory: (category: CategoryKey) => void;
  onClearCategory: () => void;
  selectedCategory: CategoryKey | null;
  selectedSubCategory: string | null;
}

const CategoryAccordion = ({
  onSelectCategory,
  onClearCategory,
  selectedCategory,
  selectedSubCategory,
}: CategoryAccordionProps) => {
  const categories = Object.keys(CATEGORY_LABELS) as CategoryKey[];
  const isAllSelected =
    selectedCategory === null && selectedSubCategory === null;

  return (
    <SectionContainer className="category-accordion-container">
      <h2>CATEGORIES</h2>
      <button
        className={`category-accordion-item ${isAllSelected ? "selected" : ""}`}
        onClick={() => {
          onClearCategory();
        }}
      >
        <span>All Products</span>
        <span className="arrow">
          <RiArrowRightSLine />
        </span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          className={`category-accordion-item ${
            selectedCategory === cat ? "selected" : ""
          }`}
          onClick={() => onSelectCategory(cat)}
        >
          <span>{CATEGORY_LABELS[cat]}</span>
          <span className="arrow">
            <RiArrowRightSLine />
          </span>
        </button>
      ))}
    </SectionContainer>
  );
};

export default CategoryAccordion;
