import { CATEGORY_LABELS, type CategoryKey } from "@/api/categoryData";
import "@/styles/categoryAccordion.scss";
import SectionContainer from "./SectionContainer";
import { RiArrowRightSLine } from "react-icons/ri";

interface CategoryAccordionProps {
  onSelectCategory: (category: CategoryKey) => void;
}

const CategoryAccordion = ({ onSelectCategory }: CategoryAccordionProps) => {
  const categories = Object.keys(CATEGORY_LABELS) as CategoryKey[];
  return (
    <SectionContainer className="category-accordion-container">
      {categories.map((cat) => (
        <button
          key={cat}
          className="category-accordion-item"
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
