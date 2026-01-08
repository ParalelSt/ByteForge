import { useEffect, useState } from "react";
import { TbTriangleFilled } from "react-icons/tb";
import "@/styles/scrollToTop.scss";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    isVisible && (
      <button className="scroll-to-top-btn" onClick={handleScrollToTop}>
        <TbTriangleFilled />
      </button>
    )
  );
};

export default ScrollToTop;
