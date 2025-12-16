import "@/styles/navigation.scss";
import { Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

interface NavigationProps {
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const MobileNavigation = ({ isOpen, setIsOpen }: NavigationProps) => {
  const navRef = useRef<HTMLDivElement | null>(null);
  const [closing, setClosing] = useState(false);

  const closeMenu = () => {
    setClosing(true);
    setTimeout(() => {
      setClosing(false);
      setIsOpen(false);
    }, 300);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add("dropdown-open");
    } else {
      document.body.classList.remove("dropdown-open");
    }

    return () => {
      document.body.classList.remove("dropdown-open");
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const stateClass = closing ? "closing" : isOpen ? "open" : "";

  return (
    <div className={`nav-overlay ${stateClass}`}>
      <nav className={`mobile-nav ${stateClass}`} ref={navRef}>
        <Link to={"/shop"} onClick={closeMenu}>
          <span>Shop</span>
        </Link>
        <Link to={"/about"} onClick={closeMenu}>
          <span>About</span>
        </Link>
        <Link to={"/contact"} onClick={closeMenu}>
          <span>Contact</span>
        </Link>
        <Link to={"/account"} onClick={closeMenu}>
          <span>Account</span>
        </Link>
      </nav>
    </div>
  );
};

export default MobileNavigation;
