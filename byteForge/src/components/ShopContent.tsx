import { useState } from "react";
import CategoryAccordion from "./CategoryAccordion";
import CategoryHeader from "./CategoryHeader";
import "@/styles/shopContent.scss";
import CategoryOverlay from "./CategoryOverlay";
import type { CategoryKey } from "@/api/categoryData";

const ShopContent = () => {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(
    null
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null
  );

  const handleHeaderToggle = () => {
    setAccordionOpen(!accordionOpen);
  };

  const handleSelectCategory = (category: CategoryKey) => {
    setAccordionOpen(false);
    setActiveCategory(category);
    setOverlayOpen(true);
  };

  const handleBack = () => {
    setOverlayOpen(false);
    setActiveCategory(null);
    setAccordionOpen(true);
  };

  const handleClose = () => {
    setOverlayOpen(false);
    setActiveCategory(null);
  };

  const handleSelectSubCategory = (sub: string) => {
    setSelectedCategory(activeCategory);
    setSelectedSubCategory(sub);
    setOverlayOpen(false);
    setActiveCategory(null);
  };

  return (
    <div className="shop-content-container">
      <CategoryHeader
        onToggle={handleHeaderToggle}
        selectedCategory={selectedCategory}
        selectedSubCategory={selectedSubCategory}
      />
      {accordionOpen && (
        <CategoryAccordion onSelectCategory={handleSelectCategory} />
      )}
      <CategoryOverlay
        category={activeCategory}
        isOpen={overlayOpen}
        onBack={handleBack}
        onClose={handleClose}
        onSelectSubCategory={handleSelectSubCategory}
      />
    </div>
  );
};

export default ShopContent;
