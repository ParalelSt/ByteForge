import "@/styles/navigation.scss";
import { Link } from "react-router-dom";

interface NavigationProps {
  isOpen?: boolean;
}

const Navigation = ({ isOpen }: NavigationProps) => {
  return (
    <>
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
    </>
  );
};

export default Navigation;
