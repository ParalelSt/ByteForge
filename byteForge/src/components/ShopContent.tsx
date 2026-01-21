import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import CategoryAccordion from "@/components/CategoryAccordion";
import CategoryHeader from "@/components/CategoryHeader";
import "@/styles/shopContent.scss";
import "@/styles/categoryStack.scss";
import CategoryOverlay from "@/components/CategoryOverlay";
import type { CategoryKey } from "@/api/categoryData";
import { CATEGORY_TO_DB } from "@/api/categoryData";
import ShopProducts from "@/components/ShopProducts";
import { useProducts } from "@/components/context/ProductContext";
import ScrollToTop from "./ScrollToTop";

const ShopContent = () => {
  const { refetch } = useProducts();
  const location = useLocation();
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [overlayOpen, setOverlayOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<CategoryKey | null>(
    null,
  );
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey | null>(
    null,
  );
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(
    null,
  );

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024); // or whatever your desktop breakpoint is

  useEffect(() => {
    const handleResize = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    refetch();
  }, []);

  // Restore scroll position when returning to this route
  useEffect(() => {
    const savedScrollPosition = sessionStorage.getItem("shopScrollPosition");
    if (savedScrollPosition) {
      const scrollPos = parseInt(savedScrollPosition, 10);
      // Use a delay to ensure the page has rendered before scrolling
      setTimeout(() => {
        window.scrollTo(0, scrollPos);
        document.documentElement.scrollTop = scrollPos;
        document.body.scrollTop = scrollPos;
      }, 300);

      sessionStorage.removeItem("shopScrollPosition");
    }
  }, [location.pathname]);

  const handleHeaderToggle = () => {
    // Don't toggle accordion if overlay is open
    if (overlayOpen) return;
    setAccordionOpen(!accordionOpen);
  };

  const handleSelectCategory = (category: CategoryKey) => {
    setAccordionOpen(false);
    setActiveCategory(category);
    setOverlayOpen(true);
  };

  const handleSelectMainCategory = (category: CategoryKey) => {
    // Select the main category directly without subcategory
    setSelectedCategory(category);
    setSelectedSubCategory(null);
    setOverlayOpen(false);
    setActiveCategory(null);
    setAccordionOpen(false);
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

  const handleClearCategory = () => {
    setSelectedCategory(null);
    setSelectedSubCategory(null);
    setAccordionOpen(false);
  };

  return (
    <div className="shop-content-container">
      <div className="category-stack-container">
        <CategoryHeader
          onToggle={handleHeaderToggle}
          selectedCategory={selectedCategory}
          selectedSubCategory={selectedSubCategory}
          onClearCategory={handleClearCategory}
        />
        {accordionOpen && (
          <>
            {!isDesktop && (
              <div
                className="accordion-backdrop"
                onClick={() => setAccordionOpen(false)}
              />
            )}
            <CategoryAccordion
              onSelectCategory={handleSelectCategory}
              onClearCategory={handleClearCategory}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
            />
          </>
        )}
        <CategoryOverlay
          category={activeCategory}
          isOpen={overlayOpen}
          onBack={handleBack}
          onClose={handleClose}
          onSelectSubCategory={handleSelectSubCategory}
          onSelectMainCategory={handleSelectMainCategory}
        />
      </div>
      <ShopProducts
        category={selectedCategory ? CATEGORY_TO_DB[selectedCategory] : null}
        subcategory={selectedSubCategory}
      />

      <ScrollToTop />
    </div>
  );
};

export default ShopContent;
