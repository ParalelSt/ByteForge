import { useEffect, useState } from "react";
import { TbTriangleFilled } from "react-icons/tb";
import "@/styles/common/scrollToTop.scss";

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > 300);

      // Check if near bottom of page (within 100px of bottom)
      const scrolledToBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100;
      setIsAtBottom(scrolledToBottom);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    isVisible && (
      <button
        className={`scroll-to-top-btn ${isAtBottom ? "at-bottom" : ""}`}
        onClick={handleScrollToTop}
      >
        <TbTriangleFilled />
      </button>
    )
  );
};

export default ScrollToTop;
