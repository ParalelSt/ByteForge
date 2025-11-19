import "@/styles/navigation.scss";
import { Link } from "react-router-dom";
import { useEffect, useRef, type SetStateAction } from "react";

interface NavigationProps {
  isOpen?: boolean;
  setIsOpen: React.Dispatch<SetStateAction<boolean>>;
}

const Navigation = ({ isOpen, setIsOpen }: NavigationProps) => {
  const navRef = useRef<HTMLDivElement | null>(null);

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
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, setIsOpen]);

  return (
    <nav className="nav-links" ref={navRef}>
      <Link to={"/shop"} onClick={() => setIsOpen(false)}>
        <span>Shop</span>
      </Link>
      <Link to={"/about"} onClick={() => setIsOpen(false)}>
        <span>About</span>
      </Link>
      <Link to={"/contact"} onClick={() => setIsOpen(false)}>
        <span>Contact</span>
      </Link>
    </nav>
  );
};

export default Navigation;
