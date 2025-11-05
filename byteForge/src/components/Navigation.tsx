import "@/styles/navigation.scss";
import { Link } from "react-router-dom";
import { useEffect } from "react";

interface NavigationProps {
  isOpen?: boolean;
}

const Navigation = ({ isOpen }: NavigationProps) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  return (
    <nav className={`nav-links ${isOpen ? "open" : ""}`}>
      <Link to={"/shop"}>
        <span>Shop</span>
      </Link>
      <Link to={"/about"}>
        <span>About</span>
      </Link>
      <Link to={"/contact"}>
        <span>Contact</span>
      </Link>
    </nav>
  );
};

export default Navigation;
